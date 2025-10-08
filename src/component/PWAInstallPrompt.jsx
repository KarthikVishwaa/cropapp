// PWAInstallPrompt.jsx
import React, { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-xl flex justify-between items-center shadow-lg z-50">
      <span>Install CropSense on your Home Screen!</span>
      <button
        onClick={handleInstall}
        className="bg-white text-green-600 font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        Install
      </button>
    </div>
  );
}
