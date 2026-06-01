import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { cn } from '../lib/utils';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sync state if searchParams change externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?q=${query}`;
        if (categoryParam) {
          url += `&category=${encodeURIComponent(categoryParam)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [query, categoryParam]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setSearchParams(prev => {
      if (val) {
        prev.set('q', val);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  };

  const clearCategory = () => {
    setSearchParams(prev => {
      prev.delete('category');
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Search Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-2xl shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#0B1C2E]" />
          </button>
          <h2 className="text-2xl font-bold text-[#0B1C2E]">Recherche</h2>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Ex: Plaquettes de frein, OEM..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] text-sm"
              autoFocus
            />
          </div>
          <button className="w-14 h-[52px] bg-[#0B1C2E] rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {categoryParam && (
          <div className="flex items-center gap-2 mt-4 animate-in fade-in">
            <span className="text-xs font-bold text-gray-500">Filtré par :</span>
            <div className="bg-[#B91C1C]/10 border border-[#B91C1C]/20 text-[#B91C1C] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span>{categoryParam}</span>
              <button onClick={clearCategory} className="hover:text-red-800 transition-colors p-0.5 rounded-full hover:bg-[#B91C1C]/10">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-[#0B1C2E]">
            {products.length} résultat{products.length !== 1 ? 's' : ''}
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B91C1C]"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 font-medium">Aucune pièce trouvée.</p>
          </div>
        )}

        <div className="mt-8 rounded-2xl text-white text-center relative overflow-hidden shadow-lg border border-gray-100">
          <img src="/images/car_parts_composition_1780234792189.png" alt="Parts" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2E] via-[#0B1C2E]/90 to-[#0B1C2E]/70" />
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#B91C1C] rounded-full opacity-50 blur-2xl"></div>
          <div className="relative z-10 p-6 pt-12">
            <h4 className="font-bold text-lg mb-2 text-white shadow-sm">Vous ne trouvez pas votre pièce ?</h4>
            <p className="text-sm text-gray-200 mb-6 font-medium">Laissez nos experts la chercher pour vous ! Remplissez avec vos détails et photo.</p>
            <button 
              onClick={() => navigate('/request-part')}
              className="bg-[#B91C1C] text-white px-6 py-3.5 rounded-full text-sm font-bold shadow-xl hover:bg-red-700 transition-colors w-full"
            >
              Faire une demande spécifique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
