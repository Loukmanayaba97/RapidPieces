import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En attente': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'En recherche': return <Search className="w-5 h-5 text-blue-600" />;
      case 'Trouvé': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-orange-50 border-orange-100';
      case 'En recherche': return 'bg-blue-50 border-blue-100';
      case 'Trouvé': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-[#0B1C2E] px-6 pt-12 pb-6 rounded-b-2xl shadow-sm sticky top-0 z-20 text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Mes Recherches</h2>
            <p className="text-sm text-gray-300">Suivi de vos demandes</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B91C1C]"></div>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">Vous n'avez soumis aucune recherche de pièce.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className={`p-3 rounded-xl border flex items-start gap-4 mb-4 ${getStatusBg(req.status)}`}>
                <div className="mt-0.5">
                  {getStatusIcon(req.status)}
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1C2E] text-sm">{req.status}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {req.status === 'En attente' && "Nous avons reçu votre demande, un expert va la prendre en charge."}
                    {req.status === 'En recherche' && "Notre équipe est en train de sourcer cette pièce chez nos partenaires."}
                    {req.status === 'Trouvé' && "Bonne nouvelle ! Nous avons trouvé votre pièce, consultez vos messages."}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-[#0B1C2E] mb-1">{req.partName}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {req.vehicle} {req.description ? `• ${req.description}` : ''}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3">
                <span>N° de suivi: #{req.id.slice(0, 8).toUpperCase()}</span>
                <span>{formatDate(req.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
