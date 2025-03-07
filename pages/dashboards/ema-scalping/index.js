import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import DashboardExistingBrokersContent from '../../../src/content/DashboardPages/existing-brokers/index';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
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
import Footer from 'src/components/Footer'


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
  const [chartData, setChartData] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY");

  const fetchChartData = async (symbol) => {
    try {
      const response = await axios.get(
        `${baseUrl}paper_trade/getchart/?symbol=${symbol}`,
        { timeout: 10000 }
      );
      console.log("Chart Data:", response.data);

      if (!response.data || response.data.length === 0) {
        console.error("No data received from API");
        return;
      }

      const prices = response.data.flatMap(item => [item.Open, item.High, item.Low, item.Close]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      setChartData({
        series: [
          {
            name: "Candlestick",
            type: "candlestick",
            data: response.data.map((item, index) => ({
              x: index + 1, 
              y: [
                parseFloat(item.Open).toFixed(2), 
                parseFloat(item.High).toFixed(2), 
                parseFloat(item.Low).toFixed(2), 
                parseFloat(item.Close).toFixed(2)
              ],
              
              meta: { timestamp: new Date(item.timestamp)},
            })),
          },
          {
            name: "EMA-9",
            type: "line",
            data: response.data.map((item, index) => ({
              x: index + 1, // Use index for x-axis
              y: parseFloat(item.ema_9).toFixed(2) || null,
            })),
            color: "#00FF00",
          },
          {
            name: "EMA-15",
            type: "line",
            data: response.data.map((item, index) => ({
              x: index + 1, // Use index for x-axis
              y: parseFloat(item.ema_15).toFixed(2) || null,
            })),
            color: "#FF0000",
          },
        ],
        options: {
          stroke: {
            width: [1, 2], // First for Candlestick, Second for EMA-15 (adjust as needed)
          },
          chart: {
            type: "candlestick",
            height: 350,
          },
          title: {
            text: "CandleStick Chart",
            align: "left",
          },
          xaxis: {
            type: "category", // Use category for numerical indexing
            labels: {
              show:false,
            },
          },
          yaxis: {
            tooltip: { enabled: true },
            labels: { style: { colors: "white" } },
            min: minPrice * 0.995,
            max: maxPrice * 1.005,
          },
          tooltip: {
            enabled: true,
            shared: true,
            custom: function ({ seriesIndex, dataPointIndex, w }) {
              let seriesData = w.config.series[seriesIndex].data[dataPointIndex]; 
              if (!seriesData || !seriesData.y) return ''; 
          
              let ohlc = seriesData.y;
              let apiTimestamp = seriesData.meta?.timestamp || "N/A";
              if (apiTimestamp !== "N/A") {
                let dateObj = new Date(apiTimestamp);
                let formattedDate = dateObj.toLocaleString("en-GB", {
                  weekday: "short", // Fri
                  day: "2-digit",   // 24
                  month: "2-digit", // 12
                  year: "2-digit",  // 26
                  hour: "2-digit",  // 15
                  minute: "2-digit" // 00
                }).replace(",", ""); // Remove the comma between date and time
              
                apiTimestamp = formattedDate;
              }
          
              return `
                <div style="padding: 8px; background: #000; color: #fff; border-radius: 5px;">
                  <strong>OHLC Data</strong><br/>
                  Open: ${ohlc[0]}<br/>
                  High: ${ohlc[1]}<br/>
                  Low: ${ohlc[2]}<br/>
                  Close: ${ohlc[3]}<br/>
                  <strong>DateTime:</strong> ${apiTimestamp}
                </div>
              `;
            },
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#00FF00",
                downward: "#FF0000",
              },
            },
          },
        },
      });
      

    } catch (error) {
      showToast('Error fetching chart data', "error")
      console.error("Error fetching chart data:", error);
    }
  };
  const [orderData, setOrderData] = useState([])
  const fetchOrder = async () => {
    axios
      .get(`${baseUrl}paper_trade/getorder?symbol=${selectedSymbol}&date=${selectedDate}`,)
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

useEffect(() => {
    fetchChartData(selectedSymbol);
    fetchOrder();
  }, [selectedSymbol, selectedDate]);

  const handleDateChange = (event) => {
    const dateString = event.target.value; 
      console.log(dateString);
      setSelectedDate(dateString);
    
  };
  const handleRefesh = () => {
    fetchChartData(selectedSymbol)
    fetchOrder()
  }

  return (
    <>

      <h1>EMA Scalping</h1>


      {chartData ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="candlestick"
          height={600}
        />
      ) : (
        <p>Loading Chart...</p>
      )}
      <h1 style={{textAlign: 'center' }}>Order List</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

    <Select
      labelId="my-strategies-label"
      value={selectedSymbol}
      onChange={(e) => setSelectedSymbol(e.target.value)}
      displayEmpty
      style={{ minWidth: 200 }}
    >
      <MenuItem value="NIFTY">NIFTY</MenuItem>
      <MenuItem value="BANKNIFTY">BANKNIFTY</MenuItem>
      <MenuItem value="SENSEX">SENSEX</MenuItem>
    </Select>
    <Button onClick={handleRefesh} variant="contained" style={{marginLeft: 6}}>
      Refresh
    </Button>
  </div>
  <CustomDatePicker value={selectedDate} onChange={handleDateChange} />
</div>
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '70vh', overflowY: 'auto' }}>
  <div style={{ flex: 1 }}>

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
            <TableCell>Option Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderData.map((row) => (
            <TableRow key={row.uuid}>
              <TableCell>
                {new Date(row?.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </TableCell>
              <TableCell>{row?.order_type}</TableCell>
              <TableCell>{row?.open_price}</TableCell>
              <TableCell>{row?.close_price}</TableCell>
              <TableCell>{row?.profit}</TableCell>
              <TableCell>{row?.symbol}</TableCell>
              <TableCell>{row?.lots}</TableCell>
              <TableCell>{row?.symbol?.slice(-2)}</TableCell>
              <TableCell>{row?.order_status}</TableCell>
            </TableRow>
          ))}

          {
            orderData.length > 0 ? (  <TableRow>
              <TableCell><strong>Total P/L</strong></TableCell> 
              <TableCell colSpan={3}></TableCell>  
              <TableCell><strong>{orderData.reduce((total, row) => total + (parseFloat(row?.profit) || 0), 0).toFixed(2)}</strong></TableCell> {/* Under "Profit" column */}
              <TableCell colSpan={4}></TableCell>  
            </TableRow>
          ) : (<>
          
          </>)
          }


        </TableBody>
      </Table>
    </TableContainer>
  </div>
  <Footer />
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
