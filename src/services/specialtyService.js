import db from "../models/index";
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionMarkdown
                || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            } else {
                await db.Speciaty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Speciaty.findAll({
            })
            if (specialty && specialty.length > 0) {
                specialty.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'ok',
                data: specialty
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            } else {
                let data = await db.Speciaty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'image']
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: "ok",
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}