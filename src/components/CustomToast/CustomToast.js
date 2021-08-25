import { toast } from 'react-toastify'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'react-feather'
import { getUrlTx } from 'utils/getUrl'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'

export const SuccessToast = ({ title, message }) => {
  return (
    <>
      <div>
        <div className="flex items-center">
          <CheckCircle color="#28a745" size={20} />
          <span className="ml-2">{title || 'Success'}</span>
        </div>
      </div>
      <div className="mt-2">
        <span>{message}</span>
      </div>
    </>
  )
}

SuccessToast.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any,
}

const ErrorToast = ({ title, message }) => {
  return (
    <>
      <div>
        <div className="flex items-center">
          <XCircle size={20} color="#dc3545" />
          <span className="ml-2">{title || 'Error'}</span>
        </div>
      </div>
      <div className="mt-2">
        <span>{message}</span>
      </div>
    </>
  )
}

ErrorToast.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any,
}

const WarningToast = ({ title, message }) => (
  <>
    <div className="toastify-header">
      <div className="title-wrapper">
        <AlertTriangle size={12} />
        <h6 className="toast-title">{title || 'Warning!'}</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        {message}
      </span>
    </div>
  </>
)

WarningToast.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any,
}

const InfoToast = ({ title, message }) => (
  <>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Info size={12} />
        <h6 className="toast-title">{title || 'Info!'}</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span role="img" aria-label="toast-text">
        {message}
      </span>
    </div>
  </>
)

InfoToast.propTypes = {
  title: PropTypes.any,
  message: PropTypes.any,
}

export function showToastSuccess(title, message) {
  toast.dark(<SuccessToast title={title} message={message} />, {
    hideProgressBar: true,
  })
}

export function showToastTx(txHash) {
  toast.dark(
    <a href={getUrlTx(txHash)} target="_blank">
      View transaction
    </a>,
    {
      hideProgressBar: true,
    },
  )
}

export function showToastError(title, message) {
  toast.dark(<ErrorToast title={title} message={message} />, {
    hideProgressBar: true,
  })
}
