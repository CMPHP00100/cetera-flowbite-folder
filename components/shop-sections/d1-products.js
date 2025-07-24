// components/shop-sections/d1-products.js
import React, { useState, useEffect } from 'react';
import { Search, Package, Eye, DollarSign, Hash, Image } from 'lucide-react';

const D1Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 100,
        total: 0,
        totalPages: 0
    });

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

    // Handle search
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchProducts(1, search);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        fetchProducts(newPage, search);
    };

    // Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
    };

    // Truncate text
    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'N/A';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    if (loading && products.length === 0) {
        return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error Loading Products</h2>
            <p className="text-red-600">{error}</p>
            <button
                onClick={() => fetchProducts()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
                Try Again
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="bg-cetera-gray text-white rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Package className="h-8 w-8" />
                Products Database
                </h1>
                <p className="text-blue-100">
                {pagination.total} products found
                </p>
            </div>

            {/* Search Bar */}
            {/*<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products by name or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                        handleSearch(e);
                        }
                    }}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    Search
                </button>
                </div>
            </div>*/}

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                <p className="text-gray-500">
                    {search ? `No products match "${search}"` : 'No products available'}
                </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                        {/* Product Image */}
                        {product.pics && (
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {product.pics.includes('http') ? (
                                <img
                                //src={product.pics.split(',')[0]}
                                src={product.pics}
                                alt={product.prName}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.target.src = '';
                                    e.target.style.display = 'none';
                                }}
                                />
                            ) : (
                                <Image className="h-16 w-16 text-gray-400" />
                            )}
                            </div>
                        )}

                        <div className="p-6">
                            {/* Product Name */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            {product.prName || 'Unnamed Product'}
                            </h3>

                            {/* Product ID */}
                            {product.prodEid && (
                            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                ID: {product.prodEid}
                            </p>
                            )}

                            {/* Price */}
                            {product.prc && (
                            <p className="text-lg font-bold text-green-600 mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                {formatPrice(product.prc)}
                            </p>
                            )}

                            {/* Description */}
                            {product.description && (
                            <p className="text-gray-600 mb-3 text-sm">
                                {truncateText(product.description, 100)}
                            </p>
                            )}

                            {/* Colors */}
                            {product.colors && (
                            <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Colors:</p>
                                <p className="text-sm text-gray-600">{product.colors}</p>
                            </div>
                            )}

                            {/* SKU */}
                            {product.spc && (
                            <p className="text-sm text-gray-500">
                                SKU: {product.spc}
                            </p>
                            )}

                            {/* View Details Button */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                            </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                
                <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === pagination.page;
                    return (
                        <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                            isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } disabled:opacity-50`}
                        >
                        {pageNum}
                        </button>
                    );
                    })}
                </div>

                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
                </div>
            )}

            {/* Stats */}
            <div className="mt-6 text-center text-sm text-gray-500">
                Showing {products.length} of {pagination.total} products
                {pagination.totalPages > 1 && ` (Page ${pagination.page} of ${pagination.totalPages})`}
            </div>
        </div>
    );
};

export default D1Products;