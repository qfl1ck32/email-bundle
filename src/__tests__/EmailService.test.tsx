import * as React from "react";
import { EmailService } from "../services/EmailService";
import { EventManager } from "@kaviar/core";
import { Transporter } from "nodemailer";
import { ITransporter, IReactEmailTemplate } from "../defs";
import { MailOptions } from "nodemailer/lib/smtp-transport";
import { assert } from "chai";

describe("EmailService", () => {
  it("Should be able to render an email and reach the transport", async () => {
    const eventManager = new EventManager();
    let emailSent = false;
    const to = "johnas@smith.com";
    const transporter: ITransporter = {
      async sendMail(mailOptions: MailOptions) {
        console.log(mailOptions.html);
        assert.isTrue(
          mailOptions.html.toString().indexOf("Hello friend, Johnas") === 0
        );
        assert.equal(mailOptions.to, to);
        emailSent = true;
      },
    };

    const service = new EmailService(transporter, false, {}, eventManager);

    interface IProps {
      name: string;
    }

    const Component: IReactEmailTemplate<IProps> = (props) => {
      return <>Hello friend, {props.name}</>;
    };

    Component.subject = (props) => {
      return "x";
    };

    await service.send<IProps>(
      {
        component: Component,
        props: {
          name: "Johnas",
        },
      },
      {
        to: to,
      }
    );

    assert.isTrue(emailSent);
  });

  it("Should be able to properly apply the defaults specified", () => {
    // TODO:
  });
});
