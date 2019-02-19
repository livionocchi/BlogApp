const Sequelize = require('sequelize'),
  Comment = require('./comment'),
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

const Post = db.define('posts', {
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
});

Post.hasMany(Comment);
Comment.belongsTo(Post);

db.sync()
  .then()
  .catch((err) => {
    console.log(err.stack)
  });

module.exports = Post;