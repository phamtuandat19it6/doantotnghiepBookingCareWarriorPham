require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async(dataSend)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

      let info = await transporter.sendMail({
        from: '"Warrior Pham 👻" <onganh361@gmail.com>', // sender address
        to: dataSend.receivers, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html:getBodyHTMLEmail(dataSend),
      });
}

let getBodyHTMLEmail = (dataSend)=>{
    let result = ''
    if(dataSend.language === 'vi'){
      result = `
      <h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên  hệ thông Booking care</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <div><b>Thời gian: ${dataSend.time}</b></div>
      <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
      <p> Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để
          xác nhận và hoàn tất thủ tục khám bệnh.
      </p>
      <div>
          <a href=${dataSend.redirectLink} target="_blank"> click here </a>
      </div>
      <div>Xin chân thành cảm ơn</div>
      `
    }
    if(dataSend.language === 'en'){
      result = `
      <h3>Hi ${dataSend.patientName}!</h3>
      <p>You received this email because you booked a medical appointment on the Booking care system</p>
      <p>Medical appointment booking information:</p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor: ${dataSend.doctorName}</b></div>
      <p> If the above information is true, please click on the link below
      Confirm and complete medical examination procedures.
      </p>
      <div>
          <a href=${dataSend.redirectLink} target="_blank"> click here </a>
      </div>
      <div>Sincerely thank !</div>
      `
    }
    return result
}
let getBodyHTMLEmailRemedy = (dataSend) =>{
  let result = ''
    if(dataSend.language === 'vi'){
      result = `
      <h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên  Hỏi Dân IT channel thành công</p>
      <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.:</p>
      <div>Xin chân thành cảm ơn</div>
      `
    }
    if(dataSend.language === 'en'){
      result = `
      <h3>Hi ${dataSend.patientName}!</h3>
      <p>You received this email because you booked a medical appointment on the Booking care system</p>
      <p>Medical appointment booking information:</p>
      <div>Sincerely thank !</div>
      `
    }
    return result
}
let sendAttachment = async(dataSend)=> {
  return new Promise(async(resolve,reject)=>{
    try {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
          }
        });

        let info = await transporter.sendMail({
          from: '"Warrior Pham 👻" <onganh361@gmail.com>', // sender address
          to: dataSend.email, // list of receivers
          subject: "Kết quả đặt lịch khám bệnh ✔", // Subject line
          html:getBodyHTMLEmailRemedy(dataSend),
          attachments:[
            {
              filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
              content: dataSend.imgBase64.split("base64,")[1],
              encoding:'base64'
            }
          ]
        });
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
    sendSimpleEmail:sendSimpleEmail,
    sendAttachment:sendAttachment
}