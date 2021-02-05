This bundle helps you connect to your favorite (swapable) transporter and render React templates as email. It is thought to work with TypeScript and enjoy type-safety.

## Install

```bash
npm install @kaviar/email-bundle react react-dom
```

## Emails

```typescript
kernel.addBundle(
  new EmailBundle(config);
)

// The config interface

export interface IEmailBundleConfig {
  /**
   * If you don't pass a transporter, a test transporter will be
   * created with nodemailer (allowing you view your emails online without any SMTP).
   * If the test transporter cannot be created, it will default to console
   */
  transporter?:
    | "console" // Will console log the email data
    | "nodemailer-test" // Will generate a Preview URL using nodemailer test accounts
    | {
        host: string;
        port: number;
        secure?: boolean;
        auth?: {
          user: string;
          pass: string;
        };
      };
  defaults: {
    from?: string;
    /**
     * Inject global properties
     */
    props?: any;
  };
}
```

You can use it by either providing your own custom transport, you can customise this heavily. A common example would be to use Mailgun HTTP API to send emails:

```typescript
import * as mg from "nodemailer-mailgun-transport";

new KaviarEmailBundle({
  transporter: mg({
    auth: {
      api_key: "xxx",
      domain: "mydomain.com",
    },
  }),
});
```

Read more here:

- https://nodemailer.com/transports/
- https://nodemailer.com/plugins/create/#transports

And if you want to have a registered, service-dependency container that creates the transport inside your bundle, then, in the `hook()` phase, listen to `BundleBeforePrepareEvent` and `setTransporter()` with your own custom transport solution. Same logic would apply if you want to extend the global props (props that reach any email template).

## Templates

Let's create an email template:

```typescript
// https://nodemailer.com/about/
const emailService = container.get(EmailService);

export interface IWelcomeEmailProps {
  name: string;
}

// To send your email is easy
export const WelcomeEmail: IReactEmailTemplate<IWelcomeEmailProps> = (
  props
) => {
  return <div>Hello {props.name}</div>;
};

// Subject is most of the time very tied to the email template
// You can omit this if you are sending the "subject" in the message configuration
WelcomeEmail.subject = (props) => `Hello ${props.name}`;
```

Now let's try to send an email:

```typescript
// The send argument IWelcomeEmailProps is optional, but it does help you ensure the props is correctly sent
await emailService.send<IWelcomeEmailProps>(
  // Template options
  {
    component: WelcomeEmail,
    props: {
      name: "Theodor",
    },
  },
  // This argument represents the message configuration
  // Explore more about it here: https://nodemailer.com/message/
  {
    to: "someone@somewhere.com",
  }
);
```

## Responsive Emails

You can use https://mjml.io/ to benefit of nicely rendered emails.

```bash
npm install mjml
```

Let's hook into it right before sending so we can transform our html:

```typescript
import { Listener, On } from "@kaviar/core";
import * as mjml2html from "mjml";

class EmailListener extends Listener {
  @On(EmailBeforeSendEvent)
  transformMjml(event: EmailBeforeSendEvent) {
    const { html } = event.data.mailOptions;
    event.data.mailOptions.html = mjml2html(html);
  }
}
```

Another alternative would be to use the react version of it: https://github.com/wix-incubator/mjml-react and bypass the need of a listener.

## Global Variables

Following the same pattern as above, you can listen to emails before they get rendered via `EmailBeforeRenderEvent` and inject a variable such as "applicationUrl" or a router:

```ts
class EmailListener extends Listener {
  @On(EmailBeforeRenderEvent)
  extendProps(event: EmailBeforeRenderEvent) {
    const { emailTemplate } = event.data;

    Object.assign(emailTemplate.props, {
      appUrl: "http://www.google.com",
    });
  }
}
```

And you can have a sort of "master" interface for these global props:

```ts
// Example. This will be accessible from all React email templates, as long with their defined properties.
declare module "@kaviar/email-bundle" {
  export interface IGlobalEmailProps {
    appUrl: "https://abc.com";
  }
}

export interface IWelcomeEmailProps {
  name: string;
}
```
