import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Dashboard({ contract, account }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [contract, account]);

  const loadProducts = async () => {
    try {
      const productIds = await contract.getOwnerProducts(account);
      const productsData = await Promise.all(
        productIds.map(async (id) => {
          const [name, description, category, manufacturer, manufacturingDate, owner, locationHistory] = 
            await contract.getProduct(id);
          return {
            id: id.toString(),
            name,
            description,
            category,
            manufacturer,
            manufacturingDate: new Date(manufacturingDate * 1000).toLocaleDateString(),
            owner,
            locationHistory: locationHistory.map(loc => ({
              latitude: loc.latitude / 1e6,
              longitude: loc.longitude / 1e6,
              timestamp: new Date(loc.timestamp * 1000).toLocaleString(),
              description: loc.description
            }))
          };
        })
      );
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500">No products found</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedProduct?.id === product.id
                        ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details and Map */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProduct ? (
            <>
              {/* Product Details */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedProduct.name}</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="text-sm text-gray-900">{selectedProduct.description}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="text-sm text-gray-900">{selectedProduct.category}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                    <dd className="text-sm text-gray-900">{selectedProduct.manufacturer}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500">Manufacturing Date</dt>
                    <dd className="text-sm text-gray-900">{selectedProduct.manufacturingDate}</dd>
                  </div>
                </dl>
              </div>

              {/* Map */}
              {selectedProduct.locationHistory.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Location History</h3>
                  <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={[
                        selectedProduct.locationHistory[0].latitude,
                        selectedProduct.locationHistory[0].longitude
                      ]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {selectedProduct.locationHistory.map((location, index) => (
                        <Marker
                          key={index}
                          position={[location.latitude, location.longitude]}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-medium">{location.description}</p>
                              <p className="text-gray-500">{location.timestamp}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      <Polyline
                        positions={selectedProduct.locationHistory.map(loc => [
                          loc.latitude,
                          loc.longitude
                        ])}
                        color="blue"
                      />
                    </MapContainer>
                  </div>
                  {/* Timeline */}
                  <div className="mt-6 space-y-4">
                    {selectedProduct.locationHistory.map((location, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 h-4 w-4 rounded-full bg-indigo-500 mt-1"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {location.description}
                          </p>
                          <p className="text-sm text-gray-500">{location.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 text-center text-gray-500">
              Select a product to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 