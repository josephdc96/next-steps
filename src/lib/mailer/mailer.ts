import type { NodemailerExpressHandlebarsOptions } from 'nodemailer-express-handlebars';

import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import { ExpressHandlebars } from 'express-handlebars';
import { randomUUID } from 'crypto';

const handlebarsOptions: NodemailerExpressHandlebarsOptions = {
  viewPath: './templates',
  viewEngine: new ExpressHandlebars(),
};

export async function sendInvite(email: string, name: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com',
    port: 587,
    secure: true,
    auth: {
      user: 'joseph@cauble.io',
      pass: '',
    },
  });
  transporter.use('compile', hbs(handlebarsOptions));
  const code = randomUUID();

  const info = await transporter.sendMail({
    from: '"Paradigm" <noreply@cauble.io>',
    to: email,
    subject: 'Welcome to Paradigm Leadership',
    template: 'invite',
    context: {
      name,
      email,
      code,
    },
  });
}
