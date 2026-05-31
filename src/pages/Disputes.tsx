import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Disputes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<any>(null);

  const [reason, setReason] = useState('NOT_RECEIVED');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) setOrder(data.order);
        })
        .catch(console.error);
    }
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason, description })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors du signalement');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-bold text-xl text-[#0B1C2E] mb-2">Litige ouvert</h2>
          <p className="text-gray-500 text-sm mb-6">Notre équipe de médiation examinera votre dossier sous 48h.</p>
          <button 
            onClick={() => navigate('/profile')} 
            className="w-full bg-[#0B1C2E] text-white py-3 rounded-full font-bold"
          >
            Retour au profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 pt-12 pb-6 shadow-sm border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-[#0B1C2E]" />
        </button>
        <h2 className="font-bold text-[#0B1C2E] text-xl">Signaler un problème</h2>
      </div>

      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-1">
            Commande {order ? `CMD-${order.id.slice(0, 8).toUpperCase()}` : orderId || 'Inconnue'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {order?.items?.[0]?.product?.title || 'Chargement des détails...'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#0B1C2E] mb-2">Motif du litige</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B91C1C]"
              >
                <option value="NOT_RECEIVED">Article non reçu</option>
                <option value="DEFECTIVE">Article défectueux</option>
                <option value="NOT_AS_DESCRIBED">Ne correspond pas à la description</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0B1C2E] mb-2">Détails (Optionnel)</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez le problème en détail..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B91C1C] resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#B91C1C] text-white py-4 rounded-full font-bold shadow-md hover:bg-[#c41530] transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Ouvrir le litige'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
