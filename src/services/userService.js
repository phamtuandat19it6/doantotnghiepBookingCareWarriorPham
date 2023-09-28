import db from "../models/index";
import bcrypt from "bcrypt";
let handleUserLogin =  (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // const myPlaintextPassword = 's0/\/\P4$$w0rD';
                // const someOtherPlaintextPassword = 'not_bacon';
                // bcrypt.compareSync(myPlaintextPassword, hash);
                // bcrypt.compareSync(someOtherPlaintextPassword, hash);
                let user = await db.User.findOne({
                    attributes: ['email','roleId','password'],
                    where: { email: email },
                    raw:true


                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0,
                            userData.errMessage = 'ok',
                            console.log(user),
                        delete user.password,
                        userData.user = user
                    } else {
                        userData.errCode = 3,
                        userData.errMessage = `Wrong pass word`
                    }
                } else {
                    userData.errCode = 2,
                    userData.errMessage = `User's not found`
                }
             } else {
                userData.errCode = 1,
                userData.errMessage = `Your's Email isn't exist in your system. Plz try orher email`
            }
            resolve(userData)
        } catch (error) {
           reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where:{ email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,

}