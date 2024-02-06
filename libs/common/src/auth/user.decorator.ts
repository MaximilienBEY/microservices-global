import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  SetMetadata,
  UseGuards,
} from "@nestjs/common"

import { UserType } from "../schemas/user/types"
import { AdminGuard } from "./guards/admin.guard"

export const IS_PUBLIC_KEY = "isPublic"
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const getCurrentUserByContext = (context: ExecutionContext): UserType => {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest().user
  } else if (context.getType() === "rpc") {
    return context.switchToRpc().getData().user
  } else throw new InternalServerErrorException("Unknown context type")
}

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const user = getCurrentUserByContext(ctx)

  return user
})

export const Admin = () => applyDecorators(UseGuards(AdminGuard))
