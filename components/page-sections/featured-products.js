import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// Inline scroll direction hook
const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState('down');

  useEffect(() => {
    let lastY = window.scrollY;

    const update = () => {
      const currY = window.scrollY;
      if (currY > lastY) setScrollDir('down');
      else if (currY < lastY) setScrollDir('up');
      lastY = currY > 0 ? currY : 0;
    };

    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);

  return scrollDir;
};

const FeaturedProducts = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [likedItems, setLikedItems] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollDirection = useScrollDirection();
  const hoverColors = ['#273B5B'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
        category: 'featured',
      });

      const res = await fetch(`/api/d1Products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');

      const all = data.products || [];
      const featured = all.filter(p => p.category?.toLowerCase() === 'featured');
      const useList = featured.length > 0 ? featured : all;

      setProducts(useList.map((p, i) => ({ ...p, hoverColor: hoverColors[i % hoverColors.length] })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price) => typeof price === 'number' ? `$${price.toFixed(2)}` : `$${price || 'N/A'}`;

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-8">Loading...</div>;
  if (error) return <div className="max-w-7xl mx-auto px-6 py-8 text-red-500">{error}</div>;
  if (products.length === 0) return <div className="max-w-7xl mx-auto px-6 py-8">No featured products.</div>;

  return (
    <div className="mx-auto mt-4 sm:mt-8 px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-[2.5rem] md:text-[4rem] font-bold text-cetera-dark-blue mb-2 font-cetera-libre">
          Featured Collection
        </h1>
        <p className="text-cetera-dark-orange text-[0.85rem] md:text-lg font-cetera-libre">
          Discover our curated selection of premium products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Large Product */}
        {products[0] && (
          <AnimatedProductCard product={products[0]} scrollDirection={scrollDirection} isLarge={true} likedItems={likedItems} setLikedItems={setLikedItems} setHoveredItem={setHoveredItem} hoveredItem={hoveredItem} />
        )}

        {/* Right: Smaller Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.slice(1, 5).map((product, index) => (
            <AnimatedProductCard
              key={product.id}
              product={product}
              scrollDirection={scrollDirection}
              index={index}
              likedItems={likedItems}
              setLikedItems={setLikedItems}
              setHoveredItem={setHoveredItem}
              hoveredItem={hoveredItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AnimatedProductCard = ({
  product,
  scrollDirection,
  isLarge = false,
  index = 0,
  likedItems,
  setLikedItems,
  setHoveredItem,
  hoveredItem
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-300px 0px', triggerOnce: false });

  const formatPrice = (price) => typeof price === 'number' ? `$${price.toFixed(2)}` : `$${price || 'N/A'}`;

  const baseClasses = "group relative overflow-hidden rounded-lg transition-all duration-500 hover:shadow-xl aspect-square";
  const wrapperClasses = isLarge
    ? "bg-gradient-to-br hover:shadow-2xl"
    : "";

  return (
    <motion.div
      ref={ref}
      initial={{ x: -100, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {opacity: 1}}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
      className={`${baseClasses} ${wrapperClasses}`}
      onMouseEnter={() => setHoveredItem(product.id)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="absolute inset-0 transition-colors duration-300" style={{
        backgroundColor: hoveredItem === product.id ? product.hoverColor : 'transparent',
        zIndex: 0
      }} />

      <div className={`relative h-full w-full z-10 ${isLarge ? "" : "transition-opacity duration-300 group-hover:opacity-0"}`}>
        <img src={product.pics} alt={product.prName} className="w-full h-full object-cover rounded-lg" />
      </div>

      <div className={`absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-20 pointer-events-none ${isLarge ? "text-transparent group-hover:bg-cetera-dark-blue group-hover:bg-opacity-50 group-hover:text-cetera-mono-orange transition-all duration-500" : "text-transparent group-hover:text-cetera-mono-orange transition-opacity duration-300"}`}>
        <h3 className={`${isLarge ? "text-2xl" : "text-xl"} font-bold mb-2 font-cetera-libre`}>
          {product.prName}
        </h3>
        <div className={`${isLarge ? "text-xl" : "text-lg"} font-bold`}>
          {formatPrice(product.prc)}
        </div>
          <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
            <div className="text-sm font-medium text-transparent group-hover:text-cetera-mono-orange font-cetera-josefin">
              {product.colors}
            </div>
          </div>
      </div>

      <div className={`${isLarge ? "absolute top-4 right-4" : "absolute top-2 right-2"} z-30 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0`}>
        <button
          onClick={() => setLikedItems(prev => {
            const next = new Set(prev);
            next.has(product.id) ? next.delete(product.id) : next.add(product.id);
            return next;
          })}
          className={`p-${isLarge ? '3' : '2'} rounded-full backdrop-blur-sm ${likedItems.has(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
        >
          <Heart size={isLarge ? 20 : 16} className={likedItems.has(product.id) ? 'fill-current' : ''} />
        </button>
        <button className={`p-${isLarge ? '3' : '2'} bg-white/80 text-gray-700 rounded-full backdrop-blur-sm hover:bg-white`}>
          <ShoppingCart size={isLarge ? 20 : 16} />
        </button>
      </div>

      {isLarge && (
        <div className="absolute left-8 bg-cetera-dark-blue rounded-full px-4 py-2 text-sm font-semibold text-cetera-mono-orange font-cetera-josefin">
          Featured
        </div>
      )}

      {/*{!isLarge && (
        <div className="absolute bottom-4 left-0 right-0 z-20 text-center">
          <div className="text-sm font-medium text-transparent group-hover:text-cetera-mono-orange font-cetera-josefin">
            {product.colors}
          </div>
        </div>
      )}*/}
    </motion.div>
  );
};

export default FeaturedProducts;
