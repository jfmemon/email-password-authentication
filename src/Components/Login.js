import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import firebaseApp from '../firebase/firebase.init';


const auth = getAuth(firebaseApp);
const Login = () => {
    const [loginError, setLoginError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const handleLogin = event => {
        setSuccess(false);
        setLoginError('');
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);

        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                setSuccess(true);
                form.reset();
            })
            .catch(error => {
                console.error('Error: ', error.code);
                setLoginError(error.message);
            })
    }

    const handleUserEmail = (event) => {
        const email = event.target.value;
        setUserEmail(email);
        console.log(email);
    }

    const handleForgetPassword = () => {
        if(!userEmail) {
            alert('Please enter your email.')
        }
        sendPasswordResetEmail(auth, userEmail)
        .then(() => {
            alert('Password reset email sent.Please check your email.');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
          });
    }

    return (
        <div className='w-50 mx-auto'>
            <h4 className='text-primary'>Please login</h4>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <input onBlur={handleUserEmail} type="email" name='email' className="form-control" id="formGroupExampleInput" placeholder="Email" />
                </div>
                <div className="mb-3">
                    <input type="password" name='password' className="form-control" id="formGroupExampleInput2" placeholder="Password" />
                </div>
                <p className='text-danger'>{loginError}</p>
                {success && <p className='text-primary'>Login successful.</p>}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p><small>New to this website? Please <Link to='/register'>Register</Link></small></p>
            <p><small>Forget password? <Link onClick={handleForgetPassword}>Reset Password.</Link> </small></p>
        </div>
    );
};

export default Login;