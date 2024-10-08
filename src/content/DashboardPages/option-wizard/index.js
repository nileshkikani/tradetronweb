import { useState } from 'react';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import Titlesection from 'src/components/Option-Wizard/TitleSection';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { combinedSchema } from 'src/validation-schema/strategySchema';
import PositionSection from 'src/components/Option-Wizard/Position-Section';
import AddedPositions from 'src/components/Option-Wizard/Added-Positions-Map';
import Exitsection from 'src/components/Option-Wizard/Exit-Section';
import Entrysection from 'src/components/Option-Wizard/Entry-Section';
import {
    Button,
    ListItem,
    FormControl,
    // InputLabel,
    Select,
    MenuItem,
    TextField,
    Box,
} from '@mui/material';

function DashboardOptionWizardContent() {
    const [showForm, setShowForm] = useState(false);
    const [strategyNames, setStrategyName] = useState([]);
    const [selectedStrategyId, setSelectedStrategyId] = useState(null);
    const [initialValues, setInitialValues] = useState({
        strategy_name: '',
        index_name: '',
        capital: 100000,
        strategy_type: '',
        order_take_profit_type: '',
        order_stop_loss_type: '',
        positions: [],
        start_time: '',
        days: [],
        exit_time: '',
        take_profit_type: 'none',
        take_profit_value: '',
        stop_loss_value: '',
        stop_loss_type: 'none',
        do_repeat: false,
    });


    const handleOnSubmit = async (values) => {
        const start_time = values.entry_HH && values.entry_MM
            ? `${values.entry_HH}:${values.entry_MM}`
            : null;

        const exit_time = values.exit_HH && values.exit_MM
            ? `${values.exit_HH}:${values.exit_MM}`
            : null;

        const formData = {
            strategy_name: values.strategy_name || null,
            index_name: values.index_name || null,
            capital: values.capital || null,
            strategy_type: values.strategy_type || null,
            order_take_profit_type: values.order_take_profit_type || null,
            order_stop_loss_type: values.order_stop_loss_type || null,
            positions: values.positions.map(position => ({
                ...position,
                order_take_profit_value: position.order_take_profit_value || null,
                order_stop_loss_value: position.order_stop_loss_value || null,
            })),
            start_time: start_time || null,
            days: values.days || null,
            do_repeat: values.do_repeat || false,
            exit_time: exit_time || null,
            take_profit_type: values.take_profit_type === 'none' ? null : values.take_profit_type,
            stop_loss_type: values.stop_loss_type === 'none' ? null : values.stop_loss_type,
            take_profit_value: values.take_profit_value === 'none' ?null : values.take_profit_value,
            stop_loss_value: values.stop_loss_value || null
        };

        console.log('final', formData);

        try {
            const apiCall = selectedStrategyId
                ? axiosInstance.patch(API_ROUTER.STRATEGY_UPDATE(selectedStrategyId), formData,{
                    headers: { Authorization: `Bearer ${authState}` }
                })
                : axiosInstance.post(API_ROUTER.STRATEGY_CREATE, formData,{
                    headers: { Authorization: `Bearer ${authState}` }
                });
            await toast.promise(
                apiCall,
                {
                    pending: selectedStrategyId ? TOAST_ALERTS.STRATEGY_UPDATING : TOAST_ALERTS.STRATEGY_SAVING,
                    success: <b>{selectedStrategyId ? TOAST_ALERTS.STRATEGY_UPDATED : TOAST_ALERTS.STRATEGY_SAVED}</b>,
                    error: <b>{TOAST_ALERTS.GENERAL_ERROR}</b>,
                }
            );
            // location.reload();
            getStrategyList();

            if (selectedStrategyId) {
                setShowForm(false);
                setSelectedStrategy('')
            }
            
        } catch (error) {
            toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR);
        }
    };

    return (
        <>
            <PageTitleWrapper>
                <h1>Option Wizard</h1>
            </PageTitleWrapper>
            <Titlesection setShowForm={setShowForm} />
            {showForm && (
                <Formik
                    initialValues={initialValues}
                    validationSchema={combinedSchema}
                    onSubmit={handleOnSubmit}
                    enableReinitialize
                >
                    {({ values, handleChange, touched, errors }) => (
                        <Form method="post" className='formik'>
                            <ListItem className='section2'>
                                <Box
                                    display="flex"
                                    justifyContent="space-evenly"
                                    alignItems="center"
                                    width="100%" // Ensures the Box takes full width
                                >
                                    <Box className='dropdown-container'>
                                        <TextField
                                            label="Strategy"
                                            variant="outlined"
                                            name="strategy_name"
                                            error={touched.strategy_name && Boolean(errors.strategy_name)}
                                            helperText={touched.strategy_name && <ErrorMessage name="strategy_name" component="span" className="error" />}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                    <Box className='dropdown-container'>
                                        <FormControl
                                            fullWidth
                                            error={touched.index_name && Boolean(errors.index_name)}
                                        >
                                            <Field
                                                as={Select}
                                                name="index_name"
                                                label="Select Index"
                                                value={values.index_name}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="" disabled>Select Index</MenuItem>
                                                <MenuItem value="BANKNIFTY">NIFTY BANK</MenuItem>
                                                <MenuItem value="NIFTY">NIFTY 50</MenuItem>
                                                <MenuItem value="FINNIFTY">NIFTY FIN SERVICE</MenuItem>
                                                <MenuItem value="MIDCPNIFTY">NIFTY MID SELECT</MenuItem>
                                                <MenuItem value="CRUDEOIL">CRUDE OIL</MenuItem>
                                                <MenuItem value="CRUDEOILM">CRUDE OIL MINI</MenuItem>
                                            </Field>
                                            <ErrorMessage name="index_name" component="span" className="error" />
                                        </FormControl>
                                    </Box>


                                    <Box className='dropdown-container'>
                                        <TextField
                                            label="Capital"
                                            variant="outlined"
                                            name="capital"
                                            value={100000}
                                            type="number"
                                            disabled={!values.index_name}
                                            error={touched.capital && Boolean(errors.capital)}
                                            helperText={touched.capital && <ErrorMessage name="capital" component="span" className="error" />}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                    <Box className='dropdown-container'>
                                        <FormControl error={touched.strategy_type && Boolean(errors.strategy_type)}>
                                            <Field
                                                as={Select}
                                                labelId="strategy-type-label"
                                                name="strategy_type"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="" disabled>Select Type</MenuItem>
                                                <MenuItem value="INTRADAY">Intraday</MenuItem>
                                                <MenuItem value="positional" disabled>Positional</MenuItem>
                                            </Field>
                                            <ErrorMessage name="strategy_type" component="span" className="error" />
                                        </FormControl>
                                    </Box>
                                </Box>
                            </ListItem>


                            {/*------------ Positions Section---------- */}
                            <Box className='positions-section'
                                border={2}
                                sx={{
                                    borderColor: 'primary.main',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    margin: '16px',
                                }}
                            >
                                <h1 className='titles'>Positions</h1>
                                <FieldArray name="positions">
                                    {({ push, remove }) => (
                                        <>
                                            <PositionSection push={push} />
                                            <hr className='position-line' />
                                            <Box
                                                className='individual'
                                                display="flex"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                                gap={2}
                                            >
                                                <Box className='dropdown-container' >
                                                    <label>Target</label>
                                                    <FormControl fullWidth className='target' error={touched.order_take_profit_type && Boolean(errors.order_take_profit_type)}>
                                                        <Field as={Select} labelId="target-label" name="order_take_profit_type" onChange={handleChange}>
                                                            <MenuItem value="" disabled>Select Target</MenuItem>
                                                            <MenuItem value="percentage_entry">% Entry Price</MenuItem>
                                                            <MenuItem value="amount">Points</MenuItem>
                                                        </Field>
                                                        <ErrorMessage name="order_take_profit_type" component="span" className="error" />
                                                    </FormControl>
                                                </Box>
                                                <Box className='dropdown-container'>
                                                    <label>SL</label>
                                                    <FormControl fullWidth className='sl' error={touched.order_stop_loss_type && Boolean(errors.order_stop_loss_type)}>
                                                        <Field as={Select} labelId="sl-label" name="order_stop_loss_type" onChange={handleChange}>
                                                            <MenuItem value="" disabled>Select StopLoss</MenuItem>
                                                            <MenuItem value="percentage_entry">% Entry Price</MenuItem>
                                                            <MenuItem value="amount">Points</MenuItem>
                                                        </Field>
                                                        <ErrorMessage name="order_stop_loss_type" component="span" className="error" />
                                                    </FormControl>
                                                </Box>
                                            </Box>
                                            {values.positions && values.positions.map((position, index) => (
                                                <AddedPositions key={index} position={position} index={index} remove={remove} />
                                            ))}
                                            <ErrorMessage name="positions" component="span" className="error" />
                                        </>
                                    )}
                                </FieldArray>
                            </Box>
                            <Entrysection />
                            <Exitsection />
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ marginTop: 2 }}>
                                <Button
                                    type='submit'
                                    variant="contained"
                                    color="primary"
                                    className='save-btn'
                                    sx={{
                                        marginBottom: 2,
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        fontSize: '16px',
                                        boxShadow: 2,
                                        transition: '0.3s',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                >
                                    {selectedStrategyId ? 'Update' : 'Save'}
                                </Button>

                                {selectedStrategyId && (
                                    <Box sx={{ marginTop: 1 }}>
                                        <Button
                                            type='button'
                                            variant="outlined"
                                            color="error"
                                            className='delete-btn'
                                            onClick={() => handleDeleteStrategy(selectedStrategyId)}
                                            sx={{
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                                fontSize: '16px',
                                                boxShadow: 1,
                                                transition: '0.3s',
                                                '&:hover': {
                                                    backgroundColor: 'error.main',
                                                    color: 'white',
                                                }
                                            }}
                                        >
                                            Delete Strategy
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                        </Form>
                    )}
                </Formik>
            )}
            <Footer />
        </>
    );
}

DashboardOptionWizardContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardOptionWizardContent;
