import React from "react";
import { Transport, SentMessageInfo } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";

type SimpleObjectType = { [key: string]: any };

export interface IReactEmailTemplate<IProps> extends React.FC<IProps> {
  subject?: (props: IProps) => string;
}

export interface ITransporter {
  sendMail(mailOptions: MailOptions): Promise<SentMessageInfo>;
}

export interface IEmailTemplate<IProps = SimpleObjectType> {
  component: IReactEmailTemplate<IProps>;
  props?: IProps;
}

export interface IEmailBundleConfigDefaults {
  from?: string;
  props?: object;
}

export interface IEmailBundleConfig {
  transporter?:
    | Transport
    | {
        host: string;
        port: number;
        secure?: boolean;
        auth?: {
          user: string;
          pass: string;
        };
      };
  defaults: IEmailBundleConfigDefaults;
}
