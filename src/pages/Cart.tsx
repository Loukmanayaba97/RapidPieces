import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-2xl shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#0B1C2E]" />
          </button>
          <h2 className="text-xl font-bold text-[#0B1C2E]">Mon Panier</h2>
        </div>
      </div>

      <div className="px-6 mt-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Votre panier est vide</h3>
            <button onClick={() => navigate('/search')} className="text-[#B91C1C] font-medium hover:underline">
              Découvrir nos pièces
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List of items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-[#0B1C2E] line-clamp-1">{item.title}</h4>
                    <p className="text-gray-900 font-bold mt-1 text-sm">{item.price.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">-</button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center ml-auto">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Proceed */}
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Sous-total</span>
                <span className="font-medium text-[#0B1C2E] text-sm">{getTotal().toLocaleString()} FCFA</span>
              </div>
              <div className="h-px w-full bg-gray-100 mb-4 mt-3"></div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-[#0B1C2E]">Total (hors livraison)</span>
                <span className="text-lg font-extrabold text-[#0B1C2E]">{getTotal().toLocaleString()} <span className="text-xs font-bold text-gray-500">FCFA</span></span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#0B1C2E] hover:bg-[#162e49] text-white py-3.5 rounded-full font-bold text-sm shadow-md transition-all"
              >
                Passer à la caisse
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
