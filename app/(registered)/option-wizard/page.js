'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useToaster from '@/hooks/useToaster';
import './style.css';
import Entrysection from '@/components/OptionWizard/Entry-Section';
import Exitsection from '@/components/OptionWizard/Exit-Section';
import Titlesection from '@/components/OptionWizard/Title-Section';
import AddedPositions from '@/components/OptionWizard/Added-Positions-Map';
import PositionSection from '@/components/OptionWizard/Position-Section';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import axiosInstance from '@/utils/axios';
import { combinedSchema } from '@/schemas/strategySchema';
import { API_ROUTER } from '@/services/routes';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { TOAST_ALERTS, TOAST_TYPES } from "@/constants/keywords";
import { setAllStrategyIds, setSelectedStrategyId } from "@/redux/reducers/strategySlice";

const Page = () => {
    const [showForm, setShowForm] = useState(false);
    const [strategyNames, setStrategyName] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState("");
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
    const dispatch = useAppDispatch();
    const { toaster } = useToaster();

    const selectedStrategyId = useSelector((state) => state.strategy.selectedStrategyId);
    const authState = useAppSelector((state) => state.auth.authState);

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


    const handleDeleteStrategy = async (id) => {
        try {
            await axiosInstance.delete(API_ROUTER.STRATEGY_UPDATE(id),{
                headers: { Authorization: `Bearer ${authState}` }
            });
            toaster(TOAST_ALERTS.STRATEGY_DELETED_SUCCESS, TOAST_TYPES.SUCCESS)
            // location.reload();
        } catch (error) {
            toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
        }
    };

    const getStrategyList = async () => {
        try {
            const { data } = await axiosInstance.get(API_ROUTER.STRATEGY_LIST,{
                headers: { Authorization: `Bearer ${authState}` }
            });
            const strategies = data?.map((e) => ({
                id: e.id,
                strategy_name: e.strategy_name,
            }));
            setStrategyName(strategies);
        } catch (error) {
            toaster(TOAST_ALERTS.GENERAL_ERROR, TOAST_TYPES.ERROR)
        }
    };

    return (
        <div className='bg min-h-screen'>
            <div className="global-container">
                <Titlesection strategyNames={strategyNames} getStrategyList={getStrategyList} setShowForm={setShowForm} setInitialValues={setInitialValues} setSelectedStrategy={setSelectedStrategy} selectedStrategy={selectedStrategy}/>
                {showForm && (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={combinedSchema}
                        onSubmit={handleOnSubmit}
                        enableReinitialize
                    >
                        {({ values, handleChange, touched, errors }) => (
                            <Form method="post" className='formik'>
                                <section className='section2'>
                                    <div className='dropdown-container'>
                                        <label>Strategy</label>
                                        <Field type='text' name='strategy_name'
                                            className={
                                                touched.strategy_name && errors.strategy_name ? 'redField' : 'border-gray-500'
                                            }
                                        />
                                        <ErrorMessage name="strategy_name" component="span" className="error" />
                                    </div>
                                    <div className='dropdown-container'>
                                        <label>Underlying</label>
                                        <Field className={
                                            touched.index_name && errors.index_name ? 'redField' : 'border-gray-500'
                                        } as="select" name="index_name" value={values.index_name} onChange={handleChange}>
                                            <option value="" disabled>Select Underlying</option>
                                            <option value="BANKNIFTY">NIFTY BANK</option>
                                            <option value="NIFTY">NIFTY 50</option>
                                            <option value="FINNIFTY">NIFTY FIN SERVICE</option>
                                            <option value="MIDCPNIFTY">NIFTY MID SELECT</option>
                                            <option value="CRUDEOIL">CRUDE OIL</option>
                                            <option value="CRUDEOILM">CRUDE OIL MINI</option>
                                        </Field>
                                        <ErrorMessage name="index_name" component="span" className="error" />
                                    </div>
                                    <div className='dropdown-container'>
                                        <label>Capital</label>
                                        <Field
                                            name="capital"
                                            type="number"
                                            disabled={!values.index_name}
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage name="capital" component="div" className="error" />
                                    </div>
                                    <div className='dropdown-container'>
                                        <label>Type</label>
                                        <Field as="select" name="strategy_type" onChange={handleChange} className={
                                            touched.strategy_type && errors.strategy_type ? 'redField' : 'border-gray-500'
                                        }>
                                            <option value="" disabled>Select Type</option>
                                            <option value="INTRADAY">Intraday</option>
                                            <option value="positional" disabled>Positional</option>
                                        </Field>
                                        <ErrorMessage name="strategy_type" component="div" className="error" />
                                    </div>
                                </section>

                                {/*------------ Positions Section---------- */}
                                <section className='positions-section'>
                                    <h1 className='titles'>Positions</h1>
                                    <FieldArray name="positions">
                                        {({ push, remove }) => (
                                            <>
                                                <PositionSection push={push} />
                                                <hr className='position-line' />
                                                <div className='individual'>
                                                    <div className='dropdown-container'>
                                                        <label>Target</label>
                                                        <Field className='target' as="select" name="order_take_profit_type" onChange={handleChange}>
                                                            <option value="" disable>select</option>
                                                            <option value="percentage_entry">% Entry Price</option>
                                                            <option value="amount">Points</option>
                                                        </Field>
                                                    </div>
                                                    <div className='dropdown-container'>
                                                        <label>SL</label>
                                                        <Field className='sl' as="select" name="order_stop_loss_type" onChange={handleChange}>
                                                            <option value="" disable>select</option>
                                                            <option value="percentage_entry">% Entry Price</option>
                                                            <option value="amount">Points</option>
                                                        </Field>
                                                    </div>
                                                </div>
                                                {values.positions.map((position, index) => (
                                                    <AddedPositions key={index} position={position} index={index} remove={remove} />
                                                ))}
                                                <ErrorMessage name="positions" component="span" className="error" />
                                            </>
                                        )}
                                    </FieldArray>
                                </section>
                                <Entrysection />
                                <Exitsection />
                                <div className='save-btn-div flex items-center justify-around'>
                                    <input type='submit' className='save-btn' value={selectedStrategyId ? 'Update' : 'Save'} />
                                    {selectedStrategyId && (

                                        <div className='save-btn-div'>
                                            <button
                                                type='button'
                                                className='delete-btn'
                                                onClick={() => {
                                                    handleDeleteStrategy(selectedStrategyId); // pass id here
                                                }}
                                            >
                                                Delete Strategy
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default Page;
