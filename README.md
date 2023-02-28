import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const theme = createTheme();

const errorMessageType = {
    Standard: 0,
    NoLineBreak: 1,
};

function showError(id, type, message) {
    const errorMessage = [
        '<label id="errorMessage">{message}</label>',
        '<label id="errorMessage" className="text-nowrap">{message}</label>'
    ];

    const el = document.getElementById(id);
    el.insertAdjacentHTML('afterend', errorMessage[type].replace('{message}', message));
}

const LoginPage = () => {
    const [success, setSuccess] = useState(false);

    function validateInputs() {
        document.querySelectorAll('#errorMessage').forEach((el) => el.remove());

        let success = checkRequired();

        if (success) {
            success = validateUserData();
            success = validateContactData();
        } else {
            alert('Please fill in all required fields');
        }

        if (success) {
            // redirect to simulation page
        }
    }

    function checkRequired() {
        let success=true;

        // Check all required information
        document.querySelectorAll('input[required]').forEach((el) => {
            if (el.value === '') {
                el.style.backgroundColor = 'burlywood';
                showError(el.id, errorMessageType.Standard, '${el.placeholder} is required');
                success = false;
            } else {
                el.style.backgroundColor = '#fff';
            }
        });

        return success;
    }

    function validateUserData() {
        let success = true;

        if (!MAIL_REGEX.test(document.getElementById('email').value)) {
            showError('email', errorMessageType.Standard, 'Mail address invalid');
            setSuccess(false);
        }

        if (!PWD_REGEX.test(document.getElementById('registerPassword').value)) {
            showError('registerPassword', errorMessageType.Standard, 'Password must contains between 8 & 24 characters')
            setSuccess(false);
        }

        if (!USER_REGEX.test(document.getElementById('userName').value)) {
            showError('userName', errorMessageType.Standard, 'Username must contain between 3 & 23 letters or numbers')
            setSuccess(false);
        }

        if (document.getElementById('registerPassword').value !== document.getElementById('confirmPassword').value) {
            showError('registerPassword', errorMessageType.Standard, "Passwords don't match");
            setSuccess(false);
        }

        return success;
    }

    function validateContactData() {
        let success = true;

        document.querySelectorAll('input[justLetters]').forEach((el) => {
            if (el.value !== '' && !JUSTLETTER_REGEX.test(el.value)) {
                showError(el.id, errorMessageType.Standard, 'Just letters allowed');
                setSuccess(false);
            }
        });

        if (success) {
            const currentDate = new Date();
            const birthday = new Date(document.getElementById('birthday').value);

            if (
                birthday.getFullYear() < currentDate.getFullYear() -200 ||
                birthday.getFullYear() > currentDate.getFullYear()
            ) {
                showError('birthday', errorMessageType.Standard, 'Invalid date');
                setSuccess(false)
            }

            if (success) {
                const yearDiff = currentDate.getFullYear() - birthday.getFullYear();

                if (yearDiff < 18) {
                    setSuccess(false)
                } else if (yearDiff === 18) {
                    if (birthday.getMonth() > currentDate.getMonth()) {
                        setSuccess(false);
                    } else if (birthday.getMonth === currentDate.getMonth()) {
                        if (birthday.getDate() > currentDate.getDate()) {
                            setSuccess(false);
                        }
                    }
                }

                if (!success) {
                    showError('birthday', errorMessageType.Standard, 'You must be 18 years or older');
                }
            }

            if (success) {
                if(!ZIP_REGEX.test(document.getElementById('zipCode').value)) {
                    showError('zipCode', errorMessageType.Standard, 'Invalid zip code');
                    setSuccess(false);
                }
            }
        }
        return success;
    }

    return (
            <ThemeProvider theme={theme}>
                <Container component="login" maxWidth="xs">
                    <CssBaseline />
                    <Box sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }} >
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={validateInputs}
                            sx={{ mt: 1 }} 
                        >
                            <TextField 
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                type="text"
                                autoFocus
                            />
                            <TextField 
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                            />
                            <FormControlLabel 
                                control={<Checkbox value="remember" color="primary"i />}
                                label="Remember me"
                            />
                            <Button 
                                type="submit"
                                fullWidth
                                sx={{mt: 3, mb: 2}}
                            >
                                Sign in
                            </Button>
                            <Grid item sx>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
                </ThemeProvider>
    );
}

export default LoginPage;