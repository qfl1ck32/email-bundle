import { Transporter, Transport } from "nodemailer";

export const ConsoleTransporter: Transport = {
  name: "Console",
  version: "1.0.0",
  send(mail) {
    console.log("[emails] You've sent a new email: \n", mail.data);
  },
};
