import { User } from "@prisma/client"

import { UserType } from "../schemas/user/types"

export const formatUser = (u: User): UserType => {
  const user: UserType & { password?: string } = { ...u }
  delete user.password

  return user
}
