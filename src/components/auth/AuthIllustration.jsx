import React from 'react';
import { FiShoppingCart, FiUser, FiPackage, FiShield, FiCreditCard } from 'react-icons/fi';

// Static illustration component that replaces the animated canvas version
const AuthIllustration = ({ type = 'signin' }) => {
  // Colors based on auth type
  const primaryColor = type === 'signin' ? 'text-indigo-600' : 'text-emerald-600';
  const secondaryColor = type === 'signin' ? 'text-indigo-400' : 'text-emerald-400';
  const bgColor = type === 'signin' ? 'from-indigo-50 to-purple-50' : 'from-emerald-50 to-indigo-50';

  return (
    <div className={`w-full h-full rounded-lg bg-gradient-to-br ${bgColor} flex flex-col items-center justify-center p-8`}>
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold ${primaryColor} mb-2`}>
          {type === 'signin' ? 'Welcome Back' : 'Join Our Community'}
        </h3>
        <p className="text-gray-600">
          {type === 'signin'
            ? 'Sign in to access your account and continue shopping'
            : 'Create an account to start shopping and track your orders'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FiShoppingCart className={`w-8 h-8 ${primaryColor} mb-2`} />
          <span className="text-sm text-gray-600">Shop Products</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FiUser className={`w-8 h-8 ${secondaryColor} mb-2`} />
          <span className="text-sm text-gray-600">Manage Profile</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FiPackage className={`w-8 h-8 ${primaryColor} mb-2`} />
          <span className="text-sm text-gray-600">Track Orders</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FiShield className={`w-8 h-8 ${secondaryColor} mb-2`} />
          <span className="text-sm text-gray-600">Secure Checkout</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className={`${primaryColor} font-medium`}>
          {type === 'signin'
            ? 'Secure login with encrypted connection'
            : 'Fast and secure registration process'}
        </p>
      </div>
    </div>
  );
};

export default AuthIllustration;
