
exports.getPuzzle = async (gameDifficult, setPuzzle, setLoading) => {
    const response = await fetch('/api/puzzle?gameDifficult=' + gameDifficult);
    const responseBody = await response.json();
    if (response.ok) {
        setPuzzle(responseBody);
        setLoading(false);
    }
}


exports.logIn = async (credentials) => {
    let response = await fetch('api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
