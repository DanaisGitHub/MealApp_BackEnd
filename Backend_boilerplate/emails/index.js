"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
async function nodeMailing() {
    const transporter = nodemailer_1.default.createTransport({
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
    let headers = [];
    let attachments = [];
    let from = "";
    let to = "";
    let subject = "";
    let html = "";
    let cc = "";
    let bcc = "";
    let emailContent = {};
    const handlebarOptions = {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path_1.default.resolve('./views'),
            defaultLayout: false,
        },
        viewPath: path_1.default.resolve('./views'),
        extName: ".handlebars",
    };
    // transporter.use('compile', hbs(handlebarOptions)); // need to sort this line out
    let mailOptions = {
        headers: headers,
        attachments: attachments,
        from: from,
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        template: 'email',
        context: {
            emailContent
        }
    };
    let info = await transporter.sendMail(mailOptions); // this will send emails
}
