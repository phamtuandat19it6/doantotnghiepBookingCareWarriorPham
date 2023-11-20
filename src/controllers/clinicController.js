import clinicService from '../services/clinicService'
let createClinic = async(req,res)=>{
    try {
        let response = await clinicService.createClinic(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}
let getAllClinic = async(req,res)=>{
    try {
        let response = await clinicService.getAllClinic();
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}
let getDetailClinicById = async(req,res)=>{
    try {
        let response = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}
let handleDeleteClinic = async(req,res)=>{
    try {
        let response = await clinicService.handleDeleteClinic(req.body.id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}

module.exports = {
    createClinic:createClinic,
    getAllClinic:getAllClinic,
    getDetailClinicById:getDetailClinicById,
    handleDeleteClinic

}