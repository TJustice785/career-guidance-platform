import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { FaExclamationTriangle, FaTimes, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EmailVerificationBanner = () => {
  const { currentUser } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  // Don't show if user is verified or banner is dismissed
  if (!currentUser || currentUser.emailVerified || dismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setSending(true);
    try {
      await sendEmailVerification(currentUser);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 border-b border-orange-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1 min-w-0">
            <span className="flex p-2 rounded-lg bg-orange-600">
              <FaExclamationTriangle className="h-5 w-5 text-white" />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="inline">
                Please verify your email address to access all features.
              </span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <button
              onClick={handleResendEmail}
              disabled={sending}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaEnvelope />
                  <span>Resend Email</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-white hover:bg-orange-600 rounded-lg transition"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
