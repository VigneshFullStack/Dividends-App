import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies, addCompany, updateCompany, deleteCompany, selectCompanies, selectLoading, selectError } from '../redux/company/companySlice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TablePagination from '@mui/material/TablePagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Companies = () => {
    const dispatch = useDispatch();
    const companies = useSelector(selectCompanies);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentCompany, setCurrentCompany] = useState({ id: 0, name: '' });

    // Validation and Snackbar State
    const [nameError, setNameError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Delete Confirmation Dialog States
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    const handleAdd = () => {
        setCurrentCompany({ id: 0, name: '' });
        setModalType('add');
        setShowModal(true);
    };

    const handleEdit = (company) => {
        setCurrentCompany(company);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDelete = (company) => {
        setCompanyToDelete(company);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (companyToDelete) {
            dispatch(deleteCompany(companyToDelete.id))
                .then(() => {
                    setSnackbarMessage('Company deleted successfully!');
                    setSnackbarSeverity('success');
                    dispatch(fetchCompanies()); // Fetch updated list
                })
                .catch(() => {
                    setSnackbarMessage('Failed to delete company.');
                    setSnackbarSeverity('error');
                });
        }
        setShowDeleteDialog(false);
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
    };

    const validateForm = () => {
        let valid = true;
        setNameError('');

        if (!currentCompany.name.trim()) {
            setNameError('Company Name is required.');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const companyToSend = { ...currentCompany };
            if (modalType === 'add') {
                dispatch(addCompany(companyToSend))
                    .then(() => {
                        setSnackbarMessage('Company added successfully!');
                        setSnackbarSeverity('success');
                        dispatch(fetchCompanies()); // Fetch updated list
                    })
                    .catch((error) => {
                        const errorMessage = error.response?.data?.message || error.message;
                        setSnackbarMessage(`Failed to add company: ${errorMessage}`);
                        setSnackbarSeverity('error');
                    });
            } else if (modalType === 'edit') {
                dispatch(updateCompany({ id: currentCompany.id, company: companyToSend }))
                    .then(() => {
                        setSnackbarMessage('Company updated successfully!');
                        setSnackbarSeverity('success');
                        dispatch(fetchCompanies()); // Fetch updated list
                    })
                    .catch((error) => {
                        const errorMessage = error.response?.data?.message || error.message;
                        setSnackbarMessage(`Failed to update company: ${errorMessage}`);
                        setSnackbarSeverity('error');
                    });
            }
            setOpenSnackbar(true);
            setShowModal(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const resetModalState = () => {
        setNameError('');
        setSnackbarMessage('');
        setSnackbarSeverity('success');
        setOpenSnackbar(false);
    };
    
    // Use this function in the onClose handler of your modal
    const handleCloseModal = () => {
        resetModalState();
        setShowModal(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h2 className="text-center text-secondary mb-4">Companies List</h2>
            <Button variant="contained" color="primary" className="mb-3" onClick={handleAdd}>Add Company</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '70%' }}>Company Name</TableCell>
                            <TableCell style={{ width: '30%', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
                            <TableRow key={company.id}>
                                <TableCell style={{ width: '70%' }}>{company.name}</TableCell>
                                <TableCell style={{ width: '30%', textAlign: 'center' }}>
                                    <Button variant="outlined" size="small" className="me-3" onClick={() => handleEdit(company)}>Edit</Button>
                                    <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(company)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={companies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Add/Edit Modal */}
            <Dialog open={showModal} onClose={handleCloseModal}
                 PaperProps={{
                    style: {
                        width: '600px', 
                        maxHeight: '500px',
                    },
                }}>
                <DialogTitle>{modalType === 'add' ? 'Add Company' : 'Edit Company'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Company Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentCompany.name}
                        onChange={(e) => setCurrentCompany({ ...currentCompany, name: e.target.value })}
                        error={Boolean(nameError)}
                        helperText={nameError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Close
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {modalType === 'add' ? 'Add Company' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={cancelDelete}
                 PaperProps={{
                    style: {
                        width: '400px', 
                        maxHeight: '200px',
                    },
                }}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this company?
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Delete
                    </Button>
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

export default Companies;
