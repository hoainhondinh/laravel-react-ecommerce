import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorMessageProps {
  message: string;
  linkText?: string;
  linkPath?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
                                                     message,
                                                     linkText = 'Back to Blog',
                                                     linkPath = '/blog'
                                                   }) => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-600">Error</h2>
      <p className="mt-4 text-gray-700">{message}</p>
      <Link to={linkPath} className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md">
        {linkText}
      </Link>
    </div>
  );
};

export default ErrorMessage;
