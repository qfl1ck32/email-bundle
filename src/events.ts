import { Event } from "@kaviar/core";
import { IEmailTemplate } from "./defs";
import { MailOptions } from "nodemailer/lib/smtp-transport";
import { SentMessageInfo } from "nodemailer";

export class EmailBeforeSendEvent extends Event<{
  emailTemplate: IEmailTemplate;
  mailOptions: MailOptions;
}> {}

export class EmailBeforeRenderEvent extends Event<{
  emailTemplate: IEmailTemplate;
  mailOptions: MailOptions;
}> {}

export class EmailSentEvent extends Event<{
  emailTemplate: IEmailTemplate;
  mailOptions: MailOptions;
  response: SentMessageInfo;
}> {}
