const Sequelize = require('sequelize'),
  path = require('path'),
  basename = path.basename(__filename),
  config = require(__dirname + '/../config/config.json').development;

const db = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: false
});

// const db = new Sequelize('bulletinboard', process.env.POSTGRES_USER, null, {
//   host: 'localhost',
//   dialect: 'postgres',
//   operatorsAliases: false
// });

const Comment = db.define('comments', {
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
    notEmpty: true
  },
  commentUser: Sequelize.TEXT
});

db.sync()
  .then()
  .catch((err) => {
    console.log(err.stack)
  });

module.exports = Comment;