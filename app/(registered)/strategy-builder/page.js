'use client'
import React, { useEffect, useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './style.css';
import { API_ROUTER } from '@/services/routes';
import axiosInstance from '@/utils/axios';
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import useToaster from '@/hooks/useToaster';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: 0,
  minWidth: 0,
  width: 40,
  height: 40,
  borderRadius: 5,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 70,
  height: 40,
  '& .MuiInputBase-input': {
    textAlign: 'center',
    height: '100%',
    padding: 0,
  },
  '& .MuiInputBase-root': {
    height: '100%',
  },
}));

const OptionChainHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const OptionChainContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Page = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('bullish');
  const [selectedSymbol, setSelectedSymbol] = useState('BANKNIFTY');
  const [symbols, setSymbols] = useState(['nifty']);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [segment, setSegment] = useState('futures');
  const [orderType, setOrderType] = useState('buy');
  const [lotQuantity, setLotQuantity] = useState(1);
  const [isOptionChainOpen, setIsOptionChainOpen] = useState(false);
  const { toaster } = useToaster();


  // -------------EXPIRY DROPDOWN STATES---------
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [allExpiries, setAllExpiries] = useState([]);

  const handleChange = (event) => {
    setSelectedSymbol(event.target.value);
  };

  const handleStrategyClick = (strategy) => {
    setSelectedStrategy(strategy);
  };

  const handleLotQuantityChange = (operation) => {
    setLotQuantity(prevQuantity => {
      if (operation === 'increment') {
        return prevQuantity + 1;
      }
      if (operation === 'decrement') {
        return prevQuantity > 1 ? prevQuantity - 1 : 1;
      }
      return prevQuantity;
    });
  };

  const toggleOptionChain = () => {
    setIsOptionChainOpen(prev => !prev);
  };


  // ---------------------------SYMBOL CALL--------------------
  const getSymbol = async () => {
    try {
      const { data } = await axiosInstance.get(API_ROUTER.SYMBOLS);
      setSymbols(data?.symbols);
    } catch (error) {
      console.log('error calling symbol', error);
    }
  };

  // --------------------------FUTURES OR OPTION CALL--------------
  const getFuturesOrOptions = async (symbol) => {
    const indexTypes = ['BANKNIFTY', 'FINNIFTY', 'NIFTY', 'MIDCPNIFTY', 'NIFTYNXT50'];
    try {
      const stockTypeValue = indexTypes.includes(symbol) ? 'index' : 'stock';

      const endpoint = segment === 'futures'
        ? `${API_ROUTER.OPTIONS_OR_FUTURES}get-future-expiry/`
        : `${API_ROUTER.OPTIONS_OR_FUTURES}get-option-expiry/`;

      const params = {
        stock_type: stockTypeValue,
        symbol: symbol
      };

      const { data } = await axiosInstance.get(endpoint, { params });
      setAllExpiries(data?.expiry_dates);

    } catch (error) {
      toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
    }
  };

  useEffect(() => {
    getSymbol();
  }, []);


  useEffect(() => {
    getFuturesOrOptions(selectedSymbol);
  }, [selectedSymbol, segment]);

  return (
    <>
      <div>
        <div className='section1 '>
          <div className='dropdown-flexes'>
            <select
              value={selectedSymbol}
              onChange={handleChange}
              className='dropdown'
            >
              {symbols.map((e, index) => (
                <option key={index} value={e}>{e}</option>
              ))}
            </select>
            <p>Select Index/Stocks</p>
          </div>
          <div className='date-picker'>
            <DatePicker
              dateFormat="yyyy-MM-dd"
              onChange={(date) => setSelectedDate(date)}
              selected={selectedDate}
              placeholderText="Select payoff date"
              customInput={<input readOnly />}
              shouldCloseOnSelect
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </div>
        <hr />
        <div className='strategy-div'>
          <div className='btn-div'>
            <button
              className={`btn bullish ${selectedStrategy === 'bullish' ? 'selected' : ''}`}
              onClick={() => handleStrategyClick('bullish')}
            >
              BULLISH
            </button>
            <button
              className={`btn bearish ${selectedStrategy === 'bearish' ? 'selected' : ''}`}
              onClick={() => handleStrategyClick('bearish')}
            >
              BEARISH
            </button>
            <button
              className={`btn non-directional ${selectedStrategy === 'non-directional' ? 'selected' : ''}`}
              onClick={() => handleStrategyClick('non-directional')}
            >
              NON-DIRECTIONAL
            </button>
          </div>
        </div>
        <div className='expiry-and-product-dropdowns'>
          <div className='dropdown-flexes'>
            <select
              value={segment}
              className='dropdown'
              onChange={(e) => {
                const newValue = e.target.value;
                setSegment(newValue);
              }}
            >
              <option value='futures'>Futures</option>
              <option value='options'>Options</option>
            </select>
            <p>Select Segment</p>
          </div>
          <div className='dropdown-flexes'>
            <select
              value={selectedExpiry}
              className='dropdown'
              onChange={(e) => setSelectedExpiry(e.target.value)}
            >
              {allExpiries && allExpiries.map((index, e) => (
                <option key={index} value={e}>{e}</option>)
              )}
            </select>
            <p>Select Expiry</p>
          </div>
        </div>
        <Stack direction="row" alignItems="center" spacing={50}>
          <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <RadioGroup
              aria-label="order-type"
              name="order-type"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              row
            >
              <FormControlLabel value="buy" control={<Radio />} label="Buy" />
              <FormControlLabel value="sell" control={<Radio />} label="Sell" />
            </RadioGroup>
          </FormControl>
          <div>
            <Stack direction="row" alignItems="center" useFlexGap>
              <FormLabel component="legend">Lot Qty.</FormLabel>
              <StyledButton variant="outlined" onClick={() => handleLotQuantityChange('decrement')}>-</StyledButton>
              <StyledTextField
                value={lotQuantity}
                onChange={(e) => setLotQuantity(Number(e.target.value))}
                type="number"
                slotProps={{
                  inputProps: {
                    min: 1
                  }
                }}
              />
              <StyledButton variant="outlined" onClick={() => handleLotQuantityChange('increment')}>+</StyledButton>
            </Stack>
          </div>
          <Button variant="contained">Add Position</Button>
        </Stack>
        <hr />
      </div>
      <div>
        <OptionChainHeader onClick={toggleOptionChain}>
          <div>Option Chain</div>
          <div>
            {isOptionChainOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
          </div>
        </OptionChainHeader>
        {isOptionChainOpen && (
          <OptionChainContent>
            <div>Option chain mapping will be here from API</div>
          </OptionChainContent>
        )}
      </div>
    </>
  );
};

export default Page;
