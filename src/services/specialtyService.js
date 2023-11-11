import db from "../models/index";
let createSpecialty =(data)=>{
    return new Promise(async(resolve,reject)=>{

        try {
            if(!data.name
                || !data.imageBase64
                || !data.descriptionMarkdown
                || !data.descriptionHTML){
                    resolve({
                        errCode:1,
                        errMessage:'missing parameter'
                    })
                }else{
                    await db.Speciaty.create({
                        name:data.name,
                        image:data.imageBase64,
                        descriptionHTML:data.descriptionHTML,
                        descriptionMarkdown:data.descriptionMarkdown
                    })
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
module.exports={
    createSpecialty:createSpecialty
}