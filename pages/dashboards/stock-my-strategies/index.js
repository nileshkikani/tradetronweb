import { Authenticated } from "src/components/Authenticated";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Box, Checkbox, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "src/utils/axios";
import { Button, ListItem, Select, MenuItem } from "@mui/material";
import TableLoader from "src/components/TableLoader";
import useToast from 'src/hooks/useToast';

function myStrategies() {
    const baseUrl = process.env.EMA_SCALPING_URL;
    const [strategies, setStrategies] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editedRow, setEditedRow] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    // const handleEditMode = (rowId) => {
    //     if (editMode === rowId) {
    //         setEditMode(null);
    //     } else {
    //         const rowToEdit = strategies.find((row) => row.id === rowId);
    //         setEditedRow(rowToEdit); // <-- Set the row data for editing
    //         setEditMode(rowId);
    //     }
    // };

    const { showToast } = useToast();

    // const handleSave = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await axiosInstance.patch(
    //             `${baseUrl}ema-scalping/strategy-update/${parseInt(
    //                 editedRow.id
    //             )}/`, // PATCH to the specific row
    //             editedRow
    //         );
    //         const updatedRow = response.data;
    //         setStrategies((prevData) =>
    //             prevData.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    //         );

    //         setEditMode(null);
    //         setEditedRow(null);
    //     } catch (error) {
    //         console.error("Failed to save:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const handleChange = (e) => {
    //     const { name, type, value, checked } = e.target;

    //     let newValue = type === "checkbox" ? checked : value;

    //     if (name === "no_of_strikes") {
    //         newValue = Math.min(Number(value), 20);
    //     }

    //     setEditedRow((prev) => ({
    //         ...prev,
    //         [name]: newValue,
    //     }));
    // };

    const fetchStrategies = async () => {
        axiosInstance
            .get(`${baseUrl}ema-scalping/strategy-list/`)
            .then((res) => {
                if (res?.data.length === 0) {
                    showToast("No orders found", "info");
                    return;
                }
                setStrategies(res?.data);
                console.log(res?.data);
            })
            .catch((error) => {
                showToast(
                    error?.response?.data?.error || "Something went wrong",
                    "error"
                );
                console.log(error?.response?.data?.error || error.message);
            });
    };

    useEffect(() => {
        fetchStrategies();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <h1 style={{ margin: "24px 0", paddingLeft: "24px" }}>
                    My EMA Strategies
                </h1>
            </PageTitleWrapper>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    margin: "0 16px",
                    width: "calc(100% - 32px)",
                }}
            >
                <Table
                    sx={{
                        minWidth: 650,
                        "& .MuiTableCell-root": {
                            paddingLeft: "24px",
                            paddingRight: "24px",
                        },
                    }}
                    aria-label="strategies table"
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Strategy Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Order Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Strike Selection</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>No. Of Strikes</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Indexes</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>In Market</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {strategies.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "rgba(0, 0, 0, 0.01)",
                                    },
                                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                                    transition: "background-color 0.2s",
                                }}
                            >
                                <TableCell>{row?.strategy_name}</TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <Select
                                            name="order_type"
                                            value={editedRow?.order_type || row.order_type}
                                            // onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                backgroundColor: "background.paper",
                                                maxWidth: "120px",
                                            }}
                                        >
                                            <MenuItem value="BUY">BUY</MenuItem>
                                            <MenuItem value="SELL">SELL</MenuItem>
                                        </Select>
                                    ) : (
                                        <Box
                                            sx={{
                                                color:
                                                    row?.order_type?.toLowerCase() === "buy"
                                                        ? "success.main"
                                                        : "error.main",
                                            }}
                                        >
                                            {row.order_type}
                                        </Box>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <Select
                                            name="strike_selection"
                                            value={editedRow.strike_selection || row.strike_selection}
                                            // onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                backgroundColor: "background.paper",
                                                maxWidth: "120px",
                                            }}
                                        >
                                            <MenuItem value="ITM">ITM</MenuItem>
                                            <MenuItem value="OTM">OTM</MenuItem>
                                            <MenuItem value="ATM">ATM</MenuItem>
                                        </Select>
                                    ) : (
                                        row?.strike_selection
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <TextField
                                            name="no_of_strikes"
                                            value={editedRow.no_of_strikes || row.no_of_strikes}
                                            // onChange={handleChange}
                                            size="small"
                                            type="number"
                                            fullWidth
                                            inputProps={{ min: 0, max: 20 }}
                                            sx={{
                                                backgroundColor: "background.paper",
                                                maxWidth: "100px",
                                            }}
                                        />
                                    ) : (
                                        row.no_of_strikes
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <Select
                                            name="indexes"
                                            multiple
                                            value={editedRow.indexes ?? row.indexes ?? []}
                                            // onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            renderValue={(selected) => selected.join(", ")}
                                            sx={{
                                                backgroundColor: "background.paper",
                                                minWidth: "150px",
                                            }}
                                        >
                                            <MenuItem value="NIFTY">NIFTY</MenuItem>
                                            <MenuItem value="BANKNIFTY">BANKNIFTY</MenuItem>
                                            <MenuItem value="SENSEX">SENSEX</MenuItem>
                                        </Select>
                                    ) : (
                                        row.indexes?.join(", ")
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <Checkbox
                                            name="live_trade"
                                            checked={editedRow?.live_trade ?? row.live_trade}
                                            // onChange={handleChange}
                                            color="primary"
                                        />
                                    ) : row.live_trade ? (
                                        <Checkbox checked color="success" disabled />
                                    ) : (
                                        <Checkbox checked={false} disabled />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editMode === row.id ? (
                                        <>
                                            {isLoading ? (
                                                <TableLoader />
                                            ) : (
                                                <Box sx={{ display: "flex", gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        // onClick={handleSave}
                                                        sx={{
                                                            textTransform: "none",
                                                            fontWeight: 500,
                                                            boxShadow: "none",
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        // onClick={() => setEditMode(null)}
                                                        sx={{
                                                            textTransform: "none",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            // onClick={() => handleEditMode(row.id)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

myStrategies.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default myStrategies;
