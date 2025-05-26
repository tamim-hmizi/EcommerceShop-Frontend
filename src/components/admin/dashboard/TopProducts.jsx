import React, { useEffect, useState } from 'react';
import { FiPackage } from "react-icons/fi";
import api from "../../../services/api";

const TopProducts = ({ topProducts, totalStock }) => {
  const [productImages, setProductImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  // Load product images
  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = topProducts.map(async (product) => {
        if (product.image) {
          setLoadingImages(prev => ({ ...prev, [product._id]: true }));
          try {
            const response = await api.get(product.image, {
              responseType: "blob",
            });
            const blobUrl = URL.createObjectURL(response.data);
            return { id: product._id, url: blobUrl };
          } catch (error) {
            console.error(`Error fetching image for product ${product._id}:`, error);
            return { id: product._id, url: null };
          } finally {
            setLoadingImages(prev => ({ ...prev, [product._id]: false }));
          }
        }
        return { id: product._id, url: null };
      });

      const results = await Promise.all(imagePromises);
      const imageMap = results.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {});

      setProductImages(imageMap);
    };

    if (topProducts.length > 0) {
      fetchImages();
    }

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(productImages).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [topProducts]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-gray-800">Top Products</h3>
        <div className="text-sm text-gray-500">By Stock Level</div>
      </div>
      <div className="overflow-hidden">
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map(product => (
              <div key={product._id} className="flex items-center p-3 border-b hover:bg-gray-50 transition-colors rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                  {loadingImages[product._id] ? (
                    <div className="animate-pulse w-full h-full bg-gray-200"></div>
                  ) : productImages[product._id] ? (
                    <img
                      src={productImages[product._id]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiPackage className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (product.stock / totalStock) * 100 * 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="text-indigo-600 font-medium">
                  ${product.price}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiPackage className="mx-auto h-8 w-8 mb-2" />
            No products available
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
