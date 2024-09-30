'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';


const Page = () => {
    const [isOpen, setIsOpen] = useState(false);

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted');
    }

    const data = [
        {
            date: '2024-09-16',
            time: '10:00 AM',
            condition: 'New',
            instrument: 'INFY',
            quantity: 10,
            price: 150.00,
            amount: 1500.00,
            action: 'Buy',
        },
        {
            date: '2024-09-16',
            time: '10:30 AM',
            condition: 'Existing',
            instrument: 'WIPRO',
            quantity: 5,
            price: 2800.00,
            amount: 14000.00,
            action: 'Sell',
        }
    ];

    return (
        <>
            <div>
                <button onClick={openModal} className="open-modal-btn">Open Modal</button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="modal"
                overlayClassName="overlay"
                style={customStyles}
            >
                <div className="modal-content">
                    <button
                        onClick={closeModal}
                        className="modal-close-btn"
                        aria-label="Close"
                    >
                        <FaTimes size={24} />
                    </button>
                    <h2 className="modal-title">Table in Modal</h2>
                    <form onSubmit={handleSubmit} className='modal-form'>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Condition</th>
                                    <th>Instrument</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.time}</td>
                                        <td>{item.condition}</td>
                                        <td>{item.instrument}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price.toFixed(2)}</td>
                                        <td>{item.amount.toFixed(2)}</td>
                                        <td>{item.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type="submit"
                            className="modal-submit-btn"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </Modal>
        </>
    );
}

export default Page;
