const Sequelize = require('sequelize'),
  path = require('path'),
  basename = path.basename(__filename);
//config = require(__dirname + '/../config/config.json').development;

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  operatorsAliases: false,
  ssl: true
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