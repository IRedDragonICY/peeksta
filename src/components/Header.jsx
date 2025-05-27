import logo from '../assets/logo.png';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField'; // For label, or can use Typography

export function Header({ themeMode, toggleTheme, userPrimaryColor, handlePrimaryColorChange }) {
    return (
        <Box component="header" sx={{ textAlign: 'center', py: 2 }}>
            <Container maxWidth="md">
                <img src={logo} alt="Logo" style={{ height: '128px' }} />
                <Typography variant="h3" component="h1" gutterBottom>
                    Peeksta
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    To download your followers and following data in JSON format, visit{' '}
                    <Link
                        href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        this link
                    </Link>
                    .
                </Typography>
                <Button variant="contained" onClick={toggleTheme} sx={{ mb: 2, mr: 2 }}>
                    Switch to {themeMode === 'light' ? 'Dark' : 'Light'} Mode
                </Button>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                        Primary Color:
                    </Typography>
                    <input
                        type="color"
                        value={userPrimaryColor}
                        onChange={handlePrimaryColorChange}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0, // Reset padding
                            backgroundColor: 'transparent', // Ensure no bg color interferes
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
