import nodemailer, { createTransport, SendMailOptions } from "nodemailer";




export const sendEmail = async(data: SendMailOptions)=>{
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


(async () => {
  const info = await transporter.sendMail({
    from: `"Social App" <${process.env.EMAIL}>`,
    ...data
  });

  console.log("Message sent:", info.messageId);
})();

}