module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('posts', {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
        notEmpty: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts')
  }
};