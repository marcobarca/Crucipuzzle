import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, Button } from "react-bootstrap"
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { LoginForm } from './LoginComponent'
import './App.css';
import './LoginComponent'
import { useState, useEffect } from 'react';
import './rainbowText.css'
import { MyModal, MyScoreModal } from './MyModal.js'
import { GameGrid } from './GameGrid.js'
import { Timer } from './Timer.js'
import { MyMenu } from './MyMenu.js'
import * as API from './API';

function App() {

  const [loading, setLoading] = useState(true);
  const handleLoading = (bool) => {
    setLoading(bool)
  }

  const [showLoginForm, setShowLoginForm] = useState(false);
  const handleShowLoginForm = (bool) => {
    setShowLoginForm(bool);
  }

  const [user, setUser] = useState('');
  const handleUser = (u) => {
    setUser(u)
  }

  const [loggedIn, setLoggedIn] = useState(false);
  const handleLoggedIn = (bool) => { setLoggedIn(bool) };

  const handleLogOut = () => {
    setLoggedIn(false);
    setUser('')
  }

  const [guest, setGuest] = useState(false);
  const handleGuest = (bool) => { setGuest(bool) };


  //State of the Modal that allow to set the difficult
  const [showSettingsModal, setShowSettingsModal] = useState(true);
  const handleShowSettingsModal = (bool) => { setShowSettingsModal(bool) };

  //State of the Modal that appears at the end of the game
  const [showScoreModal, setShowScoreModal] = useState(false);
  const handleShowScoreModal = (bool) => { setShowScoreModal(bool) }

  //State that mantain the coordinates of the lighted on cells in GameGrid
  const [brightCells, setBrightCells] = useState([]);
  const handleBrightCells = (cell) => {
    let tmp = brightCells;
    tmp.push(cell)
    setBrightCells(tmp)
  }
  const resetBrightCells = () => { setBrightCells([]) };

  //Game difficult level
  const [gameDifficult, setGameDifficult] = useState(1);
  const handleGameDifficult = (difficult) => { setGameDifficult(difficult) }

  //Puzzle is the group of letters that appear 
  const [puzzle, setPuzzle] = useState([]);

  //The start state is true only while the user is playing
  const [start, setStart] = useState(false);
  const handleStart = (bool) => {
    setStart(bool);
    resetBrightCells();
  }

  useEffect(() => {
    API.getPuzzle(gameDifficult, setPuzzle, setLoading);
  }, [start, gameDifficult])

  //Score
  const [score, setScore] = useState(0);
  const handleScore = (newScore) => { setScore(score + newScore) };
  const resetScore = () => { setScore(0) };

  const [hallOfFame, setHallOfFame] = useState([]);
  const handleHallOfFame = () => {
    API.getHallOfFame(setHallOfFame, setLoading);
  }

  const [myGames, setMyGames] = useState([]);
  const handleMyGames = () => {
    API.getMyGames(user, setMyGames, setLoading);
  }

  //This state support the Exit button in the game page.
  //It triggers the timer to stop.
  const [exitGame, setExitGame] = useState(false);
  const handleExitGame = (bool) => {
    setExitGame(bool);
  }

  return (
    <Router>
      <Routes>

        {/* ******************************************************** */}
        {/* *********************** Root Page ********************** */}
        {/* ******************************************************** */}
        <Route path="/" element={
          <>
            <style>{'body { background-color: #E8EF02; }'}</style>
            <Container style={{ marginTop: 100 }}>
              <Row className="justify-content-md-center">
                <h3 className="rainbow-text"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "70px",
                    fontFamily: 'Luckiest Guy',
                  }}
                > CruciPuzzle</h3>
              </Row>
              {!loggedIn && !guest ?
                <>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <Button
                        style={{
                          width: "130px",
                          height: "50px",
                        }}
                        onClick={() => handleShowLoginForm(true)}
                      >LogIn</Button>
                    </Col>
                    <Col>
                      <Button
                        style={{ width: "150px", height: "50px" }}
                        onClick={() => handleGuest(true)}
                      >Enter as guest</Button>
                    </Col>
                  </Row>
                </> :
                <Row>
                  <MyMenu
                    loggedIn={loggedIn}
                    user={user}
                    handleLoading={handleLoading}
                    handleLogOut={handleLogOut}
                    handleGuest={handleGuest}
                    handleHallOfFame={handleHallOfFame}
                    handleMyGames={handleMyGames}
                  />
                </Row>}
            </Container>
            <LoginForm
              showLoginForm={showLoginForm}
              handleShowLoginForm={handleShowLoginForm}
              logIn={API.logIn}
              handleLoggedIn={handleLoggedIn}
              handleUser={handleUser}
            />
          </>
        }>
        </Route>

        {/* ******************************************************** */}
        {/* *********************** Game Page ********************** */}
        {/* ******************************************************** */}
        <Route path="/main" element={
          <>
            <style>{'body { background-color: #E8EF02; }'}</style>
            <Row className="justify-content-md-center">
              <h3 className="rainbow-text"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "70px",
                  fontFamily: 'Luckiest Guy',
                }}
              > CruciPuzzle</h3>
            </Row>
            <Row >
              <Col align='right'>
                <h3>Score: {score}</h3>
              </Col>
              <Col align='center'>
                {loggedIn ? <h3>Player: {user}</h3> : ''}
              </Col>
              <Col align='left'>
                <Timer className="p-100"
                  user={user}
                  score={score}
                  start={start}
                  handleStart={handleStart}
                  handleShowScoreModal={handleShowScoreModal}
                  exitGame={exitGame}
                  handleExitGame={handleExitGame}
                  loggedIn={loggedIn}
                  createGame={API.createGame}
                />
              </Col>
            </Row>
            <Row >
              <Container>
                <Row >
                  <Col />
                  <Col align="center">
                    <GameGrid
                      gameDifficult={gameDifficult}
                      loading={loading}
                      puzzle={puzzle}
                      handleScore={handleScore}
                      className='align-center ml-3'
                      brightCells={brightCells}
                      handleBrightCells={handleBrightCells}
                    />
                  </Col>
                  <Col />
                </Row>
                <Row className='flex pt-3'>
                  <Col />
                  <Col>
                    <Button className='w-100'
                      onClick={() => {
                        handleExitGame(true)
                      }}>
                      Exit
                    </Button>
                  </Col>
                  <Col />
                </Row>
              </Container>
            </Row>
            {/* ******* Difficult Settings Modal ******* */}
            <MyModal
              showSettingsModal={showSettingsModal}
              handleShowSettingsModal={handleShowSettingsModal}
              gameDifficult={gameDifficult}
              handleGameDifficult={handleGameDifficult}
              puzzle={puzzle}
              handleStart={handleStart}
            />
            {/* ******* Score Modal ******* */}
            <MyScoreModal
              start={start}
              score={score}
              showScoreModal={showScoreModal}
              handleShowScoreModal={handleShowScoreModal}
              gameDifficult={gameDifficult}
              handleStart={handleStart}
              resetScore={resetScore}
            />
          </>
        }>
        </Route>

        {/* ******************************************************** */}
        {/* ********************* Hall Of Fame ********************* */}
        {/* ******************************************************** */}
        <Route path="/hallOfFame" element={
          <>
            <style>{'body { background-color: #E8EF02; }'}</style>
            <Container style={{ marginTop: 20 }}>
              <Row className="justify-content-md-center">
                <h3 className="rainbow-text"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "70px",
                    fontFamily: 'Luckiest Guy',
                  }}
                > CruciPuzzle</h3>
              </Row>
              <Row align='center'>
                <h1>Hall Of Fame</h1>
              </Row>
              {loading ?
                <Row align='center'>
                  <h3>Loading...</h3>
                </Row>
                : hallOfFame.map((el, index) => {
                  return <Row key={index}>
                    <Col />
                    <Col align='center'>
                      <h4>{el.username}</h4>
                    </Col>
                    <Col align='center'>
                      <h4>{el.score}</h4>
                    </Col>
                    <Col />
                  </Row>
                })
              }
              < Row className='flex pt-3'>
                <Col />
                <Col>
                  <Link to={'/'}>
                    <Button className='w-100'>
                      Exit
                    </Button>
                  </Link>
                </Col>
                <Col />
              </Row>
            </Container>
          </>
        }>
        </Route>

        {/* ******************************************************** */}
        {/* ********************* My Games ********************* */}
        {/* ******************************************************** */}
        <Route path="/myGames" element={
          <>
            <style>{'body { background-color: #E8EF02; }'}</style>
            <Container style={{ marginTop: 20 }}>
              <Row className="justify-content-md-center">
                <h3 className="rainbow-text"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "70px",
                    fontFamily: 'Luckiest Guy',
                  }}
                > CruciPuzzle</h3>
              </Row>
              <Row align='center'>
                <h1>MyGames</h1>
              </Row>

              {loading ?
                <Row align='center'>
                  <h3>Loading...</h3>
                </Row>
                : myGames.map((el, index) => {
                  return <Row key={index}>
                    <Col />
                    <Col align='center'>
                      <h4>Game {index}</h4>
                    </Col>
                    <Col align='center'>
                      <h4>{el.score}</h4>
                    </Col>
                    <Col />
                  </Row>
                })}
              <Row className='flex pt-3'>
                <Col />
                <Col>
                  <Link to={'/'}>
                    <Button className='w-100'>
                      Exit
                    </Button>
                  </Link>
                </Col>
                <Col />
              </Row>
            </Container>
          </>
        }>
        </Route>

      </Routes >

    </Router >
  );
}

export default App;
