import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import RegisterProduct from './components/RegisterProduct';
import LocationTracker from './components/LocationTracker';
import Dashboard from './components/Dashboard';

// Import ABI from contract artifacts
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;
const CONTRACT_ABI = [
  "function registerProduct(string memory _name, string memory _description, string memory _category, string memory _manufacturer, uint256 _manufacturingDate) public",
  "function transferOwnership(uint _productId, address _newOwner) public",
  "function updateLocation(uint _productId, int256 _latitude, int256 _longitude, string memory _description) public",
  "function getProduct(uint _productId) public view returns (string memory name, string memory description, string memory category, string memory manufacturer, uint256 manufacturingDate, address owner, tuple(int256 latitude, int256 longitude, uint256 timestamp, string description)[] locationHistory)",
  "function getOwnerProducts(address _owner) public view returns (uint[] memory)"
];

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <button
                    onClick={connectWallet}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SupplyChain Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Connected Account: {account}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Register Product
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'track'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Track Location
            </button>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard contract={contract} account={account} />}
          {activeTab === 'register' && <RegisterProduct contract={contract} />}
          {activeTab === 'track' && <LocationTracker contract={contract} />}
        </div>
      </div>
    </div>
  );
}

export default App;
