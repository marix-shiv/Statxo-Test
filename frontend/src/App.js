import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Button, Container, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Grid, Box
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Main App Component
const App = () => {
    const [data, setData] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: '', quantity: '', amount: '', postingYear: '', postingMonth: '', actionType: '', actionNumber: '', actionName: '', status: '', Impact: ''
    });
    const [isAdmin, setIsAdmin] = useState(null); // 'null' for no role, 'user' for user, 'admin' for admin

    useEffect(() => {
        if (isAdmin !== null) {
            axios.get('http://localhost:3001/data')
                .then(response => setData(response.data))
                .catch(error => console.error(error));
        }
    }, [isAdmin]);

    const handleInputChange = (e, index, field) => {
        const updatedData = [...data];
        updatedData[index][field] = e.target.value;
        setData(updatedData);
    };

    const handleSave = () => {
        axios.post('http://localhost:3001/update', data)
            .then(response => {
                alert(response.data.message);
                // Optionally, refetch the data from the backend to ensure it's up-to-date
                axios.get('http://localhost:3001/data')
                    .then(response => setData(response.data))
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    };

    const handleNewRecordChange = (e) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleAddRecord = () => {
        setData([...data, newRecord]);
        setNewRecord({
            id: '', quantity: '', amount: '', postingYear: '', postingMonth: '', actionType: '', actionNumber: '', actionName: '', status: '', Impact: ''
        });
    };

    const handleLogin = (role) => {
        if (role === null) {
            // Logout functionality
            setIsAdmin(null);
        } else {
            setIsAdmin(role);
        }
    };

    const impactCounts = data.reduce((acc, item) => {
        acc[item.Impact] = (acc[item.Impact] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(impactCounts).map(key => ({ Impact: key, count: impactCounts[key] }));

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        STATXO
                    </Typography>
                    {isAdmin === null ? (
                        <>
                            <Button color="inherit" onClick={() => handleLogin('user')}>Login as User</Button>
                            <Button color="inherit" onClick={() => handleLogin('admin')}>Login as Admin</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => handleLogin(null)}>Logout</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                {isAdmin === null ? (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <Typography variant="h4">Welcome to STATXO</Typography>
                        <Typography variant="h6">Please select your role:</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleLogin('user')}>Login as User</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleLogin('admin')}>Login as Admin</Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Posting Year</TableCell>
                                            <TableCell>Posting Month</TableCell>
                                            <TableCell>Action Type</TableCell>
                                            <TableCell>Action Number</TableCell>
                                            <TableCell>Action Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Impact</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={item.amount}
                                                        onChange={(e) => handleInputChange(e, index, 'amount')}
                                                        // disabled={isAdmin === 'user'} // Disable for users
                                                    />
                                                </TableCell>
                                                <TableCell>{item.postingYear}</TableCell>
                                                <TableCell>{item.postingMonth}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="text"
                                                        value={item.actionType}
                                                        onChange={(e) => handleInputChange(e, index, 'actionType')}
                                                        // disabled={isAdmin === 'user'} // Disable for users
                                                    />
                                                </TableCell>
                                                <TableCell>{item.actionNumber}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="text"
                                                        value={item.actionName}
                                                        onChange={(e) => handleInputChange(e, index, 'actionName')}
                                                        // disabled={isAdmin === 'user'} // Disable for users
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {isAdmin === 'admin' ? (
                                                        <TextField
                                                            type="text"
                                                            value={item.status}
                                                            onChange={(e) => handleInputChange(e, index, 'status')}
                                                        />
                                                    ) : (
                                                        item.status
                                                    )}
                                                </TableCell>
                                                <TableCell>{item.Impact}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleSave}>Save Changes</Button>
                        </Grid>
                        {isAdmin === 'admin' && (
                            <>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Add New Record</Typography>
                                    <Grid container spacing={2}>
                                        {Object.keys(newRecord).map(key => (
                                            <Grid item xs={6} sm={4} md={3} key={key}>
                                                <TextField
                                                    name={key}
                                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    value={newRecord[key]}
                                                    onChange={handleNewRecordChange}
                                                    fullWidth
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled={key === 'status'} // Disable the status field for adding new records
                                                />
                                            </Grid>
                                        ))}
                                        <Grid item xs={12}>
                                            <Button variant="contained" color="secondary" onClick={handleAddRecord}>Add Record</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="h6">Impact Chart</Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="Impact" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default App;
