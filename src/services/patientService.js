import db from "../models/index";
require('dotenv').config();


let savePatientInfor = async (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing parameters'
                })
            } else {
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
                            timeType:data.timeType
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

module.exports = {
    savePatientInfor: savePatientInfor,
}