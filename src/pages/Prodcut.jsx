// src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/ProductService";
import { getCategories } from "../services/categoryService";
import Loading from "../components/Loading"; // ⬅️ Add this import

function Product() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const token = user?.token;

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats.data);
        setProducts(prods);
        setFilteredProducts(prods);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category?._id === catId
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex p-6 gap-6">
      {/* Menu */}
      <ul className="menu bg-base-200 rounded-box w-56">
        <li>
          <h2 className="menu-title">Categories</h2>
          <ul>
            <li>
              <a
                className={activeCategory === "all" ? "active" : ""}
                onClick={() => handleCategoryClick("all")}
              >
                All
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <a
                  className={activeCategory === cat._id ? "active" : ""}
                  onClick={() => handleCategoryClick(cat._id)}
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Product;
