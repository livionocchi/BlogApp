'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('messages', 'body', {
      type: Sequelize.TEXT,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('messages', 'body', {
      type: Sequelize.STRING,
    })
  }
};