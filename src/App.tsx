import { useEffect, useState } from 'react';
import { DEFAULT_SITE_CONFIG, PROMO_BACKDROP_IMAGE } from './data/defaultData';
import { PricingMode, SiteConfig } from './types/site';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PricingSection, SelectedOrder } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FeaturesDevicesSection } from './components/FeaturesDevicesSection';
import { HowItWorksAndFaq } from './components/HowItWorksAndFaq';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { CustomizeDataModal } from './components/CustomizeDataModal';
import { QuickTestModal } from './components/QuickTestModal';

const STORAGE_KEY = 'niko_streaming_site_config_v7';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migratedWhatsapp =
          !parsed.whatsappNumber || parsed.whatsappNumber === '5511999999999'
            ? DEFAULT_SITE_CONFIG.whatsappNumber
            : parsed.whatsappNumber;
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          whatsappNumber: migratedWhatsapp,
          quickTestUrl: DEFAULT_SITE_CONFIG.quickTestUrl,
        };
      }
    } catch {
      // ignore storage read errors
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [pricingMode, setPricingMode] = useState<PricingMode>('usuario');
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [quickTestOpen, setQuickTestOpen] = useState(false);
  const [quickTestPrefill, setQuickTestPrefill] = useState<{
    phone?: string;
    name?: string;
  } | null>(null);
  const [backdropFailed, setBackdropFailed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage write errors
    }
  }, [config]);

  useEffect(() => {
    const syncHashToMode = () => {
      if (window.location.hash === '#revenda') {
        setPricingMode('revenda_prepago');
        const el = document.getElementById('planos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    syncHashToMode();
    window.addEventListener('hashchange', syncHashToMode);
    return () => window.removeEventListener('hashchange', syncHashToMode);
  }, []);

  const handleOpenQuickTest = (prefill?: { phone?: string; name?: string }) => {
    setQuickTestPrefill(prefill ?? null);
    setQuickTestOpen(true);
  };

  const handleSelectResellerMode = () => {
    setPricingMode('revenda_prepago');
    const el = document.getElementById('planos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121216] text-[#F8FAFC]">
      {/* Fundo com mural de cartazes em cores naturais refletindo em todo o site */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#121216]"
      >
        {!backdropFailed && (
          <img
            src={PROMO_BACKDROP_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBackdropFailed(true)}
            className="h-full w-full object-cover object-center opacity-50 brightness-[0.65] saturate-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10">
        <Navbar config={config} onRequestTrial={handleOpenQuickTest} />

        <main>
          <HeroSection
            config={config}
            onRequestTrial={handleOpenQuickTest}
            onSelectResellerMode={handleSelectResellerMode}
          />

          <PricingSection
            config={config}
            mode={pricingMode}
            onModeChange={setPricingMode}
            onSelectOrder={setSelectedOrder}
            onRequestTrial={() => handleOpenQuickTest()}
          />

          <TestimonialsSection />

          <FeaturesDevicesSection />

          <HowItWorksAndFaq />
        </main>

        <Footer config={config} onOpenCustomize={() => setCustomizeOpen(true)} />
      </div>

      <QuickTestModal
        isOpen={quickTestOpen}
        config={config}
        initialPhone={quickTestPrefill?.phone}
        initialName={quickTestPrefill?.name}
        onClose={() => {
          setQuickTestOpen(false);
          setQuickTestPrefill(null);
        }}
      />

      <OrderModal
        order={selectedOrder}
        config={config}
        onClose={() => setSelectedOrder(null)}
        onOpenQuickTest={(prefill) => {
          setSelectedOrder(null);
          handleOpenQuickTest(prefill);
        }}
      />

      <CustomizeDataModal
        isOpen={customizeOpen}
        config={config}
        onSave={setConfig}
        onClose={() => setCustomizeOpen(false)}
      />
    </div>
  );
}
