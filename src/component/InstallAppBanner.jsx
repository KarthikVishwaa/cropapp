import { useEffect, useState } from "react";

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]
      bg-green-700 text-white px-4 py-3
      flex items-center justify-between shadow-lg">
      
      <span className="text-sm font-medium">
        Install Crop Sense App for quick access
      </span>

      <button
        onClick={handleInstall}
        className="bg-white text-green-700
        px-3 py-1 rounded-md font-semibold"
      >
        Install
      </button>
    </div>
  );
}
