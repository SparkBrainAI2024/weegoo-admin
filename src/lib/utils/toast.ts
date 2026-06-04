import { toast } from 'react-toastify';

export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });
};
