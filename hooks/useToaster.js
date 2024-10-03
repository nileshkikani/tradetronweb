import { toast } from 'react-hot-toast';

const useToaster = () => {
  // VARIANT success, info, error, warn
  const toaster = (message, variant) => {
    toast[variant](message);
  };

  return { toaster };
};

export default useToaster;
