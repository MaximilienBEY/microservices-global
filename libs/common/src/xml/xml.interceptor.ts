import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Builder } from "xml2js"

@Injectable()
export class XmlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
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
