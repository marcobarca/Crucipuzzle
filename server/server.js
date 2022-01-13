const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const dao = require('./dao');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./user-dao');
const port = 3001;
app = new express();

//***************************************************************************************************** */
/**************************************** SET UP PASSPORT ********************************************* */
//***************************************************************************************************** */

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  //console.log("serializeUser: user:" + JSON.stringify(user));
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  //console.log("deserializeUser: id:" + id);
  userDao.getUserById(id)
    .then(user => {
      //console.log("deserializeUser: user da db:" + JSON.stringify(user));
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}


// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

//***************************************************************************************************** */

app.use(morgan('dev'));
app.use(express.json());

let wordList = [];

//Load the word-list at start
var fs = require('fs');
fs.readFile('words.txt', function (err, data) {
  if (err) throw err;
  var array = data.toString().split("\n");
  for (i in array) {
    wordList.push(array[i].replace(/(\r\n|\n|\r)/gm, ""))
  }
});


// GET THE PUZZLE
app.get('/api/puzzle', async (req, res) => {
  switch (req.query.gameDifficult) {
    case ('1'):
      var puzzle = [];
      for (let i = 0; i < 4; i++) {
        let col = [];
        for (let j = 0; j < 6; j++)
          col[j] = getLetter();
        puzzle[i] = col;
      }
      res.send(puzzle);
      break;
    case ('2'):
      var puzzle = [];
      for (let i = 0; i < 8; i++) {
        let col = [];
        for (let j = 0; j < 12; j++)
          col[j] = getLetter();
        puzzle[i] = col;
      }
      res.send(puzzle);
      break;
    case ('3'):
      var puzzle = [];
      for (let i = 0; i < 12; i++) {
        let col = [];
        for (let j = 0; j < 18; j++)
          col[j] = getLetter();
        puzzle[i] = col;
      }
      res.send(puzzle);
      break;
    case ('4'):
      var puzzle = [];
      for (let i = 0; i < 16; i++) {
        let col = [];
        for (let j = 0; j < 24; j++)
          col[j] = getLetter();
        puzzle[i] = col;
      }
      res.send(puzzle);
      break;
    case ('5'):
      var puzzle = [];
      for (let i = 0; i < 20; i++) {
        let col = [];
        for (let j = 0; j < 30; j++)
          col[j] = getLetter();
        puzzle[i] = col;
      }
      res.send(puzzle);
      break;
  }
})

// GET THE HALL OF FAME
app.get('/api/HallOfFame', async (req, res) => {
  try {
    const hof = await dao.getHallOfFame();
    res.json(hof);
  } catch (err) {
    res.status(500).end();
  }
});

// GET THE LIST OF THE PLAYED GAMES (USER MUST BE LOGGED)
app.get('/api/MyGames', isLoggedIn, async (req, res) => {
  try {
    const games = await dao.getMyGames(req.query.username);
    res.json(games);
  } catch (err) {
    res.status(500).end();
  }
});

// CHECK IF ENGLISH WORD EXISTS
app.get('/api/check', async (req, res) => {
  res.status(200).send(wordList.includes(req.query.word))
})

// POST A NEW GAME /api/games
app.post('/api/games', [
  check('username').notEmpty().isString(),
  check('score').notEmpty().isNumeric()
], isLoggedIn ,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const game = {
    username: req.body.username,
    score: req.body.score,
  };

  try {
    await dao.createGame(game);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of the game.` });
  }
});

//***************************************************************************************************** */
/******************************************** USER APIs *********************************************** */
//***************************************************************************************************** */

// Login --> POST /sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// Logout --> DELETE /sessions/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


// THIS FUNCTION GIVE BACK A LETTER RANDOMLY
// BASED ON ENGLISH WORDS FREQUENCY
// http://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
function getLetter() {
  let n = Math.floor(Math.random() * 10000);
  if (n < 1202)
    return 'E';
  if (n >= 1202 && n < 2112)
    return 'T';
  if (n >= 2112 && n < 2924)
    return 'A';
  if (n >= 2924 && n < 3692)
    return 'O';
  if (n >= 3692 && n < 4423)
    return 'I';
  if (n >= 4423 && n < 5118)
    return 'N';
  if (n >= 5118 && n < 5746)
    return 'S';
  if (n >= 5746 && n < 6348)
    return 'R';
  if (n >= 6348 && n < 6940)
    return 'H';
  if (n >= 6940 && n < 7372)
    return 'D';
  if (n >= 7372 && n < 7770)
    return 'L';
  if (n >= 7770 && n < 8058)
    return 'U';
  if (n >= 8058 && n < 8329)
    return 'C';
  if (n >= 8329 && n < 8590)
    return 'M';
  if (n >= 8590 && n < 8820)
    return 'F';
  if (n >= 8820 && n < 9031)
    return 'Y';
  if (n >= 9031 && n < 9240)
    return 'W';
  if (n >= 9240 && n < 9443)
    return 'G';
  if (n >= 9443 && n < 9625)
    return 'P';
  if (n >= 9625 && n < 9774)
    return 'B';
  if (n >= 9774 && n < 9885)
    return 'V';
  if (n >= 9885 && n < 9954)
    return 'K';
  if (n >= 9954 && n < 9971)
    return 'X';
  if (n >= 9971 && n < 9982)
    return 'Q';
  if (n >= 9982 && n < 9992)
    return 'J';
  if (n >= 9992 && n < 10000)
    return 'Z';
}

app.listen(port, () => {
  console.log(`react-server listening at http://localhost:${port}`);
});
