import db from '../models/index';
import bcrypt from "bcrypt";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password)
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstname,
        lastName: data.lastname,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId,
        image:"Role",
        positionId:"1",
      })
      resolve('create a new user succeed')
    } catch (error) {
      reject(error)
    }
  })
}
let hashUserPassword = (password) => {
  return new Promise(async(resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword)
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  createNewUser:createNewUser
}