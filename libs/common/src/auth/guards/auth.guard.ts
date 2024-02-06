import { UserType } from "@app/common/schemas/user/types"
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ClientProxy } from "@nestjs/microservices"
import { Request } from "express"
import { catchError, lastValueFrom, throwError } from "rxjs"

import { IS_PUBLIC_KEY } from "../user.decorator"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject("AUTH") private authClient: ClientProxy,
  ) {}

  private addUser(user: UserType, context: ExecutionContext) {
    if (context.getType() === "rpc") {
      context.switchToRpc().getData().user = user
    } else if (context.getType() === "http") {
      context.switchToHttp().getRequest().user = user
    }
  }
  private getAuthentification(context: ExecutionContext) {
    let authentication: string | undefined
    if (context.getType() === "rpc") {
      authentication = context.switchToRpc().getData().Authentication
    } else if (context.getType() === "http") {
      const request = context.switchToHttp().getRequest()
      authentication = this.extractTokenFromHeader(request)
    }
    if (!authentication) {
      throw new UnauthorizedException("No value was provided for Authentication")
    }
    return authentication
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const jwtToken = this.getAuthentification(context)
    if (!jwtToken) throw new UnauthorizedException()

    // const userId = await this.authService.decodeToken(jwtToken).then(token => token?.sub)
    // if (!userId) throw new UnauthorizedException()

    // const user = await this.userService.findOne(userId).catch(() => null)
    // if (!user) throw new UnauthorizedException()

    const user = await lastValueFrom(
      this.authClient
        .send("auth.decode", { token: jwtToken })
        .pipe(catchError(() => throwError(() => new UnauthorizedException()))),
    )

    this.addUser(user, context)

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}
