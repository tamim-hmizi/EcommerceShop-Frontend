
import {
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiBox,
  FiShoppingBag,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";

const ProductTableHeader = ({
  products,
  refreshing,
  loading,
  handleRefresh,
  handleAddProduct
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-lg mr-4">
            <FiPackage className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">Manage your store's product inventory</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`btn btn-circle btn-ghost ${refreshing ? 'animate-spin' : ''}`}
            disabled={refreshing || loading}
            title="Refresh products"
          >
            <FiRefreshCw className="h-5 w-5" />
          </button>

          <button
            onClick={handleAddProduct}
            className="btn btn-primary gap-2"
          >
            <FiPlus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="stat bg-base-100 rounded-lg shadow-sm">
          <div className="stat-figure text-primary">
            <FiBox className="w-6 h-6" />
          </div>
          <div className="stat-title">Total Products</div>
          <div className="stat-value text-primary">{products ? products.length : 0}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm">
          <div className="stat-figure text-success">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div className="stat-title">In Stock</div>
          <div className="stat-value text-success">
            {products ? products.filter(product => product.stock > 0).length : 0}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm">
          <div className="stat-figure text-warning">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div className="stat-title">Low Stock</div>
          <div className="stat-value text-warning">
            {products ? products.filter(product => product.stock > 0 && product.stock <= 10).length : 0}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow-sm">
          <div className="stat-figure text-error">
            <FiShoppingBag className="w-6 h-6" />
          </div>
          <div className="stat-title">Out of Stock</div>
          <div className="stat-value text-error">
            {products ? products.filter(product => product.stock === 0).length : 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTableHeader;
