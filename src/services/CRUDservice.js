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
        firstName: data.firstName,
        lastName: data.lastName,
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
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw:true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  })
}
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users =await db.User.findOne(
        {
          where: { id: userId },
          raw: true,
        })
      if (users) {
        resolve(users)
      } else {
        resolve({})
        }
    } catch (error) {
      reject(error)
    }
  })
}
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {id: data.id}
        })
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error)
    }
  })
}
let deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where:{id:id}
      })
      if (user) {
        await user.destroy();
        resolve();
      }
    } catch (error) {
      reject(error)
    }
  })

}
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById:deleteUserById,
}