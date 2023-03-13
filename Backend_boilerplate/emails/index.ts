import nodeMailer from "nodemailer";
import path from "path";
import hbs from 'nodemailer-express-handlebars';


async function nodeMailing() {

  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOSTNAME,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    logger: true,
    tls: {
      rejectUnauthorized: true // if testing from local host
    }

  });

  let headers: Array<Object>= []
  let attachments: Array<Object>=[]
  let from: String=""
  let to: String | Array<String>=""
  let subject: String =""
  let html: String =""
  let cc: String | Array<String>=""
  let bcc: String | Array<String> = ""
  let emailContent:Object = {}

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
  }

 // transporter.use('compile', hbs(handlebarOptions)); // need to sort this line out

  let mailOptions:Object = {
    headers: headers,
    attachments: attachments,
    from: from, // sender address
    to: to, // list of receivers#
    cc:cc,
    bcc:bcc,
    subject:subject, // Subject line
    template: 'email',
    context: {
      emailContent
    } 

  }

  let info = await transporter.sendMail(mailOptions); // this will send emails
}


