import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, Button} from "react-bootstrap"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LoginForm } from './LoginComponent'
import './App.css';
import './LoginComponent'
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import './rainbowText.css'
import { MyModal, MyScoreModal } from './MyModal.js'
import { MyNavbar } from './MyNavbar.js'
import { GameGrid } from './GameGrid.js'
import { Timer } from './Timer.js'
import * as API from './API';

function App() {

  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const [showLoginForm, setShowLoginForm] = useState(false);
  const handleShowLoginForm = (bool) => setShowLoginForm(bool);

  //State of the Modal that allow to set the difficult
  const [showSettingsModal, setShowSettingsModal] = useState(true);
  const handleShowSettingsModal = (bool) => {
    setShowSettingsModal(bool);
  }

  //State of the Modal that appears at the end of the game
  const [showScoreModal, setShowScoreModal] = useState(false);
  const handleShowScoreModal = (bool) => {
    setShowScoreModal(bool);
  }

  //State that mantain the coordinates of the lighted on cells in GameGrid
  const [brightCells, setBrightCells] = useState([]);
  const handleBrightCells = (cell) => {
    let tmp = brightCells;
    tmp.push(cell)
    setBrightCells(tmp)
  }
  const resetBrightCells = () => {
    setBrightCells([]);
  }

  //Game difficult level
  const [gameDifficult, setGameDifficult] = useState(1);
  const handleGameDifficult = (difficult) => {
    setGameDifficult(difficult);
  }

  //Puzzle is the group of letters that appear 
  const [puzzle, setPuzzle] = useState([]);

  const [loading, setLoading] = useState(true);

  //The start state is true only while the user is playing
  const [start, setStart] = useState(false);
  const handleStart = (bool) => {
    setStart(bool);
    resetBrightCells();
  }

  //Score
  const [score, setScore] = useState(0);
  const handleScore = (newScore) => {
    setScore(score + newScore)
  }
  const resetScore = () => {
    setScore(0);
  }

  useEffect(() => {
    API.getPuzzle(gameDifficult, setPuzzle, setLoading);
  }, [start, gameDifficult])


  return (
    <Router>
      <Routes>
        {/* ******* Initial Page ******* */}
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
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button
                    style={{
                      width: "130px",
                      height: "50px",
                    }}
                  >LogIn</Button>
                </Col>
                <Col>
                  <Link to="/main">
                    <Button 
                    style={{ width: "150px", height: "50px" }}
                    onClick={ () => {handleShowSettingsModal(true)}}
                    >Enter as guest</Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </>
        }>
        </Route>
        {/* ******* Game Page ******* */}
        <Route path="/main" element={
          <>
            <MyNavbar />
            <Row >
              <Col className='aligh-right'>
                <Row>  <h3>Score: {score}</h3></Row>
                <Row>
                  <Timer className="p-100"
                    start={start}
                    handleStart={handleStart}
                    handleShowScoreModal={handleShowScoreModal}
                  />
                </Row>

              </Col>
              <Col >

              </Col>
            </Row>
            <Row >
              <Container>
                <Row >
                  <Col />
                  <Col>
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
      </Routes>
    </Router>
  );
}

export default App;
