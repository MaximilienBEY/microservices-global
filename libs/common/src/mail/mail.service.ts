import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "maildev", // the hostname of your maildev docker container
      port: 25, // the SMTP port opened by maildev
      ignoreTLS: true, // maildev does not support STARTTLS
      // other options if necessary
    })
  }
  async sendEmail(email: string | string[], subject: string, content: string) {
    await this.transporter.sendMail({
      to: email,
      from: "no-reply@movie.app",
      subject,
      html: content,
    })
  }
}
