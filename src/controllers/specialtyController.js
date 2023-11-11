import specialtyService from '../services/specialtyService'
let createSpecialty = async(req,res)=>{
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}
let getAllSpecialty = async(req,res)=>{
    try {
        let response = await specialtyService.getAllSpecialty();
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
    createSpecialty:createSpecialty,
    getAllSpecialty:getAllSpecialty
}