// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Loader2, CheckCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
//
// function HomePage() {
//     const navigate = useNavigate();
//
//     const [banks, setBanks] = useState([]);
//     const [selectedBank, setSelectedBank] = useState(null);
//     const [accountNumber, setAccountNumber] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [isLoadingBanks, setIsLoadingBanks] = useState(false);
//     const [isVerifying, setIsVerifying] = useState(false);
//     const [error, setError] = useState('');
//     const [showBankDropdown, setShowBankDropdown] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//
//     const MONO_API_KEY = 'live_sk_z2zqd4k2ayqv9z9t0dqi';
//     //const MONO_API_KEY = 'test_sk_h6nby3di44q76dhb0uha';
//
//     // Fetch banks list when dropdown is opened
//     const fetchBanks = async () => {
//         setIsLoadingBanks(true);
//         setError('');
//
//         try {
//             const response = await fetch('https://api.withmono.com/v3/banks/list', {
//                 method: 'GET',
//                 headers: {
//                     'accept': 'application/json',
//                     'mono-sec-key': MONO_API_KEY
//                 }
//             });
//
//             const data = await response.json();
//
//             if (data && data.data) {
//                 setBanks(data.data);
//             } else {
//                 setError('Failed to load banks. Please try again.');
//             }
//         } catch (err) {
//             console.error('Error fetching banks:', err);
//             setError('Unable to connect to banking service. Please check your internet connection.');
//         } finally {
//             setIsLoadingBanks(false);
//         }
//     };
//
//     // Handle dropdown toggle
//     const handleBankDropdownClick = () => {
//         if (!showBankDropdown && banks.length === 0) {
//             fetchBanks();
//         }
//         setShowBankDropdown(!showBankDropdown);
//     };
//
//     // Filter banks based on search
//     const filteredBanks = banks.filter(bank =>
//         bank.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     // Handle bank selection
//     const handleBankSelect = (bank) => {
//         setSelectedBank(bank);
//         setShowBankDropdown(false);
//         setSearchTerm('');
//         setCustomerName('');
//         setAccountNumber('');
//         setError('');
//     };
//
//     // Verify account number
//     const verifyAccountNumber = async (accNumber, bank) => {
//         setIsVerifying(true);
//         setError('');
//         setCustomerName('');
//
//         try {
//             console.log('Verifying account:', { account_number: accNumber, nip_code: bank.nip_code, bank_name: bank.name });
//
//             const response = await fetch('https://api.withmono.com/v3/lookup/account-number', {
//                 method: 'POST',
//                 headers: {
//                     'accept': 'application/json',
//                     'content-type': 'application/json',
//                     'mono-sec-key': MONO_API_KEY
//                 },
//                 body: JSON.stringify({
//                     nip_code: bank.nip_code,
//                     account_number: accNumber
//                 })
//             });
//
//             console.log('Response status:', response.status);
//             const data = await response.json();
//             console.log('Response data:', data);
//
//             if (response.ok && data) {
//                 // Check if account name exists in the response
//                 // The API returns the name in data.data.name
//                 const accountName = data.data?.name || data.data?.account_name || data.account_name;
//
//                 if (accountName) {
//                     setCustomerName(accountName);
//                     setError('');
//                 } else {
//                     // API returned success but no account name
//                     console.error('No account name in response:', data);
//                     setError('Account verification returned no name. Please check your account details or try a different bank.');
//                     setCustomerName('');
//                 }
//             } else if (response.status === 400) {
//                 // Handle 400 error specifically
//                 const errorMessage = data.message || data.error || 'Invalid account details';
//                 setError(`Verification failed: ${errorMessage}`);
//                 setCustomerName('');
//             } else if (data && data.message) {
//                 setError(data.message);
//                 setCustomerName('');
//             } else {
//                 setError('Account not found. Please verify your account number and bank selection.');
//                 setCustomerName('');
//             }
//         } catch (err) {
//             console.error('Error verifying account:', err);
//             setError('Unable to verify account. Please check your internet connection and try again.');
//             setCustomerName('');
//         } finally {
//             setIsVerifying(false);
//         }
//     };
//
//     // Handle account number input
//     const handleAccountNumberChange = (e) => {
//         const value = e.target.value.replace(/\D/g, ''); // Only allow digits
//         setAccountNumber(value);
//         setError('');
//         setCustomerName('');
//
//         // Trigger verification when 10 digits are entered
//         if (value.length === 10 && selectedBank) {
//             verifyAccountNumber(value, selectedBank);
//         }
//     };
//
//     // Handle continue button
//     const handleContinue = () => {
//         if (!customerName) {
//             setError('Please verify your account details before continuing.');
//             return;
//         }
//
//         // Parse customer name into first, middle, and last names
//         const nameParts = customerName.trim().split(' ');
//         let firstName = '';
//         let middleName = '';
//         let lastName = '';
//
//         if (nameParts.length === 1) {
//             firstName = nameParts[0];
//         } else if (nameParts.length === 2) {
//             firstName = nameParts[0];
//             lastName = nameParts[1];
//         } else if (nameParts.length >= 3) {
//             firstName = nameParts[0];
//             lastName = nameParts[nameParts.length - 1];
//             middleName = nameParts.slice(1, -1).join(' ');
//         }
//
//         // Navigate to agent entry form with pre-filled data
//         navigate('/agent-entry', {
//             state: {
//                 firstName,
//                 middleName,
//                 lastName,
//                 bankName: selectedBank.name,
//                 accountNumber
//             }
//         });
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
//                         Welcome
//                     </h1>
//                     <p className="text-gray-400 text-sm sm:text-base">
//                         Verify your account to get started
//                     </p>
//                 </div>
//
//                 {/* Form */}
//                 <div className="space-y-6">
//                     {/* Bank Selection */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Select Your Bank *
//                         </label>
//                         <div className="relative">
//                             <button
//                                 type="button"
//                                 onClick={handleBankDropdownClick}
//                                 disabled={isVerifying}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-left flex items-center justify-between focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             >
//                 <span className={selectedBank ? 'text-white' : 'text-gray-400'}>
//                   {selectedBank ? selectedBank.name : 'Choose a bank'}
//                 </span>
//                                 {isLoadingBanks ? (
//                                     <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
//                                 ) : (
//                                     <ChevronDown size={20} className="text-gray-400" />
//                                 )}
//                             </button>
//
//                             {/* Dropdown Menu */}
//                             {showBankDropdown && (
//                                 <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
//                                     {/* Search Input */}
//                                     <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-900">
//                                         <input
//                                             type="text"
//                                             placeholder="Search banks..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none"
//                                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                             onBlur={(e) => e.target.style.borderColor = '#4b5563'}
//                                         />
//                                     </div>
//
//                                     {/* Banks List */}
//                                     <div className="overflow-y-auto max-h-48">
//                                         {filteredBanks.length > 0 ? (
//                                             filteredBanks.map((bank, index) => (
//                                                 <button
//                                                     key={bank.id || `bank-${index}`}
//                                                     type="button"
//                                                     onClick={() => handleBankSelect(bank)}
//                                                     className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition border-b border-gray-800 last:border-b-0"
//                                                 >
//                                                     {bank.name}
//                                                 </button>
//                                             ))
//                                         ) : (
//                                             <div className="px-4 py-3 text-gray-400 text-center text-sm">
//                                                 {searchTerm ? 'No banks found' : 'Loading banks...'}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Account Number */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Account Number *
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 value={accountNumber}
//                                 onChange={handleAccountNumberChange}
//                                 maxLength="10"
//                                 disabled={!selectedBank || isVerifying}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 placeholder="Enter 10-digit account number"
//                             />
//                             {isVerifying && (
//                                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                     <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* Customer Name Display */}
//                         {customerName && (
//                             <div className="mt-2 flex items-center space-x-2 text-green-400 text-sm">
//                                 <CheckCircle size={16} />
//                                 <span>{customerName}</span>
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Error Message */}
//                     {error && (
//                         <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
//                             <p className="text-red-400 text-sm">{error}</p>
//                         </div>
//                     )}
//
//                     {/* Continue Button */}
//                     <button
//                         onClick={handleContinue}
//                         disabled={!customerName || isVerifying}
//                         className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                         style={{ backgroundColor: '#f7623b' }}
//                         onMouseEnter={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '0.9')}
//                         onMouseLeave={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '1')}
//                     >
//                         {isVerifying ? 'Verifying...' : 'Continue'}
//                     </button>
//                 </div>
//
//                 {/* Overlay when verifying */}
//                 {isVerifying && (
//                     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                         <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
//                             <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
//                             <p className="text-white font-medium">Verifying account details...</p>
//                             <p className="text-gray-400 text-sm">Please wait</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default HomePage;











// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Loader2, CheckCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
//
// function HomePage() {
//     const navigate = useNavigate();
//
//     const [banks, setBanks] = useState([]);
//     const [selectedBank, setSelectedBank] = useState(null);
//     const [accountNumber, setAccountNumber] = useState('');
//     const [customerName, setCustomerName] = useState('');
//     const [isLoadingBanks, setIsLoadingBanks] = useState(false);
//     const [isVerifying, setIsVerifying] = useState(false);
//     const [error, setError] = useState('');
//     const [showBankDropdown, setShowBankDropdown] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//
//     const MONO_API_KEY = 'live_sk_z2zqd4k2ayqv9z9t0dqi';
//     const BACKEND_API_URL = 'http://localhost:8080/api/debit-mandate'; // Update with your backend URL
//
//     // Fetch banks list when dropdown is opened
//     const fetchBanks = async () => {
//         setIsLoadingBanks(true);
//         setError('');
//
//         try {
//             const response = await fetch('https://api.withmono.com/v3/banks/list', {
//                 method: 'GET',
//                 headers: {
//                     'accept': 'application/json',
//                     'mono-sec-key': MONO_API_KEY
//                 }
//             });
//
//             const data = await response.json();
//
//             if (data && data.data) {
//                 setBanks(data.data);
//             } else {
//                 setError('Failed to load banks. Please try again.');
//             }
//         } catch (err) {
//             console.error('Error fetching banks:', err);
//             setError('Unable to connect to banking service. Please check your internet connection.');
//         } finally {
//             setIsLoadingBanks(false);
//         }
//     };
//
//     // Handle dropdown toggle
//     const handleBankDropdownClick = () => {
//         if (!showBankDropdown && banks.length === 0) {
//             fetchBanks();
//         }
//         setShowBankDropdown(!showBankDropdown);
//     };
//
//     // Filter banks based on search
//     const filteredBanks = banks.filter(bank =>
//         bank.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//
//     // Handle bank selection
//     const handleBankSelect = (bank) => {
//         setSelectedBank(bank);
//         setShowBankDropdown(false);
//         setSearchTerm('');
//         setCustomerName('');
//         setAccountNumber('');
//         setError('');
//     };
//
//     // Verify account number
//     const verifyAccountNumber = async (accNumber, bank) => {
//         setIsVerifying(true);
//         setError('');
//         setCustomerName('');
//
//         try {
//             console.log('Verifying account:', { account_number: accNumber, nip_code: bank.nip_code, bank_name: bank.name });
//
//             const response = await fetch('https://api.withmono.com/v3/lookup/account-number', {
//                 method: 'POST',
//                 headers: {
//                     'accept': 'application/json',
//                     'content-type': 'application/json',
//                     'mono-sec-key': MONO_API_KEY
//                 },
//                 body: JSON.stringify({
//                     nip_code: bank.nip_code,
//                     account_number: accNumber
//                 })
//             });
//
//             console.log('Response status:', response.status);
//             const data = await response.json();
//             console.log('Response data:', data);
//
//             if (response.ok && data) {
//                 const accountName = data.data?.name || data.data?.account_name || data.account_name;
//
//                 if (accountName) {
//                     setCustomerName(accountName);
//                     setError('');
//                 } else {
//                     console.error('No account name in response:', data);
//                     setError('Account verification returned no name. Please check your account details or try a different bank.');
//                     setCustomerName('');
//                 }
//             } else if (response.status === 400) {
//                 const errorMessage = data.message || data.error || 'Invalid account details';
//                 setError(`Verification failed: ${errorMessage}`);
//                 setCustomerName('');
//             } else if (data && data.message) {
//                 setError(data.message);
//                 setCustomerName('');
//             } else {
//                 setError('Account not found. Please verify your account number and bank selection.');
//                 setCustomerName('');
//             }
//         } catch (err) {
//             console.error('Error verifying account:', err);
//             setError('Unable to verify account. Please check your internet connection and try again.');
//             setCustomerName('');
//         } finally {
//             setIsVerifying(false);
//         }
//     };
//
//     // Handle account number input
//     const handleAccountNumberChange = (e) => {
//         const value = e.target.value.replace(/\D/g, ''); // Only allow digits
//         setAccountNumber(value);
//         setError('');
//         setCustomerName('');
//
//         // Trigger verification when 10 digits are entered
//         if (value.length === 10 && selectedBank) {
//             verifyAccountNumber(value, selectedBank);
//         }
//     };
//
//     // Save account verification to backend
//     const saveAccountVerificationToBackend = async () => {
//         try {
//             const payload = {
//                 accountNumber: accountNumber,
//                 bankName: selectedBank.name,
//                 nipCode: selectedBank.nip_code,
//                 customerName: customerName
//             };
//
//             console.log('Saving to backend:', payload);
//
//             const response = await fetch(`${BACKEND_API_URL}/account-verification`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(payload)
//             });
//
//             const data = await response.json();
//             console.log('Backend response:', data);
//
//             if (response.ok && data.success) {
//                 return data.data; // Returns { id, reference, accountNumber, bankName, customerName }
//             } else {
//                 throw new Error(data.message || 'Failed to save account verification');
//             }
//         } catch (err) {
//             console.error('Error saving to backend:', err);
//             throw err;
//         }
//     };
//
//     // Handle continue button
//     const handleContinue = async () => {
//         if (!customerName) {
//             setError('Please verify your account details before continuing.');
//             return;
//         }
//
//         setIsVerifying(true);
//         setError('');
//
//         try {
//             // Save to backend first
//             const savedData = await saveAccountVerificationToBackend();
//
//             // Parse customer name into first, middle, and last names
//             const nameParts = customerName.trim().split(' ');
//             let firstName = '';
//             let middleName = '';
//             let lastName = '';
//
//             if (nameParts.length === 1) {
//                 firstName = nameParts[0];
//             } else if (nameParts.length === 2) {
//                 firstName = nameParts[0];
//                 lastName = nameParts[1];
//             } else if (nameParts.length >= 3) {
//                 firstName = nameParts[0];
//                 lastName = nameParts[nameParts.length - 1];
//                 middleName = nameParts.slice(1, -1).join(' ');
//             }
//
//             // Navigate to agent entry form with pre-filled data and backend reference
//             navigate('/agent-entry', {
//                 state: {
//                     firstName,
//                     middleName,
//                     lastName,
//                     bankName: selectedBank.name,
//                     accountNumber,
//                     mandateId: savedData.id,
//                     mandateReference: savedData.reference
//                 }
//             });
//         } catch (err) {
//             setError('Failed to save account verification. Please try again.');
//             console.error('Error in handleContinue:', err);
//         } finally {
//             setIsVerifying(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
//             <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
//                         Welcome
//                     </h1>
//                     <p className="text-gray-400 text-sm sm:text-base">
//                         Verify your account to get started
//                     </p>
//                 </div>
//
//                 {/* Form */}
//                 <div className="space-y-6">
//                     {/* Bank Selection */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Select Your Bank *
//                         </label>
//                         <div className="relative">
//                             <button
//                                 type="button"
//                                 onClick={handleBankDropdownClick}
//                                 disabled={isVerifying}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-left flex items-center justify-between focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                             >
//                                 <span className={selectedBank ? 'text-white' : 'text-gray-400'}>
//                                     {selectedBank ? selectedBank.name : 'Choose a bank'}
//                                 </span>
//                                 {isLoadingBanks ? (
//                                     <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
//                                 ) : (
//                                     <ChevronDown size={20} className="text-gray-400" />
//                                 )}
//                             </button>
//
//                             {/* Dropdown Menu */}
//                             {showBankDropdown && (
//                                 <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
//                                     {/* Search Input */}
//                                     <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-900">
//                                         <input
//                                             type="text"
//                                             placeholder="Search banks..."
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none"
//                                             onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                             onBlur={(e) => e.target.style.borderColor = '#4b5563'}
//                                         />
//                                     </div>
//
//                                     {/* Banks List */}
//                                     <div className="overflow-y-auto max-h-48">
//                                         {filteredBanks.length > 0 ? (
//                                             filteredBanks.map((bank, index) => (
//                                                 <button
//                                                     key={bank.id || `bank-${index}`}
//                                                     type="button"
//                                                     onClick={() => handleBankSelect(bank)}
//                                                     className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition border-b border-gray-800 last:border-b-0"
//                                                 >
//                                                     {bank.name}
//                                                 </button>
//                                             ))
//                                         ) : (
//                                             <div className="px-4 py-3 text-gray-400 text-center text-sm">
//                                                 {searchTerm ? 'No banks found' : 'Loading banks...'}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Account Number */}
//                     <div>
//                         <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
//                             Account Number *
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 value={accountNumber}
//                                 onChange={handleAccountNumberChange}
//                                 maxLength="10"
//                                 disabled={!selectedBank || isVerifying}
//                                 className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                 onFocus={(e) => e.target.style.borderColor = '#f7623b'}
//                                 onBlur={(e) => e.target.style.borderColor = '#374151'}
//                                 placeholder="Enter 10-digit account number"
//                             />
//                             {isVerifying && (
//                                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                     <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* Customer Name Display */}
//                         {customerName && (
//                             <div className="mt-2 flex items-center space-x-2 text-green-400 text-sm">
//                                 <CheckCircle size={16} />
//                                 <span>{customerName}</span>
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Error Message */}
//                     {error && (
//                         <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
//                             <p className="text-red-400 text-sm">{error}</p>
//                         </div>
//                     )}
//
//                     {/* Continue Button */}
//                     <button
//                         onClick={handleContinue}
//                         disabled={!customerName || isVerifying}
//                         className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                         style={{ backgroundColor: '#f7623b' }}
//                         onMouseEnter={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '0.9')}
//                         onMouseLeave={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '1')}
//                     >
//                         {isVerifying ? 'Saving...' : 'Continue'}
//                     </button>
//                 </div>
//
//                 {/* Overlay when verifying */}
//                 {isVerifying && (
//                     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                         <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
//                             <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
//                             <p className="text-white font-medium">Processing...</p>
//                             <p className="text-gray-400 text-sm">Please wait</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default HomePage;




