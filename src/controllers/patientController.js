import patientService from "../services/patientService"

let postPatientInfor = async(req,res) => {
    try {
        let response = await patientService.savePatientInfor(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode:-1,
            errMessage:'Error from the server'
        })
    }
}
let verifyPatientBookingInfor = async(req,res) => {
    try {
        let response = await patientService.verifyPatientBookingInfor(req.body);
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
    postPatientInfor:postPatientInfor,
    verifyPatientBookingInfor:verifyPatientBookingInfor
}