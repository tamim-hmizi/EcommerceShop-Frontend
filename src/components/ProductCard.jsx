import { useEffect, useState } from "react";
import api from "../services/api"; // Assuming this is your Axios instance
import Loading from "../components/Loading"; // Import Loading component

function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true); // State to track image loading

  useEffect(() => {
    const fetchImage = async () => {
      if (product.image) {
        try {
          const response = await api.get(product.image, {
            responseType: "blob",
          });
          const blobUrl = URL.createObjectURL(response.data);
          setImageUrl(blobUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setLoadingImage(false); // Stop loading when image is fetched
        }
      }
    };

    fetchImage();
  }, [product.image]);

  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <figure>
        {/* Display loading spinner while image is loading */}
        {loadingImage ? (
          <div className="flex justify-center items-center w-full h-60 bg-gray-200">
            <Loading />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-60 object-cover"
          />
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>{product.description}</p>
        <p className="font-bold">${product.price}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
