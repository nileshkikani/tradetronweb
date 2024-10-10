import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

const CustomModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  console.log('order', order)

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Order Type</TableCell>
              <TableCell>Open Price</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Close Price</TableCell>
              <TableCell>Profit</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Open Date/Time</TableCell>
              <TableCell>Close Date/Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {order.map((orderData) => (
              <TableRow key={orderData.id}>
                <TableCell>{orderData.symbol}</TableCell>
                <TableCell>{orderData.order_type}</TableCell>
                <TableCell>{orderData.open_price}</TableCell>
                <TableCell>{orderData.comment}</TableCell>
                <TableCell>{orderData.close_price}</TableCell>
                <TableCell>{orderData.profit}</TableCell>
                <TableCell>{orderData.order_status}</TableCell>
                <TableCell>
                  {new Date(orderData.created_at).toLocaleString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </TableCell>
                <TableCell>
                  {orderData.order_status === "OPEN"
                    ? "N/A"
                    : new Date(orderData.updated_at).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
