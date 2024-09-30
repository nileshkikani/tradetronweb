'use client'
import React, { useState } from 'react';
import toast from 'react-hot-toast';
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

const Page = () => {
    const [showForm, setShowForm] = useState(false);

    const initialStates = {
        strategy_name: '',
        index_name: '',
        capital: 100000,
        strategy_type: '',
        order_take_profit_type: '',
        order_stop_loss_type: '',
        positions: [],
        order_take_profit_value: '',
        order_stop_loss_value: '',
        entry_HH: '',
        entry_MM: '',
        start_time: '',
        exit_HH: '',
        exit_MM: '',
        stop_loss_type: 'none',
        stop_loss_value: '',
        days: [],
        do_repeat: false,
        exit_time: '',
        take_profit_type: 'none',
        take_profit_value: ''
    }

    const handleOnSubmit = async (values) => {
        const formData = {
            strategy_name: values.strategy_name || null,
            index_name: values.index_name || null,
            capital: values.capital || null,
            strategy_type: values.strategy_type || null,
            order_take_profit_type:values.order_take_profit_type || null,
            order_stop_loss_type:values.order_stop_loss_type || null,
            positions: values.positions.map(position => ({
                ...position,
                order_take_profit_value: position.order_take_profit_value || null,
                order_stop_loss_value: position.order_stop_loss_value || null,
            })),
            start_time: values.start_time || null,
            days: values.days || null,
            do_repeat: values.do_repeat || false,
            exit_time: values.exit_time || null,
            take_profit_type: values.take_profit_type === 'none' ? null : values.take_profit_type,
            stop_loss_type: values.stop_loss_type === 'none' ? null : values.stop_loss_type,
            take_profit_value:values.take_profit_value || null,
            stop_loss_value:values.stop_loss_value || null
        };

        console.log('final', formData);
        try {
            await toast.promise(
                axiosInstance.post(API_ROUTER.CREATE_STRATEGY, formData),
                {
                    pending: 'Saving Strategy...',
                    success: <b>Saved Successfully!</b>,
                    error: <b>Failed to save. Please try again.</b>,
                }
            );
        } catch (error) {
            toast.error('Error occurred while saving strategy');
            console.error('Error in API call:', error);
        }
    };

    return (
        <div className='bg'>
            <div className="global-container">
                <Titlesection setShowForm={setShowForm} />
                {showForm && (
                    <Formik
                        initialValues={initialStates}
                        validationSchema={combinedSchema}
                        onSubmit={handleOnSubmit}
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
                                        <ErrorMessage name="strategy_name" component="span" className="error"
                                        />
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
                                        } >
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
                                                <label>Target</label>
                                                <Field className='target' as="select" name="order_take_profit_type" onChange={handleChange} >
                                                    <option value="" disable>select</option>
                                                    <option value="percentage_entry">% Entry Price</option>
                                                    <option value="amount">Points</option>
                                                </Field>
                                                <label>SL</label>
                                                <Field className='sl' as="select" name="order_stop_loss_type" onChange={handleChange} >
                                                    <option value="" disable>select</option>
                                                    <option value="percentage_entry">% Entry Price</option>
                                                    <option value="amount">Points</option>
                                                </Field>
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
                                <div className='save-btn-div'>
                                    <input type='submit' className='save-btn' value='Save' />
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
