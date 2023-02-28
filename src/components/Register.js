import React, { useState } from 'react';

// Design imports
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';




const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/; // for password validation
const ZIP_REGEX = /^[0-9]{5}$/;
const MAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const JUSTLETTER_REGEX = /^[A-Za-z]+$/;



const Register = () => {

    const [success, setSuccess] = useState(false);
    const [email, setEmailValue] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [userName, setUserName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    // check if username value matches regex
    const isUserNameValid = () => {
        return USER_REGEX.test(userName.trim());
    }

    // check if email value matches regex
    const isEmailValid = () => {
        return MAIL_REGEX.test(email.trim());
    }

    // check if password value matches regex
    const isPasswordValid = () => {
        return PWD_REGEX.test(password.trim());
    }

    // check if passwords match
    const doPasswordsMatch = () => {
        return password === passwordConfirmation;
    }

    const isDateOfBirthValid = () => {

        if (!dateOfBirth) {
            return false;
        }

        const date = new Date(dateOfBirth);
        const today = new Date();

        var ageDiff = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            ageDiff--;
        }

        return ageDiff >= 18;
    };

    // save username and password to local storage
    const registerUser = () => {
        localStorage.setItem('user', userName);
        localStorage.setItem('password', password);
    };


    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5" align='center'>
                Sign up
            </Typography>
            <Box
                component="form"
                onSubmit={registerUser}
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="username"
                    label="Username"
                    type="text"
                    id="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    error={!isUserNameValid()}
                    helperText={!isUserNameValid() ? 'Please enter a valid username' : ''}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="E-Mail"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmailValue(e.target.value)}
                    error={!isEmailValid()}
                    helperText={!isEmailValid() ? 'Please enter a valid email address' : ''}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!isPasswordValid()}
                    helperText={!isPasswordValid() ? 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be between 8 and 24 characters long' : ''}
                />
                <TextField
                    margin='normal'
                    required
                    fullWidth
                    id="password-confirmation"
                    label="Confirm Password"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    error={!doPasswordsMatch()}
                    helperText={!doPasswordsMatch() ? 'Passwords do not match' : ''}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="date of birth"
                    label="Date of Birth"
                    type="date"
                    id="date-of-birth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    error={!isDateOfBirthValid()}
                    helperText={!isDateOfBirthValid() ? 'Please enter a valid date of birth and ensure you are at least 18 years old.' : ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    )
}

export default Register;