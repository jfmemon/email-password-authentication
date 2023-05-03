import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import firebaseApp from '../firebase/firebase.init';
import { Link } from 'react-router-dom';

const auth = getAuth(firebaseApp);
const ReactBootstrapForm = () => {
    const [passwordError, setPasswordError] = useState('')
    const [success, setSuccess] = useState(false)
    const handleRegister = (event) => {
        setSuccess(false);
        event.preventDefault();

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password, name);

        if (!/(?=.*[A-Z])/.test(password)) {
            setPasswordError('Please enter at-least 1 uppercase');
            return;
        }
        if (password.length < 8) {
            setPasswordError('Password should be at-least 8 characters.');
            return;
        }
        if (!/(?=.*[!@#$&*])/.test(password)) {
            setPasswordError('Password should be contain at-least 1 special character.');
            return;
        }
        if (!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)) {
            setPasswordError('Password should be at-least 3 lowercase letter.');
            return;
        }
        if (!/(?=.*[0-9])/) {
            setPasswordError('Password should be contain at-least 1 digit.');
            return;
        }
        setPasswordError('');

        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {               // creating user
                console.log(result.user)
                const user = result.user;
                console.log(user);
                setSuccess(true);
                form.reset();
                emailVerification();
                userNameUpdate(name)
            })
            .catch(error => {
                console.log('Error: ', error);
                setPasswordError(error.message);
            })
    }

    const emailVerification = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert('Please check your email for verification.');
            })
    }

    const userNameUpdate = name => {

        updateProfile(auth.currentUser, {
            displayName: name, photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
            console.log('Profile updated.')
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className='w-50 mx-auto p-2'>
            <h4 className='text-primary'>Please complete your registration.</h4>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Your name</Form.Label>
                    <Form.Control type="text" name='name' placeholder="Enter your name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name='email' placeholder="Enter email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" required />
                </Form.Group>
                <p className='text-danger'>{passwordError}</p>
                {success && <p className='text-success'>Registration successful.</p>}
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            <p><small>Already have an account? Please <Link to='/login'>Login</Link>.</small></p>
        </div>
    );
};

export default ReactBootstrapForm;