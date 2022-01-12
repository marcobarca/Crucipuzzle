import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState } from 'react';


function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            if (username === '' && password === '')
                setErrorMessage('Username and Password cannot be empty!');
            else if (username === '')
                setErrorMessage('Username cannot be empty!');
            else if (password === '')
                setErrorMessage('Password cannot be empty!');
            setShow(true);
        }

        if (username === '') {

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
                            placeholder="Enter username"
                        />
                    </Form.Group>
                    <Form.Group className='pt-' controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            placeholder="Enter password"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            props.handleShowLoginForm(false)
                            setShow(false)
                        }}
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