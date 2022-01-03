import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, Image, Button, Toast } from "react-bootstrap"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LoginForm } from './LoginComponent'
import './App.css';
import './LoginComponent'
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import './rainbowText.css'
import { MyModal } from './MyModal.js'
import { MyNavbar } from './MyNavbar.js'
import { GameGrid } from './GameGrid.js'
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

  //Game difficult level
  const [gameDifficult, setGameDifficult] = useState(1);
  const handleGameDifficult = (difficult) => {
    setGameDifficult(difficult);
  }

  //Puzzle is the group of letters that appear 
  const [puzzle, setPuzzle] = useState([]);

  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(false);
  const handleStart = (bool) => {
    setStart(bool);
  }

  

  useEffect(() => {
    API.getPuzzle(gameDifficult, setPuzzle, setLoading);
  }, [start])


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
                > *CruciPuzzle*</h3>
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
                    <Button style={{ width: "150px", height: "50px" }}>Enter as guest</Button>
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
            <Row>
              <h3>Punteggio</h3>
            </Row>
            <Row>
              <Container>
                <Row>
                  <Col/>
                  <Col>
                    <GameGrid
                      gameDifficult={gameDifficult}
                      loading={loading}
                      puzzle={puzzle}
                      className='ml-3'
                    />
                  </Col>
                  <Col/>
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
          </>
        }>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
