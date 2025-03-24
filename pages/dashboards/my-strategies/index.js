// import { Authenticated } from 'src/components/Authenticated';
// import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
// import PageTitleWrapper from 'src/components/PageTitleWrapper';
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TextField from "@mui/material/TextField"
// import { useState, useEffect } from 'react';
// import axios from "axios";
// import { Button, ListItem, Select, MenuItem } from "@mui/material"

// function myStrategies() {
//     const baseUrl = process.env.EMA_SCALPING_URL
//     const [strategies, setStrategies] = useState([])
//     const [editMode, setEditMode] = useState({})
//     const [editedRow, setEditedRow] = useState({});
//     const handleEditMode = (rowId) => {
//       console.log("Editing Row ID:", rowId);
//       setEditMode((prev) => (prev === rowId ? null : rowId)); // Fixes infinite re-renders
//     };
//     const handleChange = (e) => {
//       const { name, value } = e.target;
  
//       let newValue = value;
    
//       if (name === "no_of_strikes") {
//         newValue = Math.min(Number(value), 20);  // ✅ Limit the value to 20
//       }
    
//       setEditedRow((prev) => ({
//         ...prev,
//         [name]: newValue,  
//       }));
  
      
      
//     };
//     useEffect(() => {
//       console.log("Updated row:", editedRow);
//     }, [editedRow]);
    

//     const fetchStrategies = async () => {
//         axios
//           .get(`${baseUrl}paper_trade/strategy-list/`,)
//           .then((res) => {
//             if (res?.data.length === 0) {
//               showToast("No orders found", "info");
//               return;
//             }
//             setStrategies(res?.data);
            
//           })
//           .catch((error) => {
//             showToast(error?.response?.data?.error || "Something went wrong", "error");
//             console.log(error?.response?.data?.error || error.message);
//           });
//       };

//       useEffect(() => {
//         fetchStrategies()
//       }, []);
//     return (
//         <>
//             <PageTitleWrapper>
//                 <h1>My EMA Strategies</h1>
//             </PageTitleWrapper>
//     <TableContainer>
//   <Table sx={{ minWidth: 650 }} aria-label="simple table">
//     <TableHead>
//       <TableRow>
//         <TableCell>Strategy Name</TableCell>
//         <TableCell>Order Type</TableCell>
//         <TableCell>Strike Selection</TableCell>
//         <TableCell>No. Of Strikes</TableCell>
//         <TableCell>Indexes</TableCell>
//         <TableCell>Action</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {strategies.map((row) => (
//         <TableRow key={row.id}>
//           <TableCell>
//             {editMode === row.id ? (
//               <TextField name="strategy_name" value={editedRow.strategy_name || row.strategy_name} onChange={handleChange} size="small" />
//             ) : (
//               row.strategy_name
//             )}
//           </TableCell>
//           <TableCell>
//           {editMode === row.id ? (
//               <Select name="order_type" value={editedRow.order_type || row.order_type} onChange={handleChange} size="small">
//                 <MenuItem value="BUY">BUY</MenuItem>
//                 <MenuItem value="SELL">SELL</MenuItem>
//               </Select>
//             ) : (
//               row.order_type
//             )}
//             </TableCell>
//           <TableCell>
//           {editMode === row.id ? (
//               <Select name="strike_selection" value={editedRow.strike_selection || row.strike_selection} onChange={handleChange} size="small">
//                 <MenuItem value="ITM">ITM</MenuItem>
//                 <MenuItem value="OTM">OTM</MenuItem>
//                 <MenuItem value="ATM">ATM</MenuItem>
//               </Select>
//             ) : (
//               row?.strike_selection
//             )}
            
//             </TableCell>
//           <TableCell>{editMode === row.id ? (
//           <TextField
//             name="no_of_strikes"
//             value={editedRow.no_of_strikes || row.no_of_strikes}
//             onChange={handleChange}
//             size="small"
//             type="number"
//             inputProps={{ min: 0, max: 20 }} 
            
//           />
//         ) : (
//           row.no_of_strikes
//         )}</TableCell>
//           <TableCell><TableCell>
//   {editMode === row.id ? (
//     <Select
//       name="indexes"
//       multiple
//       value={editedRow.indexes ?? row.indexes ?? []}
//       onChange={handleChange}
//       size="small"
//       renderValue={(selected) => selected.join(", ")}
//     >
//       <MenuItem value="NIFTY">NIFTY</MenuItem>
//       <MenuItem value="BANKNIFTY">BANKNIFTY</MenuItem>
//       <MenuItem value="SENSEX">SENSEX</MenuItem>
//     </Select>
//   ) : (
//     row.indexes?.join(", ")
//   )}

// </TableCell></TableCell> {/* Convert array to string */}
//           <TableCell>  
//             {
//               editMode === row.id ? (<>
//                 <Button onClick={() => handleEditMode(row.id)}>Save</Button>
//                 <Button onClick={() => setEditMode(null)}>Cancle</Button>
//                 </>
//               ) :( <Button onClick={() => handleEditMode(row.id)}>Edit</Button>)
//             }
//               </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

//         </>
//     );
// }

// myStrategies.getLayout = (page) => (
//     <Authenticated>
//       <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
//     </Authenticated>
//   );
  

// export default myStrategies;
