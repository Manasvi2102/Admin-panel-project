import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center space-x-2">
      <FiAlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;

