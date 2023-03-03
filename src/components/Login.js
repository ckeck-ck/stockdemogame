import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import mui for styling
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);

    const navigate = useNavigate(); // Use the useNavigate hook to access the browser navigate

    // Function that checks if the userName and password are valid
    const doLogin = () => {
        const storedUserName = localStorage.getItem('user');
        const storedPassword = localStorage.getItem('password');

        if (userName === storedUserName && password === storedPassword) {
            // Login successful
            setLoginError(false);
            navigate('/dashboard'); // Use the push method to redirect to the dashboard component
        } else {
            // Login failed
            setLoginError(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h6" align='center'>
                Anmelden:
            </Typography>
            <Box
                component="form"
                onSubmit={doLogin}
                sx={{ mt: 1 }}
            >
                <TextField
                    margin='normal'
                    fullWidth
                    id="userName"
                    label="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginError && <Typography color="error">Falsche Benutzername oder Passwort.</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button variant="contained" color="primary" type="submit">
                        Login
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary" align="center">
                    Sie haben noch keinen Account?{' '}
                    <Link to="/register">
                        Registrieren
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default Login;
