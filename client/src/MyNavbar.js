import { Navbar, Col, Nav, Dropdown, DropdownButton, ButtonGroup, Container, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import './rainbowText.css'



function MyNavbar(props) {
    return (
        <Navbar style={{ backgroundColor: '#E8EF02' }} expand="lg">

            <Col className="d-flex  px-2" style={{ top: '0' }}>
                <Link to="/main" style={{ color: '#003366' }}>
                    <Navbar.Brand className="rainbow-text" style={{ fontFamily: 'Luckiest Guy' }} >
                        CruciPuzzle</Navbar.Brand>
                </Link>
            </Col>

            <Col className="d-flex justify-content-end px-2">
                <h5>{props.loggedIn ? props.user : ''}</h5>
            </Col>
            {props.loggedIn ?
                <Col className="d-flex justify-content-end px-2">
                    <Link to={'/'}>
                        <Button
                            onClick={props.handleLogOut}
                        >
                            LogOut
                        </Button>
                    </Link>
                </Col> : ''}
        </Navbar >

    );
}

export { MyNavbar };

//Hiding element when screen is small/large:  https://getbootstrap.com/docs/4.4/utilities/display/
//PADDING: https://mdbootstrap.com/docs/b5/react/utilities/spacing/
//Usere px-2 per aggiungere padding orizzontale e distanziare gli oggetti dal margine. px-sm-2 per aggiungere solo a finestra small
//Usare p-2 per aggiungerre padding in tutti i lati