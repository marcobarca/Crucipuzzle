import { Modal } from 'react-bootstrap'
import { Col, Row, Container, Image, Button, Toast, Dropdown, Nav, NavDropdown } from "react-bootstrap"

function MyModal(props) {

    return (
        <Modal show={props.showSettingsModal} onHide={() => props.handleShowSettingsModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Game Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Col>
                        <h4>
                            Difficult
                        </h4>
                    </Col>
                    <Col>
                        <Nav>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={props.gameDifficult}
                                menuVariant="dark"
                            >
                                <NavDropdown.Item onClick={() => {
                                    props.handleGameDifficult('1')
                                    
                                }}>1</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    props.handleGameDifficult('2')
                                    
                                }}>2</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    props.handleGameDifficult('3')
                                    
                                }}>3</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    props.handleGameDifficult('4')
                                    
                                }}>4</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {
                                    props.handleGameDifficult('5')
                                    
                                }}>5</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Col>

                </Row>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary"
                    onClick={() => {
                        props.handleShowSettingsModal(false)
                    }}
                >Exit</Button>
                <Button variant="primary"
                    onClick={() => {
                        props.handleShowSettingsModal(false)
                        props.handleStart(true)
                    }}
                >Start game</Button>
            </Modal.Footer>
        </Modal >

    )
}

export { MyModal };