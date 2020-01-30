const nodemailer = require('nodemailer') 

function sendEmail(email_id, body, subject, callback) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'priyankaspatilfourone1996@gmail.com',
               pass: '$hubhpriyu4132'
           }
    })

    const mailOptions = {
        from: 'priyankaspatilfourone1996@gmail.com', // sender address
        to: email_id, // list of receivers
        subject: subject, // Subject line
        html: body // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else  {
            console.log(info)
        }

        callback(error, info)
    })
}

module.exports = {
    send: sendEmail
}