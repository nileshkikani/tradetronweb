import * as Yup from 'yup';

export const positionSchema = Yup.object().shape({
  option_type: Yup.string().required('Option type is required'),
  order_type: Yup.string().required('Order type is required'),
  strike_selection: Yup.string().required('Strike selection is required'),
  value: Yup.string().required('Value is required'),
  expiry: Yup.string().required('Expiry is required'),
  lots: Yup.number().required('Lots are required').min(1, 'At least 1 lot is required'),
});
        

export const combinedSchema = Yup.object().shape({
  strategy_name: Yup.string().required('Strategy name is required'),
  index_name: Yup.string().required('index name is required'),
  capital: Yup.number().required('Capital is required').min(1, 'Capital must be greater than zero'),
  strategy_type: Yup.string().required('Position is required'),
  entry_HH: Yup.number().required("Entry Hour is required"),
  entry_MM: Yup.number().required("Entry Minute is required"),
  positions: Yup.array().of(positionSchema).min(1, 'At least 1 position is required'),
  
  stop_loss_type: Yup.string().required('Stop loss type is required').nullable(),
  stop_loss_value: Yup.number().nullable() 
    .when('stop_loss_type', {
      is: (value) => value !== 'none',
      then: (schema) => schema.required('Stop loss value is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  
  take_profit_type: Yup.string().required('Take profit type is required'),
  take_profit_value: Yup.number().nullable() 
    .when('take_profit_type', {
      is: (value) => value !== 'none',
      then: (schema) => schema.required('Take profit value is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  days: Yup.array().min(1, 'At least 1 day must be selected'),
  do_repeat: Yup.boolean(),
  exit_HH: Yup.number().required('Exit hour is required'),
  exit_MM: Yup.number().required('Exit minute is required'),
});



