import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Eye, Package, DollarSign, Hash, Image } from 'lucide-react';


const MosaicProductGrid = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  /*const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 129.99,
      originalPrice: 159.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 324,
      category: "Electronics",
      isNew: true,
      size: "large"
    },
    {
      id: 2,
      name: "Minimalist Watch",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 156,
      category: "Accessories",
      size: "medium"
    },
    {
      id: 3,
      name: "Leather Backpack",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 89,
      category: "Bags",
      size: "medium"
    },
    {
      id: 4,
      name: "Smart Speaker",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop",
      rating: 4.3,
      reviews: 267,
      category: "Electronics",
      size: "small"
    },
    {
      id: 5,
      name: "Flowers Y'all!",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1751601382303-f23fb4738449?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 43,
      category: "Home",
      size: "small"
    },
    {
      id: 6,
      name: "Yoga Mat Premium",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 178,
      category: "Fitness",
      isNew: true,
      size: "wide"
    },
    {
      id: 7,
      name: "Bluetooth Earbuds",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      rating: 4.4,
      reviews: 392,
      category: "Electronics",
      size: "medium"
    },
    {
      id: 8,
      name: "Desk Lamp LED",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 4.2,
      reviews: 76,
      category: "Home",
      size: "small"
    }
  ];*/
  // Fetch products from API
  const fetchProducts = async (page = 1, searchTerm = '') => {
      setLoading(true);
      try {
      const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(), // Use the current limit from state
          ...(searchTerm && { search: searchTerm })
      });

      // Make sure we're calling the correct API endpoint
      const response = await fetch(`/api/d1Products?${params}`);
      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
      // Preserve the current limit when updating pagination
      setPagination(prev => ({
          ...prev,
          ...data.pagination,
          limit: prev.limit // Keep the original limit
      }));
      setError(null);
      } catch (err) {
      setError(err.message);
      setProducts([]);
      } finally {
      setLoading(false);
      }
  };

  // Load products on component mount
  useEffect(() => {
      fetchProducts();
  }, []);

  const formatPrice = (price) => {
      if (!price) return 'N/A';
      return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
      if (!text) return 'N/A';
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };


  const toggleLike = (id) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getGridClass = (size) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2';
      case 'wide':
        return 'col-span-2 row-span-1';
      case 'medium':
        return 'col-span-1 row-span-1';
      case 'small':
        return 'col-span-1 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Featured Products</h1>
        <p className="text-gray-600 text-lg">Discover our curated collection of premium items</p>
      </div>

      <div className="grid grid-cols-4 gap-4 auto-rows-fr max-h-[60vh] overflow-hidden rounded-3xl">
        {products.map((product) => (
          <div
            key={product.id}
            className={`${getGridClass(product.prodEid)} group relative overflow-hidden rounded transition-all duration-500 transform hover:scale-[1.02]`}
            //onMouseEnter={() => setHoveredItem(product.id)}
            //onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Image Container */}
            <div className="relative h-full">
              <img
                src={product.pics}
                alt={product.prName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <button
                  onClick={() => toggleLike(product.id)}></button>
                {/*<button
                  onClick={() => toggleLike(product.id)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                    likedItems.has(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart size={16} className={likedItems.has(product.id) ? 'fill-current' : ''} />
                </button>
                <button className="p-2 bg-white/80 text-gray-700 rounded-full backdrop-blur-sm hover:bg-white transition-all duration-200">
                  <Eye size={16} />
                </button>*/}
              </div>

              {/* Static Info (visible when not hovered) */}
              <div className="absolute bottom-4 left-4 right-4 group-hover:opacity-0 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.prName}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{product.prc}</span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Filter Pills */}
      {/*<div className="mt-8 flex flex-wrap gap-3 justify-center">
        {['All', 'Electronics', 'Accessories', 'Bags', 'Home', 'Fitness'].map((category) => (
          <button
            key={category}
            className="px-6 py-2 rounded-full bg-white/80 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
          >
            {category}
          </button>
        ))}
      </div>*/}
    </div>
  );
};

export default MosaicProductGrid;