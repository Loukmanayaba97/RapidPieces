import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'VENDOR') {
      navigate('/');
    } else {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, navigate]);

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

  const totalSales = orders
    .filter((o: any) => o.status !== 'LITIGE')
    .reduce((sum: number, o: any) => sum + o.total, 0);

  const pendingPreparation = orders
    .filter((o: any) => o.status === 'CONFIRMED')
    .length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#0B1C2E] px-6 pt-12 pb-16 text-white rounded-b-2xl shadow-sm relative">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-2xl font-bold">Tableau de Bord Vendeur</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-sm text-gray-300 font-medium mb-1">Ventes totales</p>
            <p className="text-2xl font-bold">{totalSales.toLocaleString()} <span className="text-xs">FCFA</span></p>
          </div>
          <div className="bg-[#B91C1C] rounded-xl p-4 shadow-md shadow-red-900/20">
            <p className="text-sm text-red-100 font-medium mb-1">Commandes à préparer</p>
            <p className="text-2xl font-bold">{pendingPreparation}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-[#0B1C2E] mb-4">Commandes récentes</h3>
          
          {loading ? (
             <div className="flex justify-center py-4">
               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B91C1C]"></div>
             </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">Aucune commande reçue pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[#0B1C2E] text-sm">CMD-{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className="font-bold text-[#B91C1C]">{order.total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${
                      order.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' : 
                      order.status === 'LITIGE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'CONFIRMED' ? <Clock className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      {order.status === 'CONFIRMED' ? 'À préparer' : order.status === 'LITIGE' ? 'En litige' : 'Expédiée'}
                    </span>
                    <button 
                      onClick={() => navigate(`/dispute?orderId=${order.id}`)}
                      className="text-xs font-bold text-[#B91C1C] bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100"
                    >
                      Signaler Problème
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
