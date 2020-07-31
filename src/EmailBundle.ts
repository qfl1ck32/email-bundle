import { Bundle, BundlePhase } from "@kaviar/core";
import { IEmailBundleConfig } from "./defs";
import {
  NODEMAILER_INSTANCE,
  NODEMAILER_TEST_MODE,
  EMAIL_DEFAULTS,
} from "./constants";
import * as nodemailer from "nodemailer";

export class EmailBundle extends Bundle<IEmailBundleConfig> {
  protected defaultConfig: IEmailBundleConfig = {
    defaults: {
      from: `"KAVIAR" <no-reply@kaviarjs.org>`,
      props: {},
    },
  };

  async prepare() {
    let { transporter } = this.config;

    if (!transporter) {
      this.container.set(NODEMAILER_TEST_MODE, true);
      transporter = await this.getTestAccountInfo();
    } else {
      this.container.set(NODEMAILER_TEST_MODE, false);
    }

    this.container.set(
      NODEMAILER_INSTANCE,
      nodemailer.createTransport(transporter)
    );

    this.container.set(EMAIL_DEFAULTS, this.config.defaults);
  }

  async getTestAccountInfo() {
    const testAccount = await nodemailer.createTestAccount();
    return {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    };
  }

  /**
   * Set the transporter before preparation of the bundle
   *
   * @param transporter
   */
  setTransporter(transporter) {
    if (this.phase === BundlePhase.BEFORE_PREPARATION) {
      this.updateConfig({
        transporter,
      });
    } else {
      throw new Error(
        "Please modify the transporter in the BundleBeforePrepareEvent"
      );
    }
  }
}
