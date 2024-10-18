import { useSnackbar } from 'notistack';
import { Slide } from '@mui/material';

const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showToast = (message, variant) => {
        enqueueSnackbar(message, {
            variant,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
        });
    };

    return { showToast };
};

export default useToast;
