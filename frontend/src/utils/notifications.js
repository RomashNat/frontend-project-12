import { toast } from 'react-toastify';


export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    toastId: 'error-toast',
    'data-testid': 'error-toast'
  });
};

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
     toastId: 'error-toast',
    'data-testid': 'error-toast'
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
     toastId: 'error-toast',
    'data-testid': 'error-toast'
  });
};
