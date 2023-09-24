'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Warrior',
      lastName: 'Pham',
      address: 'Quang Ngai',
      phonenumber: '0366338869',
      gender: '1',
      image: 'ROLE',
      roleId: '1',
      positionId: '1',

      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {

  }
};
