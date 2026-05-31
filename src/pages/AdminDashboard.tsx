import { useState, useEffect } from 'react';
import { 
  LogOut, LayoutDashboard, Package, Users, Settings, 
  ShoppingBag, Image as ImageIcon, Palette, ChevronRight, Activity, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Lun', revenue: 450000 },
  { name: 'Mar', revenue: 380000 },
  { name: 'Mer', revenue: 520000 },
  { name: 'Jeu', revenue: 490000 },
  { name: 'Ven', revenue: 610000 },
  { name: 'Sam', revenue: 750000 },
  { name: 'Dim', revenue: 820000 },
];

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STOCK' | 'CONTENT' | 'ORDERS' | 'REQUESTS'>('OVERVIEW');
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    // Fetch requests
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data.requests || []);
        setRequestsLoading(false);
      })
      .catch(console.error);

    // Fetch orders
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setOrdersLoading(false);
      })
      .catch(console.error);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Admin */}
      <div className="bg-[#0B1C2E] px-6 pt-12 pb-6 rounded-b-3xl shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Console Admin</h2>
            <p className="text-gray-400 text-sm mt-1">Super Administrateur</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'OVERVIEW', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'STOCK', label: 'Mon Stock', icon: Package },
            { id: 'ORDERS', label: 'Gérer', icon: Users },
            { id: 'REQUESTS', label: 'Demandes', icon: Package },
            { id: 'CONTENT', label: 'Apparence', icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#B91C1C] text-white shadow-md' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 mt-6">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-medium text-sm">Ventes</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#0B1C2E]">2.4M <span className="text-sm">FCFA</span></div>
                <p className="text-xs text-emerald-600 font-medium mt-1">+15% ce mois</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-medium text-sm">Visites</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#0B1C2E]">12.5K</div>
                <p className="text-xs text-blue-600 font-medium mt-1">Activité stable</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0B1C2E] mb-4">Revenus (7 derniers jours)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <Line type="monotone" dataKey="revenue" stroke="#B91C1C" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#B91C1C' }} />
                    <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} tickFormatter={(val) => `${val / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0B1C2E' }}
                      formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Revenus']}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0B1C2E] mb-4">Demandes de pièces par jour</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Lun', requests: 12 },
                    { name: 'Mar', requests: 19 },
                    { name: 'Mer', requests: 15 },
                    { name: 'Jeu', requests: 22 },
                    { name: 'Ven', requests: 28 },
                    { name: 'Sam', requests: 35 },
                    { name: 'Dim', requests: 20 },
                  ]} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <Line type="monotone" dataKey="requests" stroke="#0B1C2E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#0B1C2E' }} />
                    <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0B1C2E' }}
                      formatter={(value: number) => [`${value}`, 'Demandes']}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0B1C2E] mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/add-product')}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <Package className="w-6 h-6 text-gray-600" />
                  <span className="text-xs font-bold text-[#0B1C2E]">Ajouter Produit</span>
                </button>
                <button 
                  onClick={() => setActiveTab('CONTENT')}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <ImageIcon className="w-6 h-6 text-gray-600" />
                  <span className="text-xs font-bold text-[#0B1C2E]">Slider Promo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'STOCK' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div>
                <h3 className="font-bold text-[#0B1C2E]">Magasin Central (Admin)</h3>
                <p className="text-xs text-gray-500">Gérez votre stock direct</p>
              </div>
              <button 
                onClick={() => navigate('/add-product')}
                className="bg-[#0B1C2E] text-white px-4 py-2 rounded-full text-xs font-bold"
              >
                + Ajouter
              </button>
            </div>

            {/* Simulated Admin Stock */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=200" alt="Part" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-[#0B1C2E]">Pièce Performance Pro {i}</h4>
                  <p className="text-xs text-gray-500 mt-1">Stock: 45 unités</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#B91C1C] text-sm">45.000F</p>
                  <button className="text-xs text-blue-600 font-medium mt-1">Modifier</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-blue-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0B1C2E]" />
                  <h3 className="font-bold text-[#0B1C2E]">Toutes les commandes</h3>
                </div>
                <span className="bg-[#B91C1C] text-white px-2 py-1 rounded-full text-xs font-bold">
                  {orders.length} Totales
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[#0B1C2E]">Dernières Commandes</h3>
              
              {ordersLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B91C1C]"></div>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm">Aucune commande.</p>
              ) : (
                orders.map((order: any) => (
                  <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#0B1C2E]">CMD-{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          order.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'LITIGE' ? 'bg-red-100 text-red-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status === 'CONFIRMED' ? 'À préparer' : order.status === 'LITIGE' ? 'En litige' : 'Livré'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.buyer?.name || 'Client'} • {order.total.toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs text-gray-400 mb-2">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <select
                        className="text-xs text-blue-600 bg-transparent border-0 font-bold focus:ring-0 focus:outline-none cursor-pointer"
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await fetch(`/api/orders/${order.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            });
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <option value="CONFIRMED">À préparer</option>
                        <option value="SHIPPED">Expédiée</option>
                        <option value="DELIVERED">Livrée</option>
                        <option value="LITIGE">Litige</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0B1C2E]" />
                  <h3 className="font-bold text-[#0B1C2E]">Utilisateurs & Vendeurs</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#0B1C2E]" />
                  <h3 className="font-bold text-[#0B1C2E]">Paramètres globaux</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'REQUESTS' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div>
                <h3 className="font-bold text-[#0B1C2E]">Demandes Spécifiques</h3>
                <p className="text-xs text-gray-500">Pièces recherchées par les clients</p>
              </div>
              <span className="bg-[#B91C1C] text-white px-2.5 py-1 rounded-full text-xs font-bold">
                {requests.filter(r => r.status === 'En attente').length} Nouvelles
              </span>
            </div>

            {requestsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B91C1C]"></div>
              </div>
            ) : requests.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">Aucune demande soumise.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                        req.status === 'En attente' ? 'bg-orange-100 text-orange-700' : 
                        req.status === 'En recherche' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {req.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {req.imageUrl && (
                      <button 
                        onClick={() => window.open(req.imageUrl, '_blank')}
                        className="text-xs font-bold text-[#B91C1C] underline"
                      >
                        Voir la photo
                      </button>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-sm text-[#0B1C2E] mb-2">{req.partName}</h4>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                    <p><span className="text-gray-500">Client:</span> {req.fullName}</p>
                    <p><span className="text-gray-500">Contact:</span> {req.phone}</p>
                    <p><span className="text-gray-500">Véhicule:</span> {req.vehicle}</p>
                    {req.chassis && <p><span className="text-gray-500">Châssis:</span> {req.chassis}</p>}
                    {req.description && <p><span className="text-gray-500">Description:</span> {req.description}</p>}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <select 
                      className="flex-1 bg-white border border-gray-200 text-[#0B1C2E] py-2 px-2 rounded-lg text-xs font-bold focus:outline-none"
                      value={req.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await fetch(`/api/requests/${req.id}/status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus })
                          });
                          setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En recherche">En recherche</option>
                      <option value="Trouvé">Trouvé</option>
                    </select>
                    <a 
                      href={`tel:${req.phone}`}
                      className="flex-1 bg-[#0B1C2E] text-white py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center"
                    >
                      Contacter
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'CONTENT' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0B1C2E] mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gérer les Bannières (Promo)
              </h3>
              <p className="text-sm text-gray-500 mb-4">Modifiez les images défilantes de l'accueil.</p>
              <button className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50">
                <span className="text-sm font-bold text-[#0B1C2E]">+ Ajouter une bannière</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#0B1C2E] mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Apparence & Couleurs
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-2">Couleur Principale (Dark Blue)</label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#0B1C2E] ring-2 ring-offset-2 ring-[#0B1C2E]"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-900 border border-gray-200 cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-gray-200 cursor-pointer"></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-2">Couleur Secondaire (Rouge)</label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#B91C1C] ring-2 ring-offset-2 ring-[#B91C1C]"></div>
                    <div className="w-10 h-10 rounded-full bg-orange-600 border border-gray-200 cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-emerald-600 border border-gray-200 cursor-pointer"></div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-[#0B1C2E] text-white py-3 rounded-full text-sm font-bold">
                  Enregistrer les styles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
