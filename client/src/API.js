

//*** GET /api/puzzle?gameDifficult

//This call ask to the server a list of letters in order to create the game grid
async function getPuzzle(gameDifficult, setPuzzle, setLoading) {
  const response = await fetch('/api/puzzle?gameDifficult=' + gameDifficult);
  const responseBody = await response.json();
  if (response.ok) {
    setPuzzle(responseBody);
    setLoading(false);
  }
}

//------------------------------------------------------------------------------------

//*** GET /api/check?word

//This call check if an english word exists
async function getWordCheck(word) {
  const response = await fetch('/api/check?word=' + word);
  const responseBody = await response.json();
  if (response.ok)
    return responseBody;
  else
    throw responseBody;
}

//------------------------------------------------------------------------------------


//*** GET /api/HallOfFame

//This call get the hall of fame games list
async function getHallOfFame(setHallOfFame, setLoading) {
  const response = await fetch('/api/HallOfFame');
  const responseBody = await response.json();
  if (response.ok) {
    setHallOfFame(responseBody);
    setLoading(false);
    return responseBody;
  }
  else
    throw responseBody;
}

//------------------------------------------------------------------------------------


//*** GET /api/MyGames?username

//This call get the games list (user must be logged)
async function getMyGames(user, setMyGames, setLoading) {
  const response = await fetch('/api/MyGames?username=' + user);
  const responseBody = await response.json();
  if (response.ok) {
    setMyGames(responseBody);
    setLoading(false);
    return responseBody;
  }
  else
    throw responseBody;
}

//------------------------------------------------------------------------------------


//*** POST /api/games

//This call store a new game (user must be logged)
function createGame(game) {
  return new Promise((resolve, reject) => {
    fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: game.username, score: game.score }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: 'Cannot parse server response' }) });
      }
    }).catch(() => { reject({ error: 'Cannot communicate with the server' }) });
  });
}


//------------------------------------------------------------------------------------


//*** POST api/sessions

//Log in call
async function logIn(credentials) {
  let response = await fetch('api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user.name;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

//------------------------------------------------------------------------------------


//*** POST api/sessions/current

//Log out call
async function logOut() {

  let response = await fetch('api/sessions/current', {
    method: 'DELETE'});
  if (response.ok) {
    return null;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

//------------------------------------------------------------------------------------


const API = { createGame, getPuzzle, getHallOfFame, getMyGames, getWordCheck, logIn, logOut }

export default API;