import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [accountNumber, setAccountNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [isLoadingBanks, setIsLoadingBanks] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // const MONO_API_KEY = import.meta.env.VITE_MONO_API_KEY;
    const MONO_API_KEY = "live_sk_dtn8zgs0joctmpxcswfb";


    const BACKEND_API_URL = 'https://web-production-9f730.up.railway.app/api/debit-mandate'; // Update with your backend URL

    // Fetch banks list when dropdown is opened
    const fetchBanks = async () => {
        setIsLoadingBanks(true);
        setError('');

        try {
            const response = await fetch('https://api.withmono.com/v3/banks/list', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'mono-sec-key': MONO_API_KEY
                }
            });

            const data = await response.json();

            if (data && data.data) {
                setBanks(data.data);
            } else {
                setError('Failed to load banks. Please try again.');
            }
        } catch (err) {
            console.error('Error fetching banks:', err);
            setError('Unable to connect to banking service. Please check your internet connection.');
        } finally {
            setIsLoadingBanks(false);
        }
    };

    // Handle dropdown toggle
    const handleBankDropdownClick = () => {
        if (!showBankDropdown && banks.length === 0) {
            fetchBanks();
        }
        setShowBankDropdown(!showBankDropdown);
    };

    // Filter banks based on search
    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle bank selection
    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setShowBankDropdown(false);
        setSearchTerm('');
        setCustomerName('');
        setAccountNumber('');
        setError('');
    };

    // Verify account number
    const verifyAccountNumber = async (accNumber, bank) => {
        setIsVerifying(true);
        setError('');
        setCustomerName('');

        try {
            console.log('Verifying account:', { account_number: accNumber, nip_code: bank.nip_code, bank_name: bank.name });

            const response = await fetch('https://api.withmono.com/v3/lookup/account-number', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'mono-sec-key': MONO_API_KEY
                },
                body: JSON.stringify({
                    nip_code: bank.nip_code,
                    account_number: accNumber
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data) {
                const accountName = data.data?.name || data.data?.account_name || data.account_name;

                if (accountName) {
                    setCustomerName(accountName);
                    setError('');
                } else {
                    console.error('No account name in response:', data);
                    setError('Account verification returned no name. Please check your account details or try a different bank.');
                    setCustomerName('');
                }
            } else if (response.status === 400) {
                const errorMessage = data.message || data.error || 'Invalid account details';
                setError(`Verification failed: ${errorMessage}`);
                setCustomerName('');
            } else if (data && data.message) {
                setError(data.message);
                setCustomerName('');
            } else {
                setError('Account not found. Please verify your account number and bank selection.');
                setCustomerName('');
            }
        } catch (err) {
            console.error('Error verifying account:', err);
            setError('Unable to verify account. Please check your internet connection and try again.');
            setCustomerName('');
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle account number input
    const handleAccountNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        setAccountNumber(value);
        setError('');
        setCustomerName('');

        // Trigger verification when 10 digits are entered
        if (value.length === 10 && selectedBank) {
            verifyAccountNumber(value, selectedBank);
        }
    };

    // Save account verification to backend
    const saveAccountVerificationToBackend = async () => {
        try {
            const payload = {
                accountNumber: accountNumber,
                bankName: selectedBank.name,
                nipCode: selectedBank.nip_code,
                customerName: customerName
            };

            console.log('Saving to backend:', payload);

            const response = await fetch(`${BACKEND_API_URL}/account-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('Backend response:', data);

            if (response.ok && data.success) {
                return data.data; // Returns { id, reference, accountNumber, bankName, customerName }
            } else {
                throw new Error(data.message || 'Failed to save account verification');
            }
        } catch (err) {
            console.error('Error saving to backend:', err);
            throw err;
        }
    };

    // Handle continue button
    const handleContinue = async () => {
        if (!customerName) {
            setError('Please verify your account details before continuing.');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            // Save to backend first
            const savedData = await saveAccountVerificationToBackend();

            // Parse customer name into first, middle, and last names
            const nameParts = customerName.trim().split(' ');
            let firstName = '';
            let middleName = '';
            let lastName = '';

            if (nameParts.length === 1) {
                firstName = nameParts[0];
            } else if (nameParts.length === 2) {
                firstName = nameParts[0];
                lastName = nameParts[1];
            } else if (nameParts.length >= 3) {
                firstName = nameParts[0];
                lastName = nameParts[nameParts.length - 1];
                middleName = nameParts.slice(1, -1).join(' ');
            }

            // Navigate to agent entry form with pre-filled data and backend reference
            navigate('/agent-entry', {
                state: {
                    firstName,
                    middleName,
                    lastName,
                    bankName: selectedBank.name,
                    accountNumber,
                    mandateReference: savedData.reference
                }
            });
        } catch (err) {
            setError('Failed to save account verification. Please try again.');
            console.error('Error in handleContinue:', err);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#f7623b' }}>
            <div className="w-full max-w-md bg-black rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#f7623b' }}>
                        Welcome
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">
                        Verify your account to get started
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Bank Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                            Select Your Bank *
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={handleBankDropdownClick}
                                disabled={isVerifying}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-left flex items-center justify-between focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                            >
                                <span className={selectedBank ? 'text-white' : 'text-gray-400'}>
                                    {selectedBank ? selectedBank.name : 'Choose a bank'}
                                </span>
                                {isLoadingBanks ? (
                                    <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
                                ) : (
                                    <ChevronDown size={20} className="text-gray-400" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {showBankDropdown && (
                                <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden">
                                    {/* Search Input */}
                                    <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-900">
                                        <input
                                            type="text"
                                            placeholder="Search banks..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none"
                                            onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                            onBlur={(e) => e.target.style.borderColor = '#4b5563'}
                                        />
                                    </div>

                                    {/* Banks List */}
                                    <div className="overflow-y-auto max-h-48">
                                        {filteredBanks.length > 0 ? (
                                            filteredBanks.map((bank, index) => (
                                                <button
                                                    key={bank.id || `bank-${index}`}
                                                    type="button"
                                                    onClick={() => handleBankSelect(bank)}
                                                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition border-b border-gray-800 last:border-b-0"
                                                >
                                                    {bank.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-gray-400 text-center text-sm">
                                                {searchTerm ? 'No banks found' : 'Loading banks...'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#f7623b' }}>
                            Account Number *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={handleAccountNumberChange}
                                maxLength="10"
                                disabled={!selectedBank || isVerifying}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onFocus={(e) => e.target.style.borderColor = '#f7623b'}
                                onBlur={(e) => e.target.style.borderColor = '#374151'}
                                placeholder="Enter 10-digit account number"
                            />
                            {isVerifying && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="animate-spin" size={20} style={{ color: '#f7623b' }} />
                                </div>
                            )}
                        </div>

                        {/* Customer Name Display */}
                        {customerName && (
                            <div className="mt-2 flex items-center space-x-2 text-green-400 text-sm">
                                <CheckCircle size={16} />
                                <span>{customerName}</span>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!customerName || isVerifying}
                        className="w-full font-bold py-4 rounded-lg transition duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#f7623b' }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '0.9')}
                        onMouseLeave={(e) => !e.currentTarget.disabled && (e.target.style.opacity = '1')}
                    >
                        {isVerifying ? 'Saving...' : 'Continue'}
                    </button>
                </div>

                {/* Overlay when verifying */}
                {isVerifying && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center space-y-4">
                            <Loader2 className="animate-spin" size={48} style={{ color: '#f7623b' }} />
                            <p className="text-white font-medium">Processing...</p>
                            <p className="text-gray-400 text-sm">Please wait</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;