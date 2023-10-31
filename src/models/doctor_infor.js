'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Doctor_Infor.init({
    doctorId: DataTypes.INTEGER,
    provinceId: DataTypes.STRING,
    priceId: DataTypes.STRING,
    paymetId: DataTypes.STRING,
    nameClinic:DataTypes.STRING,
    addressClinic: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Doctor_Infor',
    freezeTableName: true,
  });
  return Doctor_Infor;
};