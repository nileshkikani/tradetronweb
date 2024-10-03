import React from 'react';


const CustomModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content" >
        <h2 className="modal-title">Order Details</h2>
        <table className="modal-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Order Type</th>
              <th>Open Price</th>
              <th>Camment</th>
              <th>Close PRice</th>
              <th>Profit</th>
              <th>Order Status</th>
              <th>Open Date/Time</th>
              <th>Close Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(order).map(([key, value]) => {
              // Exclude created_at and updated_at
              if (key === 'created_at' || key === 'updated_at') return null;
              return (
                <tr key={key}>
                  {/* <td>{key.replace(/_/g, ' ').toUpperCase()}</td> */}
                  {/* <td>{value !== null ? value.toString() : 'N/A'}</td> */}
                  <td>{value.symbol}</td>
                  <td>{value.order_type}</td>
                  <td>{value.open_price}</td>
                  <td>{value.comment}</td>
                  <td>{value.close_price}</td>
                  <td>{value.profit}</td>
                  <td>{value.order_status}</td>
                  <td>
                            {new Date(value.created_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </td>
                        <td>
                            {new Date(value.updated_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
};

export default CustomModal;
