import nodemailer from "nodemailer"

type Options = {
    email : string;
    subject : string;
    message : string;
} 

export const sendEmail = async (options : Options) =>{

    let transporter = nodemailer.createTransport({
        host:"smtp.mailtrap.io",
        port:2525,
        secure:false,
        auth:{
            user:"f6ce6cc1e2e056",
            pass:"077b71c99bfbe0"
        }
    })

    let info = await transporter.sendMail({
        from:"HumunBichig Stu. humunbichig@gmail.com",
        to:options.email,
        subject: options.subject,
        html: options.message
    })

}