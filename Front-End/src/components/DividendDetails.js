import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchDividendsByCompanyId,
    fetchAllDividends,
    selectDividends,
    selectDividendLoading,
    selectDividendError,
    updateDividend,
    deleteDividend
} from '../redux/dividend/dividendSlice';
import { selectCompanies, fetchCompanies } from '../redux/company/companySlice';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
    TablePagination, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField,
    Snackbar, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Alert from '@mui/material/Alert';

const DividendDetails = () => {
    const dispatch = useDispatch();
    const dividends = useSelector(selectDividends);
    const loading = useSelector(selectDividendLoading);
    const error = useSelector(selectDividendError);
    const companies = useSelector(selectCompanies);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [currentDividend, setCurrentDividend] = useState(null);

    // Snackbar States
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Validation Errors
    const [yearError, setYearError] = useState('');
    const [dividendAmountError, setDividendAmountError] = useState('');
    const [dividendYieldError, setDividendYieldError] = useState('');

    useEffect(() => {
        dispatch(fetchCompanies());
        dispatch(fetchAllDividends());
    }, [dispatch]);

    const handleEditOpen = (dividend) => {
        setCurrentDividend(dividend);
        setEditOpen(true);
    };

    const handleDeleteOpen = (dividend) => {
        setCurrentDividend(dividend);
        setDeleteOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setCurrentDividend(null);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
        setCurrentDividend(null);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const validateDividendData = () => {
        let valid = true;
        setYearError('');
        setDividendAmountError('');
        setDividendYieldError('');

        if (!currentDividend?.year || currentDividend.year <= 0) {
            setYearError('Year is required and must be greater than 0.');
            valid = false;
        }

        if (!currentDividend?.dividendAmount || currentDividend.dividendAmount < 0) {
            setDividendAmountError('Dividend Amount is required and must be a positive number.');
            valid = false;
        }

        if (!currentDividend?.dividendYield || currentDividend.dividendYield < 0) {
            setDividendYieldError('Dividend Yield is required and must be a positive number.');
            valid = false;
        }

        return valid;
    };

    const handleEditSave = async () => {
        // Validate the dividend data
        if (!validateDividendData()) {
            setSnackbarMessage('Please fix the errors in the form.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }
    
        try {
            await dispatch(updateDividend({
                id: currentDividend.id,
                updatedDividend: {
                    companyId: currentDividend.companyId, 
                    year: parseInt(currentDividend.year, 10),
                    dividendAmount: parseFloat(currentDividend.dividendAmount),
                    dividendYield: parseFloat(currentDividend.dividendYield)
                }
            })).unwrap();
            setSnackbarMessage('Dividend updated successfully!');
            setSnackbarSeverity('success');
            dispatch(fetchAllDividends());  
        } catch (error) {
            console.error('Update error:', error);
            setSnackbarMessage('Failed to update dividend.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
            handleEditClose();
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteDividend(currentDividend.id)).unwrap();
            setSnackbarMessage('Dividend deleted successfully!');
            setSnackbarSeverity('success');
            dispatch(fetchAllDividends());  // Fetch all dividends again
        } catch (error) {
            setSnackbarMessage('Failed to delete dividend.');
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
            handleDeleteClose();
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Function to get the company name by ID
    const getCompanyNameById = (companyId) => {
        const company = companies.find(company => company.id === companyId);
        return company ? company.name : 'Unknown';
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-center text-secondary mt-2 mb-4">Dividends List</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%' }}>Company Name</TableCell>
                            <TableCell style={{ width: '15%' }}>Year</TableCell>
                            <TableCell style={{ width: '20%' }}>Dividend Amount</TableCell>
                            <TableCell style={{ width: '20%' }}>Dividend Yield</TableCell>
                            <TableCell style={{ width: '15%', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dividends.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dividend) => (
                            <TableRow key={dividend.id}>
                                <TableCell style={{ width: '30%' }}>{getCompanyNameById(dividend.companyId)}</TableCell>
                                <TableCell style={{ width: '15%' }}>{dividend.year}</TableCell>
                                <TableCell style={{ width: '20%' }}>{dividend.dividendAmount}</TableCell>
                                <TableCell style={{ width: '20%' }}>{dividend.dividendYield}%</TableCell>
                                <TableCell style={{ width: '15%', textAlign: 'center' }}>
                                    <IconButton onClick={() => handleEditOpen(dividend)}>
                                        <Edit style={{ color: 'blue' }}/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteOpen(dividend)}>
                                        <Delete style={{ color: 'red' }}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={dividends.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 15]}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Dividend</DialogTitle>
                <DialogContent>
                    {/* Displaying the selected company name */}
                     <Typography variant="subtitle1" gutterBottom>
                        Edit dividend data for: <strong>{getCompanyNameById(currentDividend?.companyId)}</strong>
                    </Typography>
                    <TextField
                        label="Year"
                        type="number"
                        fullWidth
                        value={currentDividend?.year || ''}
                        onChange={(e) => setCurrentDividend({ ...currentDividend, year: e.target.value })}
                        margin="dense"
                        error={Boolean(yearError)}
                        helperText={yearError}
                    />
                    <TextField
                        label="Dividend Amount"
                        type="number"
                        fullWidth
                        value={currentDividend?.dividendAmount || ''}
                        onChange={(e) => setCurrentDividend({ ...currentDividend, dividendAmount: e.target.value })}
                        margin="dense"
                        error={Boolean(dividendAmountError)}
                        helperText={dividendAmountError}
                    />
                    <TextField
                        label="Dividend Yield"
                        type="number"
                        fullWidth
                        value={currentDividend?.dividendYield || ''}
                        onChange={(e) => setCurrentDividend({ ...currentDividend, dividendYield: e.target.value })}
                        margin="dense"
                        error={Boolean(dividendYieldError)}
                        helperText={dividendYieldError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this dividend?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DividendDetails;
