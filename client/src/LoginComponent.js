import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState } from 'react';
import * as API from './API';


function LoginForm(props) {
    const [username, setUsername] = useState('username');
    const [password, setPassword] = useState('password');
    const [show, setShow] = useState(false); //error alert show state
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username: username, password: password };

        // basic validation ADD MORE
        let valid = true;
        if (username === '' || password === '') {
            valid = false;
            setErrorMessage('Email cannot be empty and password must be at least six character long.');
            setShow(true);
        }
        //Credentials are correct
        if (valid) {
            props.logIn(credentials)
                .then(() => {
                    props.handleShowLoginForm(false);
                    props.handleLoggedIn(true);
                    props.handleUser(credentials.username);
                })
                .catch((err) => { setErrorMessage(err); setShow(true); })
        }

    };


    return (
        <Modal centered show={props.showLoginForm} backdrop="static" animation={false}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                    </Alert>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="username"
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='pt-'controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button 
                        onClick={() => props.handleShowLoginForm(false)}
                    >Close</Button>
                    <Button type="submit"
                        onClick={handleSubmit}
                    >Login</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

function LogoutButton(props) {
    return (
        <Button variant="outline-light" onClick={props.logout}>Logout</Button>
    )
}

export { LoginForm, LogoutButton };