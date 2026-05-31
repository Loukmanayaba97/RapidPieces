import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Écouter l'événement standard beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Empêcher l'affichage natif
      setDeferredPrompt(e);
      
      // Si l'utilisateur n'a pas fermé la bannière récemment, on l'affiche
      const hasDismissed = localStorage.getItem('rp_install_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Cacher notre prompt personnalisé
    setShowPrompt(false);
    
    // Afficher le prompt natif d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    // Optionnel: tracker l'issue (accepté ou refusé)
    console.log(`User installation prompt outcome: ${outcome}`);
    
    // On ne peut utiliser le prompt qu'une seule fois
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // On enregistre qu'il a refusé pour ne pas le spammer (par ex. pour 7 jours)
    localStorage.setItem('rp_install_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-4 right-4 z-[60] bg-white rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-gray-100 mx-auto max-w-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#181a20] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B1C2E] text-sm">Installer l'Application</h3>
              <p className="text-xs text-gray-500 mt-0.5">Plus rapide & hors-ligne</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleInstall}
              className="bg-[#B91C1C] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-red-500/20 active:scale-95 transition-transform"
            >
              Installer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
