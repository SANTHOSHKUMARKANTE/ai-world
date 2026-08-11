import nodemailer, { type Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import type { EmailDelivery, EmailMessage } from './email-delivery';

export interface SmtpEmailDeliveryOptions {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly from: string;
  readonly username?: string;
  readonly password?: string;
}

export class SmtpEmailDelivery implements EmailDelivery {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from: string;

  public constructor(options: SmtpEmailDeliveryOptions) {
    const hasUsername = options.username !== undefined;
    const hasPassword = options.password !== undefined;

    if (hasUsername !== hasPassword) {
      throw new Error('SMTP username and password must be configured together.');
    }

    const transportOptions: SMTPTransport.Options = {
      host: options.host,
      port: options.port,
      secure: options.secure,
      disableFileAccess: true,
      disableUrlAccess: true,
      ...(hasUsername && hasPassword
        ? {
            auth: {
              user: options.username,
              pass: options.password,
            },
          }
        : {}),
    };

    this.transporter = nodemailer.createTransport(transportOptions);
    this.from = options.from;
  }

  public async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html === undefined ? {} : { html: message.html }),
    });
  }
}
