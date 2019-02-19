const Sequelize = require('sequelize'),
  Post = require('./post'),
  Comment = require('./comment'),
  bcrypt = require('bcrypt'),
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

const User = db.define('users', {
  email: {
    type: Sequelize.STRING,
    isEmail: true,
    unique: true,
    allowNull: false,
    notEmpty: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  }
}, {
  hooks: {
    beforeCreate: (user, options) => {
      return bcrypt.hash(user.password, 10)
        .then((hashedPssw) => {
          user.password = hashedPssw;
        })
        .catch(err => {
          throw new Error();
        });
    }
  }
});

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

db.sync()
  .then()
  .catch((err) => {
    console.log(err.stack)
  });

module.exports = User;