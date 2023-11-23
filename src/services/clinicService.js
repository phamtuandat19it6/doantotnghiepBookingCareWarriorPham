import db from "../models/index";
let createClinic =(data)=>{
    return new Promise(async(resolve,reject)=>{

        try {
            if(!data.name || !data.address
                || !data.imageBase64
                || !data.imageBackground
                || !data.descriptionMarkdown
                || !data.descriptionHTML){
                    resolve({
                        errCode:1,
                        errMessage:'missing parameter'
                    })
                }else{
                    if(data.action ==='CREATE'){
                        await db.Clinic.create({
                            name:data.name,
                            address:data.address,
                            imageBackground:data.imageBackground,
                            image:data.imageBase64,
                            descriptionHTML:data.descriptionHTML,
                            descriptionMarkdown:data.descriptionMarkdown
                        })
                    }else if(data.action ==='EDIT'){
                        let clinicUpdate =  await db.Clinic.findOne({
                            where: {id: data.clinicId},
                            raw:false
                        })
                        if(clinicUpdate){
                            clinicUpdate.name = data.name;
                            clinicUpdate.address = data.address;
                            clinicUpdate.imageBackground = data.imageBackground;
                            clinicUpdate.image = data.imageBase64;
                            clinicUpdate.descriptionHTML = data.descriptionHTML;
                            clinicUpdate.descriptionMarkdown = data.descriptionMarkdown;
                            clinicUpdate.id = data.clinicId;
                            await clinicUpdate.save()
                        }
                    }
                    resolve({
                        errCode:0,
                        errMessage:'OK'
                    })
                }
        } catch (error) {
            reject(error)
        }
    })
}
// let saveDetailInforDoctor = async (inputData) => {
//     return new Promise( async (resolve, reject) => {
//         try {
//             let checkObj = checkRequiredFields(inputData)
//             if (checkObj.isValid === false ){
//                 resolve({
//                     errCode: 1,
//                     errMessage:`Missing ${checkObj.element}`
//                 })
//             } else {
//                 if(inputData.action ==='CREATE'){
//                     await db.Markdown.create({
//                         contentHTML: inputData.contentHTML,
//                         contentMarkdown: inputData.contentMarkdown,
//                         description: inputData.description,
//                         doctorId: inputData.doctorId,
//                     })
//                 } else if(inputData.action ==='EDIT'){
//                     let doctorMardown =  await db.Markdown.findOne({
//                         where: {doctorId: inputData.doctorId},
//                         raw:false
//                     })
//                     if(doctorMardown){
//                         doctorMardown.contentHTML = inputData.contentHTML;
//                         doctorMardown.contentMarkdown = inputData.contentMarkdown;
//                         doctorMardown.description = inputData.description;
//                         doctorMardown.doctorId = inputData.doctorId;
//                         await doctorMardown.save()
//                     }
//                 }

//                 let doctorInfor = await db.Doctor_Infor.findOne({
//                     where:{
//                         doctorId: inputData.doctorId,
//                     },
//                     raw:false
//                 })
//                   if(doctorInfor){
//                     doctorInfor.doctorId = inputData.doctorId;
//                     doctorInfor.priceId = inputData.selectPrice;
//                     doctorInfor.paymentId = inputData.selectPayment;
//                     doctorInfor.provinceId = inputData.selectProvince;
//                     doctorInfor.nameClinic = inputData.nameClinic ;
//                     doctorInfor.addressClinic = inputData.addressClinic;
//                     doctorInfor.note = inputData.note;
//                     doctorInfor.specialtyId = inputData.selectSpecialty;
//                     doctorInfor.clinicId = inputData.selectClinic;
//                     await doctorInfor.save()
//                 }else{
//                     await db.Doctor_Infor.create({
//                         doctorId: inputData.doctorId,
//                         priceId: inputData.selectPrice,
//                         paymentId: inputData.selectPayment,
//                         provinceId: inputData.selectProvince,
//                         nameClinic: inputData.nameClinic ,
//                         addressClinic: inputData.addressClinic,
//                         note: inputData.note,
//                         specialtyId: inputData.selectSpecialty,
//                         clinicId:inputData.clinicId
//                     })
//                 }
//                 resolve({
//                     errCode: 0,
//                     errMessage: 'Save infor doctor succeed'
//                 })
//             }
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
let handleDeleteClinic = (clinicId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            if(!clinicId){
                resolve({
                    errCode:1,
                    errMessage:'missing parameter'
                })
            }else{
                let clinic = await db.Clinic.findOne({
                    where:{id: clinicId}
                })
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage:`The Clinic isn't exist`
                    })
                }
                await db.Clinic.destroy({
                    where: { id: clinicId}
                })
                resolve({
                    errCode: 0,
                    message:`The Clinic is deleted`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllClinic = () =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let clinic = await db.Clinic.findAll({
                order:[[ "createdAt","DESC"]],
             })
            if(clinic && clinic.length > 0){
                clinic.map(item =>{
                    item.image = new Buffer(item.image,'base64').toString('binary')
                    item.imageBackground = new Buffer(item.imageBackground,'base64').toString('binary')
                    return item;
                })
            }
            resolve({
                errCode:0,
                errMessage:'ok',
                data:clinic
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailClinicById = (inputId) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputId ){
                resolve({
                    errCode:1,
                    errMessage:'missing parameter'
                })
            }else{
                let  data = await db.Clinic.findOne({
                    where:{
                        id:inputId
                    },
                    attributes:['descriptionHTML','descriptionMarkdown','image','imageBackground','name','address']
                })
                if(data){
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where:{clinicId:inputId},
                        attributes:['doctorId','provinceId']
                    })
                    data.doctorClinic = doctorClinic
                }else data = {}
                if(data && data.image && data.imageBackground){
                    data.image = new Buffer(data.image,'base64').toString('binary');
                    data.imageBackground = new Buffer(data.imageBackground,'base64').toString('binary');
                }

                resolve({
                    errCode:0,
                    errMessage:"ok",
                    data:data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports={
    createClinic:createClinic,
    getAllClinic:getAllClinic,
    getDetailClinicById:getDetailClinicById,
    handleDeleteClinic
}