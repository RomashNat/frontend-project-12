import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppToasts = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={6000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  )
}

export default AppToasts
