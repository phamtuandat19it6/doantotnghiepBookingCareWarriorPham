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
        html:`
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
        `, // html body
      });
}
module.exports = {
    sendSimpleEmail:sendSimpleEmail
}