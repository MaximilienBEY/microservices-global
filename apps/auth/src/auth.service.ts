import { PrismaService } from "@app/common"
import { formatUser } from "@app/common/auth/format"
import { generateToken } from "@app/common/auth/token"
import {
  AuthResponseType,
  AuthTokensType,
  RegisterType,
  UserMeUpdateType,
} from "@app/common/schemas/auth/types"
import { UserReadType } from "@app/common/schemas/user/types"
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { ClientProxy } from "@nestjs/microservices"
import * as bcrypt from "bcrypt"
import { catchError, lastValueFrom } from "rxjs"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    @Inject("USER") private userClient: ClientProxy,
    // private readonly userService: UserService,
  ) {}

  private async generateTokens(userUid: string): Promise<AuthTokensType> {
    const rToken = generateToken(32)
    const expiredAt = new Date(new Date().getTime() + 1 * 60 * 60 * 1000) // 1 hour
    await this.prisma.refreshToken.create({ data: { token: rToken, expiredAt, userUid } })

    const refreshToken = await this.jwtService.signAsync({ sub: rToken }, { expiresIn: "1h" })
    const accessToken = await this.jwtService.signAsync({ sub: userUid }, { expiresIn: "5m" })

    return { refreshToken, accessToken }
  }

  async decodeToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch (error) {
      return null
    }
  }

  async loginUser(email: string, password: string): Promise<AuthResponseType> {
    const user: UserReadType = await lastValueFrom(
      this.userClient.send("user.find.email", { email }).pipe(
        catchError(() => {
          throw new NotFoundException("User not found")
        }),
      ),
    )

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new BadRequestException("Invalid credentials")

    const tokens = await this.generateTokens(user.uid)
    return { user: formatUser(user), tokens }
  }

  async refreshToken(rToken: string): Promise<AuthTokensType> {
    const token = await this.decodeToken(rToken)
    if (!token) throw new BadRequestException("Invalid token")

    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: { token: token.sub as string },
    })
    if (!refreshToken) throw new BadRequestException("Invalid token")

    await this.prisma.refreshToken.delete({ where: { id: refreshToken.id } })
    const tokens = await this.generateTokens(refreshToken.userUid)
    return tokens
  }

  async registerUser(data: RegisterType): Promise<AuthResponseType> {
    const user: UserReadType = await lastValueFrom(
      this.userClient.send("user.create", { ...data, role: "USER" }).pipe(
        catchError(() => {
          throw new BadRequestException("User already exists")
        }),
      ),
    )
    // const user = await this.userService.create({ ...data, role: "USER" })
    const tokens = await this.generateTokens(user.uid)

    return { user, tokens }
  }

  async updateUser(userId: string, data: UserMeUpdateType) {
    return lastValueFrom(
      this.userClient.send("user.update", { id: userId, data }).pipe(
        catchError(() => {
          throw new BadRequestException()
        }),
      ),
    )
  }
}
