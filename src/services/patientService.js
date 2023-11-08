import { reject } from "lodash";
import db from "../models/index";
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4} from 'uuid';

let builUrlEmail = (doctorId,token)=>{
   let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let savePatientInfor = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing parameters'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    receivers: data.email,
                    patientName:data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language:data.language,
                    redirectLink:builUrlEmail(data.doctorId,token)

                })
               let user = await db.User.findOrCreate({
                    where:{  email: data.email },
                    raw: false,
                    defaults:{
                        email:data.email,
                        roleId:'R3'
                    },
                });

                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where:{patientId:user[0].id},
                        defaults:{
                            statusId:'S1',
                            doctorId:data.doctorId,
                            patientId:user[0].id,
                            date:data.date,
                            timeType:data.timeType,
                            token:token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save Patient Infor Succeed'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let verifyPatientBookingInfor = (data) =>{
    return new Promise(async(resolve,reject) =>{
        try {
            if(!data.doctorId || !data.token){
                resolve({
                    errCode:1,
                    errMessage: "Missing required parameter"
                })
            }else{
              let appointment =  await db.Booking.findOne({
                    where:{
                        doctorId:data.doctorId,
                        token:data.token,
                        statusId:'S1'
                    },
                    raw: false
                })
                console.log('appointment:',appointment)
                if(appointment){
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode:0,
                        errMessage:'Update the appoitment succeed !'
                    })
                }else{
                    resolve({
                        errCode:2,
                        errMessage:'Appointment has been activated or does not exist !'
                    })
                }
            }


        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    savePatientInfor: savePatientInfor,
    verifyPatientBookingInfor:verifyPatientBookingInfor
}