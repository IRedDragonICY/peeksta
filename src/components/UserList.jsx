import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export function UserList({ users, searchTerm, onSearchChange }) {
    const filteredUsers = users.filter((username) =>
        username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (users.length === 0) {
        return (
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', mt: 2 }}>
                <Typography variant="subtitle1">
                    All users are following you back!
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                label="Search users..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{ mb: 2 }}
            />
            {filteredUsers.length === 0 && searchTerm && (
                <Typography variant="subtitle1" sx={{ textAlign: 'center', my: 2 }}>
                    No users found matching your search.
                </Typography>
            )}
            {filteredUsers.length > 0 && (
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {filteredUsers.map((username) => (
                        <ListItem
                            key={username}
                            disablePadding
                            divider
                            sx={{ '&:last-child': { borderBottom: 'none' } }}
                        >
                            <Link
                                href={`https://www.instagram.com/${username}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    textDecoration: 'none',
                                    color: 'inherit', // Inherit color from ListItemText
                                    width: '100%',
                                    p: 1, // Padding for the link area
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.action.hover,
                                    },
                                }}
                            >
                                <ListItemText primary={username} />
                            </Link>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
}
