import { where } from "sequelize";
import db from "../models/index";
import _ from 'lodash';
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limitInput) => {
    return new  Promise( async (resole, reject)=>{
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where:{ roleId:'R2' },
                order:[[ "createdAt","DESC"]],
                attributes: {
                    exclude:['password']
                },
                include:[
                    {model:db.Allcode, as:'positionData',attributes:['valueEn','valueVi']},
                    {model:db.Allcode, as:'genderData',attributes:['valueEn','valueVi']}
                ],
                raw:true,
                nest:true
            })
            resole({
                errCode:0,
                data:users
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let doctors = await db.User.findAll({
                where:{roleId:'R2'},
                attributes:{
                    exclude:['password','image']
                }
            })
            resolve({
                errCode:0,
                data:doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}
let saveDetailInforDoctor = async (inputData) => {
    return new Promise( async (resolve, reject) => {
        try {
            if (!inputData.doctorId
                || !inputData.contentHTML
                || !inputData.contentMarkdown
                || !inputData.action
                || !inputData.selectPrice
                || !inputData.selectPayment
                || !inputData.selectProvince
                || !inputData.nameClinic
                || !inputData.addressClinic
                || !inputData.note
                ) {
                resolve({
                    errCode: 1,
                    errMessage:'Missing parameters'
                })
            } else {
                if(inputData.action ==='CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if(inputData.action ==='EDIT'){
                    let doctorMardown =  await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw:false
                    })
                    if(doctorMardown){
                        doctorMardown.contentHTML = inputData.contentHTML;
                        doctorMardown.contentMarkdown = inputData.contentMarkdown;
                        doctorMardown.description = inputData.description;
                        doctorMardown.doctorId = inputData.doctorId;
                        doctorMardown.updateAt = new Date();

                        await doctorMardown.save()
                    }
                }

                let doctorInfor = await db.Doctor_Infor.findOne({
                    where:{
                        doctorId: inputData.doctorId,
                    },
                    raw:false
                })
                  if(doctorInfor){
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectPrice;
                    doctorInfor.paymentId = inputData.selectPayment;
                    doctorInfor.provinceId = inputData.selectProvince;
                    doctorInfor.nameClinic = inputData.nameClinic ;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;

                    await doctorInfor.save()
                }else{
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectPrice,
                        paymentId: inputData.selectPayment,
                        provinceId: inputData.selectProvince,
                        nameClinic: inputData.nameClinic ,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorById = async(inputId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter !'
                })
            }else{
                let data = await db.User.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:{
                        exclude:['password']
                    },
                    include:[
                        {
                            model: db.Markdown,
                            attributes:['description','contentHTML','contentMarkdown'],
                        },
                        {
                            model:db.Allcode, as:'positionData',attributes:['valueEn','valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes:{
                                exclude:['id','doctorId']
                            },
                            include:[
                                {model:db.Allcode, as:'priceData',attributes:['valueEn','valueVi']},
                                {model:db.Allcode, as:'provinceData',attributes:['valueEn','valueVi']},
                                {model:db.Allcode, as:'paymentData',attributes:['valueEn','valueVi']},
                            ]
                        },
                    ],
                    raw:false,
                    nest:true,
                })
                if(data && data.image){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                }
                if(!data){
                    data ={};
                }
                resolve({
                    errCode:0,
                    data:data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let bulkCreateSchedule = (data)=>{
    return new Promise(async(resolve,reject)=> {
        try {
            if(!data.arrSchedule || !data.doctorId ||!data.formatedDate){
                resolve({
                    errCode:1,
                    errMessage:'Minsing require parameter !'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //get all existing data
                let existing = await db.Schedule.findAll(
                    {
                        where:{ doctorId:data.doctorId, date:data.formatedDate},
                        attributes:['timeType','date','doctorId','maxNumber'],
                        raw:true
                    }
                );
                //compare different
                let toCreate = _.differenceWith(schedule,existing,(a,b)=>{
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate)
                }
                console.log('check different ===================0',toCreate)

            //    await db.Schedule.bulkCreate(schedule)
                resolve({
                    errCode:0,
                    errMessage:'ok'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getScheduleDoctorByDate = (doctorId,date) =>{
    return new Promise (async(resolve,reject)=>{
       try {
        if(!doctorId || !date){
            resolve({
                errCode:-1,
                errMessage:'Missing required parameters !'
            })
        }else{
            let dataSchedule = await db.Schedule.findAll({
                where:{
                    doctorId:doctorId,
                    date:date
                },
                include:[
                    {
                        model:db.Allcode, as:'timeTypeData',attributes:['valueEn','valueVi'],
                    },
                    {
                        model:db.User, as:'doctorData',attributes:['lastName','firstName'],
                    },

                ],
                raw:false,
                nest:true,
            })
            if(!dataSchedule) dataSchedule=[];
            resolve({
                errCode:0,
                data:dataSchedule
            })
        }
       }catch (error) {
            reject(error)
       }
    })
}

let getExtraInforDoctorById = (idInput) =>{
    return new Promise (async(resolve,reject)=>{
        try {
         if(!idInput){
             resolve({
                 errCode:-1,
                 errMessage:'Missing required parameters !'
             })
         }else{
             let dataDoctorInfor = await db.Doctor_Infor.findOne({
                 where:{
                     doctorId:idInput,
                 },
                 model: db.Doctor_Infor,
                 attributes:{
                     exclude:['id','doctorId']
                 },
                 include:[
                     {model:db.Allcode, as:'priceData',attributes:['valueEn','valueVi']},
                     {model:db.Allcode, as:'provinceData',attributes:['valueEn','valueVi']},
                     {model:db.Allcode, as:'paymentData',attributes:['valueEn','valueVi']},
                 ],
                 raw:false,
                 nest:true,
             })
             if(!dataDoctorInfor) dataDoctorInfor={};
             resolve({
                 errCode:0,
                 data:dataDoctorInfor
             })
         }
        }catch (error) {
             reject(error)
        }
    })
}
let  getProfileDoctorById = (doctorId) =>{
    return new Promise (async(resolve,reject)=>{
        try {
         if(!doctorId){
             resolve({
                 errCode:-1,
                 errMessage:'Missing required parameters !'
             })
         }else{
             let dataProfile = await db.User.findOne({
                where:{
                    id:doctorId
                },
                attributes:{
                    exclude:['password']
                },
                include:[

                    {
                        model:db.Markdown,
                        attributes:['description','contentHTML','contentMarkdown']
                    },
                    {
                        model:db.Allcode, as:'positionData',attributes:['valueEn','valueVi']
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes:{
                            exclude:['id','doctorId']
                        },
                        include:[
                            {model:db.Allcode, as:'priceData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode, as:'provinceData',attributes:['valueEn','valueVi']},
                            {model:db.Allcode, as:'paymentData',attributes:['valueEn','valueVi']},
                        ]
                    },
                ],
                raw:false,
                nest:true,
            })
            if(dataProfile && dataProfile.image){
                dataProfile.image = new Buffer(dataProfile.image,'base64').toString('binary');
            }
            if(!dataProfile){
                dataProfile ={};
            }
            resolve({
                errCode:0,
                data:dataProfile
            })
        }
    } catch (error) {
        reject(error)
    }
})
}
module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    saveDetailInforDoctor:saveDetailInforDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleDoctorByDate:getScheduleDoctorByDate,
    getExtraInforDoctorById:getExtraInforDoctorById,
    getProfileDoctorById:getProfileDoctorById,



}