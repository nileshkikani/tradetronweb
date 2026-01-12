import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputAdornment,
    Typography,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import useToast from 'src/hooks/useToast';

function Assets() {
    const { showToast } = useToast();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const baseURL = process.env.EMA_SCALPING_URL;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('strategy_name', strategy);
            if (debouncedSearch) {
                params.append('stock_name', debouncedSearch);
            }

            const response = await axios.get(
                `${baseURL}ema-scalping/get-stock-list/?${params.toString()}`
            );

            if (response.data && response.data.data) {
                setAssets(response.data.data);
            } else {
                setAssets([]);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
            showToast('Failed to fetch assets', 'error');
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [strategy, debouncedSearch]);

    const handleStrategyChange = (event) => {
        setStrategy(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    return (
        <>
            <Head>
                <title>Assets - Dashboard</title>
            </Head>
            <PageTitleWrapper>
                <Typography variant="h3" component="h3" gutterBottom>
                    Assets
                </Typography>
            </PageTitleWrapper>
            <Container maxWidth="xl">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader
                                // title="Stock List"
                                action={
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <TextField
                                            size="small"
                                            placeholder="Search stock..."
                                            value={search}
                                            onChange={handleSearchChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{ minWidth: 200 }}
                                        />
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <Select
                                                value={strategy}
                                                onChange={handleStrategyChange}
                                                displayEmpty
                                            >
                                                <MenuItem value="all">All</MenuItem>
                                                <MenuItem value="volume_spike">Volume Spike</MenuItem>
                                                <MenuItem value="breakout">Breakout</MenuItem>
                                                <MenuItem value="order_block">Order Block</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                <TableContainer sx={{ maxHeight: 710 }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Stock List</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell align="center" sx={{ py: 3 }}>
                                                        <CircularProgress size={30} />
                                                    </TableCell>
                                                </TableRow>
                                            ) : assets.length > 0 ? (
                                                assets.map((asset) => (
                                                    <TableRow key={asset.token} hover>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>{asset.symbol}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell align="center" sx={{ py: 3 }}>
                                                        <Typography variant="body1" color="text.secondary">
                                                            No assets found
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

Assets.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Assets;
