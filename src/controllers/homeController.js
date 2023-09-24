import db from '../models/index';
import CRUDservice from '../services/CRUDservice';
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render('homepage.ejs', {
      data: JSON.stringify(data)
    });

  } catch (error) {
    console.error(error)
  }
}
let getAboutPage = (req, res) => {
  return res.render('test/about.ejs');
}
let getCRUDPage = (req, res) => {
  return res.render('test/crud.ejs')
}
let postCRUD = async(req, res) => {
  let message = await CRUDservice.createNewUser(req.body)
  console.log(message);
 return res.send('post crud from server');
}
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUDPage: getCRUDPage,
  postCRUD: postCRUD,
}