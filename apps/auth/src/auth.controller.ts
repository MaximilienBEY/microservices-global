import { Public, User } from "@app/common/auth/user.decorator"
import { authResponseSchema, tokensSchema } from "@app/common/schemas/auth/schema"
import { UserReadType, UserType } from "@app/common/schemas/user/types"
import { Body, Controller, Get, Inject, Patch, Post, UnauthorizedException } from "@nestjs/common"
import { ClientProxy, EventPattern, RpcException } from "@nestjs/microservices"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { Throttle } from "@nestjs/throttler"
import { zodToOpenAPI } from "nestjs-zod"
import { catchError, lastValueFrom } from "rxjs"

import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RefreshDto } from "./dto/refresh.dto"
import { RegisterDto } from "./dto/register.dto"
import { UpdateMeDto } from "./dto/update-me.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject("USER") private userClient: ClientProxy,
  ) {}

  @Public()
  @Throttle({ default: { ttl: 60 * 1000, limit: 5 } }) // 5 requests per minute
  @Post("login")
  @ApiOkResponse({ schema: zodToOpenAPI(authResponseSchema) })
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.loginUser(email, password)
  }

  @Public()
  @Throttle({ default: { ttl: 60 * 1000, limit: 5 } }) // 5 requests per minute
  @Post("register")
  @ApiOkResponse({ schema: zodToOpenAPI(authResponseSchema) })
  async register(@Body() body: RegisterDto) {
    return this.authService.registerUser(body)
  }

  @Public()
  @Throttle({ default: { ttl: 60 * 1000, limit: 5 } }) // 5 requests per minute
  @Post("refresh")
  @ApiOkResponse({ schema: zodToOpenAPI(tokensSchema) })
  async refresh(@Body() { token }: RefreshDto) {
    return this.authService.refreshToken(token)
  }

  @Get("me")
  async me(@User() user: UserType) {
    return user
  }

  @Patch("me")
  async updateMe(@User() user: UserType, @Body() body: UpdateMeDto) {
    return this.authService.updateUser(user.uid, body)
  }

  @EventPattern("auth.decode")
  async decodeToken({ token }: { token: string }) {
    const userId: string | undefined = await this.authService
      .decodeToken(token)
      .then(token => token?.sub)
    if (!userId) throw new RpcException(new UnauthorizedException())

    const user: UserReadType = await lastValueFrom(
      this.userClient.send("user.find.id", { id: userId }).pipe(
        catchError(() => {
          throw new RpcException(new UnauthorizedException())
        }),
      ),
    )
    return user
  }
}
