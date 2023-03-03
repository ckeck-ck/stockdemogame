import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);
    const [email, setEmailValue] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [userName, setUserName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    // user information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [residence, setResidence] = useState('');

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

    const isAddressValid = () => {
        return JUSTLETTER_REGEX.test(address.trim());
    }

    const isFirstnameValid = () => {
        return JUSTLETTER_REGEX.test(firstName.trim());
    }

    const isLastNameValid = () => {
        return JUSTLETTER_REGEX.test(lastName.trim());
    }

    const isZipCodeValid = () => {
        ZIP_REGEX.test(zipCode.trim());
    }

    const isResidenceValid = () => {
        JUSTLETTER_REGEX.test(residence.trim());
    }

    // save username and password to local storage
    const registerUser = () => {
        localStorage.setItem('user', userName);
        localStorage.setItem('password', password);

        // set succes state to true and redirect to dashboard
        setSuccess(true);
        navigate('/dashboard')
    };


    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h3" align='center'>
                Sign up
            </Typography>
            <Box
                component="form"
                onSubmit={registerUser}
                sx={{ mt: 1 }}
            >
                <Typography variant='h5' color={'gray'}>
                    <br />
                    User information
                </Typography>
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
                    helperText={!isUserNameValid() ? 'Bitte geben Sie einen Benutzernamen ein' : ''}
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
                    helperText={!isEmailValid() ? 'Bitte geben Sie eine E-Mail Adresse ein.' : ''}
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
                    helperText={!isPasswordValid() ? 'Das Passwort muss mindestens einen Kleinbuchstaben, einen Großbuchstaben, eine Nummer und ein Sonderzeichen beinhalten. Passwortlänge 8-24 Zeichen' : ''}
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
                    helperText={!doPasswordsMatch() ? 'Passwörter stimmen nicht überein' : ''}
                />
                <Typography variant='h5' color={'gray'}>
                    <br />
                    Persönliche informationen
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="firstName"
                    label="Vorname"
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!isFirstnameValid()}
                    helperText={!isFirstnameValid() ? 'Bitte geben Sie einen Namen ein' : ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="lastName"
                    label="Nachname"
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!isLastNameValid()}
                    helperText={!isLastNameValid() ? 'Bitte geben Sie einen Namen ein.' : ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="date of birth"
                    label="Geburtsdatum"
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="address"
                    label="Adresse"
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    error={!isAddressValid()}
                    helperText={!isAddressValid() ? 'Please enter a valid address' : ''}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="residence"
                    label="Anschrift"
                    type="text"
                    id="residence"
                    value={residence}
                    onChange={(e) => setResidence(e.target.value)}
                    error={!isResidenceValid()}
                    helperText={!isResidenceValid() ? 'Please enter a valid residence' : ''}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="zipcode"
                    label="Postleitzahl"
                    type="text"
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    error={!isZipCodeValid()}
                    helperText={!isZipCodeValid() ? 'Please enter a valid zip code' : ''}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                >
                    Registrieren
                </Button>
            </Box>
        </Container>
    )
}

export default Register;