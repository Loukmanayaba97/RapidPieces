import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { motion } from 'motion/react';

export default function ProductCard({ product }: { product: any }) {
  let images = [];
  try {
    images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
  } catch (e) {
    if (typeof product.images === 'string') {
      images = [product.images];
    }
  }
  
  const defaultImage = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400';
  const imageUrl = images[0] ? images[0] : defaultImage;
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      vendorId: product.vendorId
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full relative group transition-shadow hover:shadow-md overflow-hidden min-w-[160px]">
      <Link to={`/products/${product.id}`} className="block relative w-full h-40 bg-gray-50 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        {product.stock < 10 && (
           <span className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md">
             Plus que {product.stock}
           </span>
        )}
      </Link>
      
      <div className="flex flex-col flex-1 p-3">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{product.brand}</span>
          <span className="text-[9px] font-bold text-[#0B1C2E] bg-gray-100 px-1.5 py-0.5 rounded">
            {product.state === 'NEW' ? 'Neuf' : product.state === 'USED' ? 'Occasion' : 'Recond.'}
          </span>
        </div>
        
        <Link to={`/products/${product.id}`} className="block group-hover:text-[#B91C1C] mb-2 font-bold text-sm text-[#0B1C2E] line-clamp-2 leading-tight">
          {product.title}
        </Link>
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <div className="text-sm font-extrabold text-[#0B1C2E]">
            {product.price.toLocaleString()} <span className="text-[9px] font-bold text-gray-400">FCFA</span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-[#0B1C2E] text-white flex items-center justify-center shadow-md hover:bg-[#B91C1C] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
