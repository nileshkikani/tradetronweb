import { Authenticated } from "src/components/Authenticated";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import useToast from 'src/hooks/useToast';

function myStrategies() {
    const baseUrl = process.env.EMA_SCALPING_URL;
    const [strategies, setStrategies] = useState([]);
    const { showToast } = useToast();

    const fetchStrategies = async () => {
        axios
            .get(`${baseUrl}ema-scalping/get-my-strategies/`)
            .then((res) => {
                if (res?.data.length === 0) {
                    showToast("No strategies found", "info");
                    return;
                }
                setStrategies(res?.data);
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {strategies.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: "rgba(0, 0, 0, 0.01)",
                                    },
                                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                                    transition: "background-color 0.2s",
                                }}
                            >

                                <TableCell>{row?.strategy_name}</TableCell>
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
