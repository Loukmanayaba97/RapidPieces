import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Info } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("=== SIMULATION ENVOI EMAIL CONTACT (NODEMAILER) ===");
    console.log("To: admin@rapidpieces.ci");
    console.log(`Subject: ✉️ Nouveau message de contact : ${data.subject}`);
    console.log("Body:");
    console.log(`- De : ${user?.name} (${user?.email})`);
    console.log(`- Type d'utilisateur : ${user?.role}`);
    console.log(`- Sujet : ${data.subject}`);
    console.log(`- Message : \n${data.message}`);
    console.log("==================================================");

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      form.reset();
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 pb-24 items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-[#0B1C2E] mb-2">Message envoyé !</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Votre message a été transmis à l'administration. Nous vous répondrons dans les plus brefs délais par email.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-[#0B1C2E] text-white px-8 py-3.5 rounded-full font-bold shadow-lg w-full max-w-xs transition-transform active:scale-95"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[#0B1C2E] px-6 pt-16 pb-12 rounded-b-2xl shadow-sm text-white relative">
        <div className="absolute right-4 top-12 opacity-10">
          <Mail className="w-24 h-24" />
        </div>
        <h2 className="text-2xl font-bold relative z-10">Nous Contacter</h2>
        <p className="mt-2 text-sm text-gray-300 relative z-10">L'équipe RapidPièces à votre écoute</p>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto px-6 mt-6 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 shadow-sm">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Pour le moment, les communications directes entre clients et vendeurs sont désactivées. 
            Veuillez utiliser ce formulaire pour toute question, réclamation ou assistance. L'administrateur vous répondra rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Sujet de votre demande</label>
              <select 
                name="subject"
                required
                className="w-full bg-gray-50 border border-gray-200 text-[#0B1C2E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B1C2E] font-medium"
                defaultValue=""
              >
                <option value="" disabled>Sélectionnez un sujet</option>
                <option value="Suivi de commande">Suivi de ma commande</option>
                <option value="Problème de paiement">Problème de paiement</option>
                <option value="Retour / Remboursement">Demande de retour ou remboursement</option>
                {user?.role === 'VENDOR' && <option value="Assistance Vendeur">Assistance pour mon compte Vendeur</option>}
                <option value="Signaler un abus">Signaler un abus ou litige</option>
                <option value="Autre">Autre demande</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Votre message</label>
              <textarea 
                name="message"
                required
                rows={6}
                className="w-full bg-gray-50 border border-gray-200 text-[#0B1C2E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B1C2E] resize-none"
                placeholder="Décrivez votre problème en détail afin que nous puissions vous aider efficacement..."
              ></textarea>
            </div>
            
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#B91C1C] text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 mt-4 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Envoyer le message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
