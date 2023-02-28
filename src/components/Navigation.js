import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock';


const Navigation = () => {
    const [loggedIn, setLoggedIn] = useState(false); // Use a state variable to track the login status

    const navigate = useNavigate(); // Use the usenavigate hook to access the browser navigate

    // Function that handles the login/logout button click
    const handleLoginClick = () => {
        if (loggedIn) {
            // If the user is logged in, log them out
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            setLoggedIn(false);
            navigate('/login');
        } else {
            // If the user is not logged in, redirect them to the login page
            navigate('/login');
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6">My App</Typography>
                </Box>
                <Box display="flex" alignItems="center" marginLeft="auto">
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                        Register
                    </Button>
                </Box>
                {loggedIn ? (
                    <Button color="inherit" onClick={handleLoginClick}>
                        <LockIcon />
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit" onClick={handleLoginClick}>
                        <LockOpenIcon />
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
