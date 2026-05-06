import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container, Grid, Card, CardHeader, CardContent, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box, TextField, Button, Typography, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel,
  IconButton, Tooltip, TablePagination, InputAdornment
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import useToast from 'src/hooks/useToast';
import axiosInstance from 'src/utils/axios';

function PremiumSymbol() {
  const { showToast } = useToast();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  // ATR values keyed by asset id – persisted in localStorage
  const [atrValues, setAtrValues] = useState(() => {
    try {
      const stored = localStorage.getItem('premiumAssetATR');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    premium_range: 0,
    strike_gap: 0,
    top_n: 0,
    lot_size: 0,
    is_active: true
  });
  
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination & Search
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  const baseURL = process.env.EMA_SCALPING_URL;

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${baseURL}premium/symbols/`);
      if (response.data && response.data.data) {
        setAssets(response.data.data);
      } else if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        setAssets(response.data?.symbols || []);
      }
    } catch (error) {
      console.error('Error fetching premium assets:', error);
      showToast('Failed to fetch premium assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const filteredAssets = assets.filter((asset) => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const paginatedAssets = filteredAssets.slice(page * limit, page * limit + limit);

  const openCreateModal = () => {
    setFormData({ id: null, name: '', premium_range: 0, strike_gap: 0, top_n: 0, lot_size: 0, is_active: true });
    setCreateModalOpen(true);
  };

  const openEditModal = (asset) => {
    setFormData({
      id: asset.id,
      name: asset.name,
      premium_range: asset.premium_range,
      strike_gap: asset.strike_gap,
      top_n: asset.top_n,
      lot_size: asset.lot_size || 0,
      is_active: asset.is_active
    });
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateSubmit = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.post(`${baseURL}premium/symbols/`, {
        name: formData.name,
        premium_range: parseFloat(formData.premium_range),
        strike_gap: parseInt(formData.strike_gap, 10),
        top_n: parseInt(formData.top_n, 10),
        lot_size: parseInt(formData.lot_size, 10),
        is_active: formData.is_active
      });
      showToast('Asset created successfully', 'success');
      setCreateModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Create error:', error);
      showToast('Failed to create asset', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.patch(`${baseURL}premium/symbol/update/${formData.id}/`, {
        premium_range: parseFloat(formData.premium_range),
        strike_gap: parseInt(formData.strike_gap, 10),
        top_n: parseInt(formData.top_n, 10),
        lot_size: parseInt(formData.lot_size, 10)
      });
      showToast('Asset updated successfully', 'success');
      setEditModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Edit error:', error);
      showToast('Failed to update asset', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateAll = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.post(`${baseURL}premium/symbols/deactivate/`);
      showToast('All assets deactivated successfully', 'success');
      setDeactivateModalOpen(false);
      fetchAssets();
    } catch (error) {
      console.error('Deactivate error:', error);
      showToast('Failed to deactivate assets', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAtrChange = (name, value) => {
    setAtrValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuickAtrSave = (name, value) => {
    const numericValue = parseFloat(value) || 0;
    setAtrValues((prev) => {
      const next = { ...prev, [name]: numericValue };
      try {
        localStorage.setItem('premiumAssetATR', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving ATR:', e);
      }
      return next;
    });
    showToast(`ATR for ${name} updated to ${numericValue}`, 'success');
  };

  return (
    <>
      <Head>
        <title>Premium Symbol - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 0 }}>
            Premium Symbol
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<WarningTwoToneIcon />}
              onClick={() => setDeactivateModalOpen(true)}
            >
              Deactivate All
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddTwoToneIcon />}
              onClick={openCreateModal}
            >
              Create Asset
            </Button>
          </Box>
        </Box>
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                action={
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Search asset..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(0);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      sx={{ minWidth: 250 }}
                    />
                  </Box>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell>ID</TableCell> */}
                        <TableCell>Name</TableCell>
                        <TableCell>Premium Range</TableCell>
                        <TableCell>Strike Gap</TableCell>
                        <TableCell>Top N</TableCell>
                        <TableCell>Lot Size</TableCell>
                        <TableCell>ATR</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : paginatedAssets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                            <Typography variant="body1" color="text.secondary">
                              No premium assets found.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedAssets.map((asset) => (
                          <TableRow hover key={asset.id || asset.name}>
                            {/* <TableCell>{asset.id}</TableCell> */}
                            <TableCell sx={{ fontWeight: 'bold' }}>{asset.name}</TableCell>
                            <TableCell>{asset.premium_range}</TableCell>
                            <TableCell>{asset.strike_gap}</TableCell>
                            <TableCell>{asset.top_n}</TableCell>
                            <TableCell>{asset.lot_size}</TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                variant="standard"
                                value={atrValues[asset.name] ?? 0}
                                onChange={(e) => handleQuickAtrChange(asset.name, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleQuickAtrSave(asset.name, e.target.value);
                                    e.target.blur();
                                  }
                                }}
                                sx={{ width: 80 }}
                                InputProps={{
                                  disableUnderline: true,
                                  sx: { fontSize: '0.875rem' }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {asset.is_active ? (
                                <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'success.light', color: 'success.dark', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                  Active
                                </Box>
                              ) : (
                                <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 10, bgcolor: 'error.light', color: 'error.dark', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                  Inactive
                                </Box>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Edit" arrow>
                                <IconButton onClick={() => openEditModal(asset)} color="primary">
                                  <EditTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box p={2}>
                  <TablePagination
                    component="div"
                    count={filteredAssets.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Create Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Premium Asset</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Name (e.g. RELIANCE)"
              type="text"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              label="Premium Range"
              type="number"
              inputProps={{ step: "0.1" }}
              fullWidth
              name="premium_range"
              value={formData.premium_range}
              onChange={handleInputChange}
            />
            <TextField
              label="Strike Gap"
              type="number"
              fullWidth
              name="strike_gap"
              value={formData.strike_gap}
              onChange={handleInputChange}
            />
            <TextField
              label="Top N"
              type="number"
              fullWidth
              name="top_n"
              value={formData.top_n}
              onChange={handleInputChange}
            />
            <TextField
              label="Lot Size"
              type="number"
              fullWidth
              name="lot_size"
              value={formData.lot_size}
              onChange={handleInputChange}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active ? "Active" : "Inactive"}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          Update Premium Asset
          <Typography variant="subtitle1" fontWeight="bold" sx={{ ml: 1, color: 'primary.main' }}>
            ({formData.name})
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
            Only Premium Range, Strike Gap, Top N, and Lot Size can be updated.
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Premium Range"
              type="number"
              inputProps={{ step: "0.1" }}
              fullWidth
              name="premium_range"
              value={formData.premium_range}
              onChange={handleInputChange}
            />
            <TextField
              label="Strike Gap"
              type="number"
              fullWidth
              name="strike_gap"
              value={formData.strike_gap}
              onChange={handleInputChange}
            />
            <TextField
              label="Top N"
              type="number"
              fullWidth
              name="top_n"
              value={formData.top_n}
              onChange={handleInputChange}
            />
            <TextField
              label="Lot Size"
              type="number"
              fullWidth
              name="lot_size"
              value={formData.lot_size}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate All Modal */}
      <Dialog open={deactivateModalOpen} onClose={() => setDeactivateModalOpen(false)}>
        <DialogTitle color="error.main">Deactivate All Assets</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to deactivate all premium assets? This action cannot be undone here and will affect all premium operations immediately.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeactivateModalOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDeactivateAll} color="error" variant="contained" disabled={submitting}>
            {submitting ? 'Processing...' : 'Confirm Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PremiumSymbol.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default PremiumSymbol;
