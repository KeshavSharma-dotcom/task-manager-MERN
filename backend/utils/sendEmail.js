const nodemailer = require("nodemailer")

const sendEmail = async ({to , subject , html}) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mainOptions = {
        from : `Task Manager Support ${process.env.EMAIL_USER}`,
        to,
        subject,
        html
    }
    return transporter.sendMail(mainOptions
    )
}
module.exports = sendEmail