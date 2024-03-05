import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Builder } from "xml2js"

@Injectable()
export class CommonInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (!data) throw new HttpException("", HttpStatus.NO_CONTENT)

        const ctx = context.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        if (request.headers["accept"] === "application/xml") {
          const builder = new Builder()
          const xml = builder.buildObject(Array.isArray(data) ? { data } : data)
          response.setHeader("Content-Type", "application/xml")
          return xml
        }

        return data
      }),
    )
  }
}
