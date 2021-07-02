var nodemailer = require('nodemailer');
var settings = require('./settings.json');


var sendEmail = (subject, text, html = text) => {
    var transporter = nodemailer.createTransport({
        host: settings.SMTP.host,
        port: settings.SMTP.port,
        secure: settings.SMTP.secure,
        auth: {
            user: settings.SMTP.user,
            pass: settings.SMTP.password
        }
    });

    html = html.replace(/(\r\n|\n|\r)/gm, " ").replace(/\"/gm, "'").replace("  ", " ");

    transporter.sendMail({
        from: settings.SMTP.from,
        to: settings.SMTP.to,
        subject: subject,
        html: html
    });
}

module.exports = {
    sendEmail
};