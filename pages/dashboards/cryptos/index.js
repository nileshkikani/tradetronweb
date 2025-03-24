import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import { Button, ListItem, Select, MenuItem } from "@mui/material"
import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import useToast from 'src/hooks/useToast';
import CustomDatePicker from 'src/components/DatePicker'
import MarketTrendCard from 'src/components/MarketTrendCard'


const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
function DashboardReports() {
  const baseUrl = process.env.EMA_SCALPING_URL
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); 
    const day = String(today.getDate()).padStart(2, "0"); 
    return `${year}-${month}-${day}`;
  };
  const {showToast} = useToast()
  const [selectedDate, setSelectedDate] = useState(getTodayDate)
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSD");


  const [orderData, setOrderData] = useState([])
  const fetchOrder = async () => {
    axios
      .get(`${baseUrl}crypto_trade/getorder?symbol=${selectedSymbol}&date=${selectedDate}`,)
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No orders found", "info");
          setOrderData([])
          return;
        }
        setOrderData(res.data);
      })
      .catch((error) => {
        showToast(error?.response?.data?.error || "Something went wrong", "error");
        console.log(error?.response?.data?.error || error.message);
      });
  };

const [marketTrend, setMarketTrend] = useState([])

const fetchMarketTrend = async () => {
  axios
      .get(`${baseUrl}paper_trade/getmarket?symbol=${selectedSymbol}`,)
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No orders found", "info");
          setOrderData([])
          return;
        }
        setMarketTrend(res.data);
        console.log(res.data);
        
      })
      .catch((error) => {
        showToast(error?.response?.data?.error || "Something went wrong", "error");
        console.log(error?.response?.data?.error || error.message);
      });

}



useEffect(() => {;
    fetchOrder();
    fetchMarketTrend()
  }, [selectedSymbol, selectedDate]);

  const handleDateChange = (event) => {
    const dateString = event.target.value; 
      console.log(dateString);
      setSelectedDate(dateString);
    
  };
  const handleRefesh = () => {
    fetchOrder()
    fetchMarketTrend()
  }

  return (
    <>

      <h1>Crypto Orders </h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

    <Select
      labelId="my-strategies-label"
      value={selectedSymbol}
      onChange={(e) => setSelectedSymbol(e.target.value)}
      displayEmpty
      style={{ minWidth: 200 }}
    >
      <MenuItem value="BTCUSD">BTCUSD</MenuItem>
      <MenuItem value="ETHUSD">ETHUSD</MenuItem>
    </Select>
    <Button onClick={handleRefesh} variant="contained" style={{marginLeft: 6}}>
      Refresh
    </Button>
  </div>
  <CustomDatePicker value={selectedDate} onChange={handleDateChange} />
</div>
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '70vh', overflow: 'hidden', paddingTop: '10px' }}>
<MarketTrendCard marketData={marketTrend}></MarketTrendCard>
  <div style={{ flexGrow: 1, overflow: 'auto' }}>
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Time</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Entry Price</TableCell>
            <TableCell>Close Price</TableCell>
            <TableCell>Profit</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Lot Size</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Strategy Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => (
            <TableRow key={row.uuid}>
              <TableCell>
                {new Date(row?.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </TableCell>
              <TableCell>{row?.order_type}</TableCell>
              <TableCell>{row?.entry_price}</TableCell>
              <TableCell>{row?.close_price}</TableCell>
              <TableCell>{row?.profit}</TableCell>
              <TableCell>{row?.symbol}</TableCell>
              <TableCell>{row?.lot_size}</TableCell>
              <TableCell>{row?.order_status}</TableCell>
              <TableCell>{row?.strategy_name}</TableCell>
            </TableRow>
          ))}

          {orderData.length > 0 && (
            <TableRow>
              <TableCell><strong>Total P/L</strong></TableCell> 
              <TableCell colSpan={3}></TableCell>  
              <TableCell><strong>{orderData.reduce((total, row) => total + (parseFloat(row?.profit) || 0), 0).toFixed(2)}</strong></TableCell> 
              <TableCell colSpan={4}></TableCell>  
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
</div>
      </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;
