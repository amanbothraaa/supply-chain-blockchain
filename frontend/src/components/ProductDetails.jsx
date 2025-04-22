import { useState } from 'react';

export default function ProductDetails({ contract }) {
  const [productId, setProductId] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProductDetails(null);

    try {
      const [name, owner, locationHistory] = await contract.getProduct(productId);
      setProductDetails({ name, owner, locationHistory });
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Product Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
            Product ID
          </label>
          <input
            type="number"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'View Details'}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      
      {productDetails && (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{productDetails.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Owner</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{productDetails.owner}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location History</h3>
            {productDetails.locationHistory.length === 0 ? (
              <p className="text-sm text-gray-500">No location history available</p>
            ) : (
              <div className="space-y-4">
                {productDetails.locationHistory.map((location, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {location.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(location.timestamp)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.latitude / 1e6}, {location.longitude / 1e6}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 