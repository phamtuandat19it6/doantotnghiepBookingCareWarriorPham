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
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
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
            reject(e)
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
                        model:db.Allcode, as:'timeTypeData',attributes:['valueEn','valueVi']
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
module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors:getAllDoctors,
    saveDetailInforDoctor:saveDetailInforDoctor,
    getDetailDoctorById:getDetailDoctorById,
    bulkCreateSchedule:bulkCreateSchedule,
    getScheduleDoctorByDate:getScheduleDoctorByDate,



}