
import {
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiTag,
  FiImage,
  FiBox,
  FiAlertCircle,
  FiArrowUp,
  FiArrowDown,
  FiPackage
} from "react-icons/fi";
import Loading from "../../../components/Loading";

const ProductTable = ({
  loading,
  currentProducts,
  sortedProducts,
  imageURLs,
  sortField,
  sortDirection,
  handleSort,
  handleEdit,
  setDeleteConfirm,
  searchQuery,
  categoryFilter,
  stockFilter,
  setSearchQuery,
  setCategoryFilter,
  setStockFilter
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm p-6">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center gap-1">
                    Stock
                    {sortField === 'stock' && (
                      sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.length > 0 && currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {imageURLs[product._id] ? (
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-lg ring-1 ring-gray-200 overflow-hidden">
                            <img
                              src={imageURLs[product._id]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FiImage className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="text-primary mr-1 w-4 h-4" />
                        <span className="font-medium text-primary">{parseFloat(product.price).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? <FiBox className="w-3 h-3" /> : <FiAlertCircle className="w-3 h-3" />}
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.category ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                          <FiTag className="w-3 h-3" />
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-sm btn-outline btn-primary"
                          title="Edit product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="btn btn-sm btn-outline btn-error"
                          title="Delete product"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FiPackage className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                      <p className="text-gray-500 mt-1">
                        {searchQuery || categoryFilter || stockFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by creating a new product"}
                      </p>
                      {(searchQuery || categoryFilter || stockFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setCategoryFilter('');
                            setStockFilter('all');
                          }}
                          className="btn btn-sm btn-outline mt-4"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
