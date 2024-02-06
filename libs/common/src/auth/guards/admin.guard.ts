import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

import { getCurrentUserByContext } from "../user.decorator"

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = getCurrentUserByContext(context)

    return user?.role === "ADMIN"
  }
}
