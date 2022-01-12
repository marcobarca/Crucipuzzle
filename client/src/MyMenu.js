import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './MyMenu.css';


function Menu(props) {



    return (
        <ListGroup className="mt-1 text-center text-align-center " variant="flush">
            {props.loggedIn ? <ListGroup.Item style={{ backgroundColor: 'rgb(21, 255, 0)', fontWeight: 'bold' }}>HELLO {props.user}!</ListGroup.Item> : ''}
            <Link to="/main" style={{ textDecoration: 'none' }}>
                <ListGroup.Item onClick={() =>
                    props.handleShowSettingsModal(true)
                }
                >Play</ListGroup.Item>
            </Link>

            {props.loggedIn ?
                <Link to="/MyGames" style={{ textDecoration: 'none' }}>
                    <ListGroup.Item onClick={() => {
                        props.handleLoading(true)
                        props.handleMyGames()
                    }}
                    >My Games</ListGroup.Item>
                </Link> : ''}

            <Link to="/HallOfFame" style={{ textDecoration: 'none' }}>
                <ListGroup.Item onClick={() => {
                    props.handleLoading(true)
                    props.handleHallOfFame()
                }}
                >Hall Of Fame</ListGroup.Item>
            </Link>

            {
                props.loggedIn ? <ListGroup.Item style={{ color: 'red' }}
                    onClick={() =>
                        props.handleLogOut()
                    }>LogOut</ListGroup.Item> : ''
            }

            {
                !props.loggedIn ? <ListGroup.Item style={{ color: 'red' }}
                    onClick={() => {
                        props.handleLogOut()
                        props.handleGuest(false)
                    }}>Exit</ListGroup.Item> : ''
            }
        </ListGroup >
    );
}

export { Menu };