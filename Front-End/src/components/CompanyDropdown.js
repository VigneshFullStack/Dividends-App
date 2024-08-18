import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies, setSelectedCompany, selectCompanies, selectSelectedCompany } from '../redux/company/companySlice';
import { addDividend, fetchDividendsByCompanyId, selectDividendError } from '../redux/dividend/dividendSlice';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { Alert } from '@mui/material';

const CompanyDropdown = () => {
    const dispatch = useDispatch();
    const companies = useSelector(selectCompanies);
    const selectedCompany = useSelector(selectSelectedCompany); 
    const dividendError = useSelector(selectDividendError); 

    const [open, setOpen] = useState(false);
    const [year, setYear] = useState('');
    const [dividendAmount, setDividendAmount] = useState('');
    const [dividendYield, setDividendYield] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const selectedCompanyName = companies.find(company => company.id === selectedCompany)?.name || '';

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    useEffect(() => {
        if (companies.length > 0 && !selectedCompany) {
            dispatch(setSelectedCompany(companies[0].id));
        }
    }, [companies, selectedCompany, dispatch]);

    const handleSelectChange = (event) => {
        const companyId = event.target.value;
        dispatch(setSelectedCompany(companyId));
        dispatch(fetchDividendsByCompanyId(companyId));
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setYear('');
        setDividendAmount('');
        setDividendYield('');
    };

    const handleSubmit = () => {
        if (!year || isNaN(year) || !dividendAmount || isNaN(dividendAmount) || !dividendYield || isNaN(dividendYield)) {
            alert('Please provide valid inputs.');
            return;
        }

        const newDividend = {
            companyId: selectedCompany,
            year: parseInt(year, 10),
            dividendAmount: parseFloat(dividendAmount),
            dividendYield: parseFloat(dividendYield),
        };

        dispatch(addDividend(newDividend))
            .unwrap() // Handle fulfilled or rejected actions
            .then(() => {
                dispatch(fetchDividendsByCompanyId(selectedCompany));
                setSnackbarMessage('Dividend added successfully!');
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error('Add Dividend Error:', error);
                setSnackbarMessage(`Error adding dividend: ${error.message || 'Unknown error'}`);
                setSnackbarOpen(true);
            });

        handleClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FormControl variant="outlined" style={{ width: '300px', marginBottom: '20px' }}>
                <InputLabel id="company-select-label">Select a company</InputLabel>
                <Select
                    labelId="company-select-label"
                    value={selectedCompany || ''}
                    onChange={handleSelectChange}
                    label="Select a company"
                >
                    <MenuItem value="" disabled>Select a company</MenuItem>
                    {companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                            {company.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleOpen} disabled={!selectedCompany}>
                Add Dividend
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Dividend Data</DialogTitle>
                <DialogContent>
                    {/* Displaying the selected company name */}
                    <Typography variant="subtitle1" gutterBottom>
                        Adding dividend data for: <strong>{selectedCompanyName}</strong>
                    </Typography>
                    <TextField
                        label="Year"
                        type="number"
                        fullWidth
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        margin="dense"
                    />
                    <TextField
                        label="Dividend Amount"
                        type="number"
                        fullWidth
                        value={dividendAmount}
                        onChange={(e) => setDividendAmount(e.target.value)}
                        margin="dense"
                    />
                    <TextField
                        label="Dividend Yield"
                        type="number"
                        fullWidth
                        value={dividendYield}
                        onChange={(e) => setDividendYield(e.target.value)}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for success/error messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                action={
                    <Button color="inherit" onClick={handleSnackbarClose}>
                        Close
                    </Button>
                }
            >
                <Alert onClose={handleSnackbarClose} severity={dividendError ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CompanyDropdown;
