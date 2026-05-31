import { ArrowLeft, Settings2, Disc, Filter, Car, Activity, Wind, RefreshCcw, Snowflake, Lightbulb, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Categories() {
  const navigate = useNavigate();

  const allCategories = [
    { name: 'Moteur', icon: <Settings2 className="w-6 h-6 text-orange-600" />, color: 'bg-orange-100', text: 'text-orange-700' },
    { name: 'Freins', icon: <Disc className="w-6 h-6 text-red-600" />, color: 'bg-red-100', text: 'text-red-700' },
    { name: 'Filtres', icon: <Filter className="w-6 h-6 text-blue-600" />, color: 'bg-blue-100', text: 'text-blue-700' },
    { name: 'Carrosserie', icon: <Car className="w-6 h-6 text-slate-600" />, color: 'bg-slate-100', text: 'text-slate-700' },
    { name: 'Suspension', icon: <Activity className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-100', text: 'text-emerald-700' },
    { name: 'Échappement', icon: <Wind className="w-6 h-6 text-gray-600" />, color: 'bg-gray-100', text: 'text-gray-700' },
    { name: 'Direction', icon: <RefreshCcw className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-100', text: 'text-indigo-700' },
    { name: 'Refroidissement', icon: <Snowflake className="w-6 h-6 text-cyan-600" />, color: 'bg-cyan-100', text: 'text-cyan-700' },
    { name: 'Éclairage', icon: <Lightbulb className="w-6 h-6 text-yellow-600" />, color: 'bg-yellow-100', text: 'text-yellow-700' },
    { name: 'Électricité', icon: <Zap className="w-6 h-6 text-purple-600" />, color: 'bg-purple-100', text: 'text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-2xl shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#0B1C2E]" />
          </button>
          <h2 className="text-2xl font-bold text-[#0B1C2E]">Catégories</h2>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="grid grid-cols-2 gap-4">
          {allCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/search?category=${cat.name}`}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-md transition-all active:scale-95"
            >
              <div className={`w-16 h-16 rounded-full ${cat.color} flex items-center justify-center text-3xl`}>
                {cat.icon}
              </div>
              <span className={`font-bold text-sm ${cat.text}`}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
