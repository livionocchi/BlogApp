const express = require('express'),
  app = express(),
  User = require('./models/user.js'),
  Post = require('./models/post.js'),
  Comment = require('./models/comment.js'),
  ejs = require('ejs'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('express-session'),
  morgan = require('morgan'),
  favicon = require('serve-favicon'),
  bcrypt = require('bcrypt'),
  {
    check,
    validationResult,
  } = require('express-validator/check'),
  port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieSession({
  name: 'userCookie',
  secret: 'secretSignature'
}));

let currentUserId = '';

app.route('/')
  // Renders the homepage
  .get((req, res) => {
    if (req.cookies.userCookie && req.session.user) {
      res.redirect('/profile');
    } else {
      res.render('index')
    }
  })

  // Manages the login form
  .post([
      check('email', 'Wrong email format').isEmail().not().isEmpty(),
      check('password').not().isEmpty()
    ],
    (req, res) => {
      let email = req.body.email;
      let password = req.body.password;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('index', {
          errors: errors.array()
        });
      } else {

        User.findOne({
            where: {
              email: email
            }
          })
          .then((user) => {
            if (!user) {
              res.redirect('/')
            } else {
              bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                  currentUserId = user.dataValues.id
                  req.session.user = user.dataValues;
                  res.redirect('/profile');
                } else {
                  res.redirect('/');
                }
              })
            }
          })
          .catch((err) => {
            console.log(`Error in the log-in process: ${err.stack}`);
            res.redirect('/')
          })
      }
    });

app.route('/register')
  // Renders the registration page
  .get((req, res) => {
    if (req.cookies.userCookie && req.session.user) {
      res.redirect('/profile');
    } else {
      res.render('register')
    }
  })
  // Manages the registration form
  .post([
      check('email').isEmail().not().isEmpty(),
      check('password').isLength({
        min: 3
      }).not().isEmpty()
    ],
    (req, res) => {
      let email = req.body.email;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;

      const errors = validationResult(req);

      if (!errors.isEmpty() || password !== confirmPassword) {
        res.render('register', {
          errors: errors.array()
        })
      } else {

        User.create({
            email: email,
            password: password
          })
          .then((retrivedUser) => {
            res.redirect('/');
          })
          .catch((err) => {
            console.log(`Error in the registration process: ${err}`);
            res.redirect('/register')
          })
      }
    });

// Renders the profile page
app.get('/profile', (req, res) => {
  if (req.session.user && req.cookies.userCookie) {
    Post.findAll({
        where: {
          userId: req.session.user.id
        }
      })
      .then((retrivedData) => {
        let filteredData = retrivedData.map((i) => {
          return {
            id: i.dataValues.id,
            title: i.dataValues.title,
            body: i.dataValues.body,
            createdAt: i.dataValues.createdAt
          }
        });

        res.render('profile', {
          posts: filteredData,
          user: req.session.user
        })
      }, (error) => {
        console.log(error.stack)
      });
  } else {
    res.redirect('/')
  }
});

app.route('/newPost')
  // Renders the create new post page
  .get((req, res) => {
    if (req.cookies.userCookie && req.session.user) {
      res.render('newPost')
    } else {
      res.redirect('/')
    }
  })
  // Manages the post creation form
  .post([
      check('title').not().isEmpty(),
      check('body').not().isEmpty()
    ],
    (req, res) => {
      let title = req.body.title;
      let body = req.body.body;
      let userId = req.session.user.id;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('newPost', {
          errors: errors.array()
        })
      } else {

        Post.create({
            title: title,
            body: body,
            userId: userId
          })
          .then(() => {
            res.redirect('/posts')
          })
          .catch((err) => {
            console.log(`Error in the post creation + redirect process: ${err.stack}`);
            res.redirect('/')
          })
      }
    });

app.route('/posts')
  // Renders all the posts from all the users along with the relative comments
  .get((req, res) => {
    Post.findAll({
        // Include the users and comments tables to access its data later on
        include: [User, Comment]
      })
      .then((retrivedData) => {
          let filteredData = retrivedData.map((i) => {
            return {
              id: i.dataValues.id,
              title: i.dataValues.title,
              body: i.dataValues.body,
              userId: i.dataValues.userId,
              // Retrieves the info of the user who wrote the post
              user: JSON.parse(JSON.stringify(i.dataValues.user)),
              comment: JSON.parse(JSON.stringify(i.dataValues.comments))
            }
          });

          res.render('posts', {
            posts: filteredData,
            currentUserId: currentUserId
          })
        },
        (error) => {
          console.log(error.stack)
        })
  })
  // Manages the comment creation form
  .post([
      check('comment').not().isEmpty()
    ],
    (req, res) => {
      if (req.session.user && req.cookies.userCookie) {
        let comment = req.body.comment;
        let postId = req.body.id;
        let userId = req.session.user.id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.render('posts', {
            errors: errors.array()
          })
        } else {

          Comment.create({
              comment: comment,
              postId: parseInt(postId),
              userId: userId,
              commentUser: req.session.user.email
            })
            .then((commentData) => {
              res.end(JSON.stringify(commentData.dataValues));
            })
            .catch((err) => {
              console.log(`Error in the comment creation + redirect process: ${err.stack}`);
            })
        }
      } else {
        res.redirect('/')
      }
    });

// Manages the deletion of a personal post
app.delete('/posts/:id', (req, res) => {
  let elemId = req.params.id;
  Comment.destroy({
    where: {
      postId: parseInt(elemId)
    }
  }).then(() => {
    Post.destroy({
      where: {
        id: parseInt(elemId)
      }
    })
  })
});

// Manages the deletion of a personal comment
app.delete('/posts:id', (req, res) => {
  let elemId = req.params.id;
  Comment.destroy({
    where: {
      id: parseInt(elemId.substring(1))
    }
  })
});

// Manages the log-out button
app.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.userCookie) {
    res.clearCookie('userCookie');
    currentUserId = '';
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

app.listen(port, console.log(`Evesdropping on port ${port}`));