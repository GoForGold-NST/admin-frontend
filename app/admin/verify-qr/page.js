'use client'
import { useState, useEffect } from 'react'
import { adminApi } from '@/app/utils/api'

export default function VerifyQRPage() {
  const [qrHash, setQrHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [attendee, setAttendee] = useState(null)
  const [error, setError] = useState(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [facingMode, setFacingMode] = useState("environment")
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false)

  useEffect(() => {
    return () => {
      if (window.html5QrCodeScanner) {
        window.html5QrCodeScanner.clear();
      }
    };
  }, []);

  const startScanner = () => {
    setScannerActive(true);
    
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js";
    script.onload = initScanner;
    document.body.appendChild(script);
  };

  const initScanner = () => {
    if (!window.Html5Qrcode) {
      setError("QR scanner library failed to load");
      setScannerActive(false);
      return;
    }

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    window.html5QrCodeScanner = new window.Html5Qrcode("qr-reader");
    window.html5QrCodeScanner.start(
      { facingMode: facingMode },
      config,
      onScanSuccess,
      onScanFailure
    );
  };

  const stopScanner = () => {
    if (window.html5QrCodeScanner) {
      window.html5QrCodeScanner.stop().then(() => {
        setScannerActive(false);
      }).catch(err => {
        setScannerActive(false);
      });
    } else {
      setScannerActive(false);
    }
  };

  const swapCamera = () => {
    if (window.html5QrCodeScanner) {
      window.html5QrCodeScanner.stop().then(() => {
        const newFacingMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newFacingMode);
        
        setTimeout(() => {
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          window.html5QrCodeScanner.start(
            { facingMode: newFacingMode },
            config,
            onScanSuccess,
            onScanFailure
          );
        }, 100);
      }).catch(err => {
        setError(err)
      });
    }
  };

  const onScanSuccess = (decodedText) => {
    setQrHash(decodedText);
    stopScanner();
    verifyCode(decodedText);
  };

  const onScanFailure = (error) => {
    console.log(`QR scan error: ${error}`);
  };

  const getErrorMessage = (errorData) => {
    console.log('Error data:', errorData);
    
    if (typeof errorData === 'string') {
      return errorData;
    } 
    
    if (typeof errorData === 'object') {
      if (errorData.message) return errorData.message;
      if (errorData.error && typeof errorData.error === 'string') return errorData.error;
      if (errorData.error && errorData.error.message) return errorData.error.message;
    }
    
    return 'An error occurred while verifying the QR code';
  };

  const verifyCode = async (code) => {
    setAttendee(null)
    if (!code) {
      setError('Please enter a QR code hash');
      return;
    }
  
    setLoading(true);
    setError(null);
    setAlreadyCheckedIn(false);
  
    try {
      const response = await adminApi('verify-qr', 'POST', { qrHash: code });
      
      setAttendee(response.attendee);
      setAlreadyCheckedIn(false);
      
    } catch (errorData) {
      
      if (errorData && errorData.error === 'Already checked in' && errorData.attendee) {
        setAttendee(errorData.attendee);
        setAlreadyCheckedIn(true);
      } else {
        setError(typeof errorData === 'string' ? errorData : 
                 (errorData.error && typeof errorData.error === 'string' ? errorData.error : 
                 (errorData.error && errorData.error.error ? errorData.error.error : 
                 'An unknown error occurred')));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    verifyCode(qrHash);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Verify QR Code</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="qrHash" className="block text-sm font-medium text-gray-700">
              QR Code Hash
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="qrHash"
                value={qrHash}
                onChange={(e) => setQrHash(e.target.value)}
                className="block w-full p-4 rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter QR code hash or scan code"
              />
            </div>
          </div>
          
          {error && !alreadyCheckedIn && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            
            {!scannerActive ? (
              <button
                type="button"
                onClick={startScanner}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Scan QR Code
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Stop Scanner
              </button>
            )}
          </div>
        </form>
        
        {scannerActive && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">
                Point camera at QR code
              </div>
              <button
                onClick={swapCamera}
                className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Switch Camera"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            <div id="qr-reader" className="w-full max-w-md mx-auto border rounded-lg overflow-hidden"></div>
          </div>
        )}
      </div>
      
      {attendee && (
        <div className="bg-white p-6 rounded-lg shadow">
          {alreadyCheckedIn ? (
            <div className="rounded-md bg-yellow-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Already Checked In</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    This attendee was previously checked in at: {new Date(attendee.checkedInAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Check-in successful!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Checked in at: {new Date(attendee.checkedInAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendee Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="mt-1 text-sm text-gray-900">{attendee.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-sm text-gray-900">{attendee.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">School</h4>
              <p className="mt-1 text-sm text-gray-900">{attendee.school}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">City</h4>
              <p className="mt-1 text-sm text-gray-900">{attendee.city}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Grade</h4>
              <p className="mt-1 text-sm text-gray-900">{attendee.grade}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
              <p className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  attendee.paymentStatus === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {attendee.paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}