'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {

    static associate(models) {
      }
  };
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.TEXT,
    imageBackground: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};