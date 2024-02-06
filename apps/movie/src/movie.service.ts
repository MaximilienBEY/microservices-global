import { PrismaService } from "@app/common"
import { Injectable } from "@nestjs/common"

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}
  getHello() {
    return this.prisma.user.findMany()
  }
}
