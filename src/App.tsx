import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Download,
  Eye,
  FileText,
  Flame,
  Globe,
  Instagram,
  Layers,
  Linkedin,
  MapPin,
  Maximize2,
  Menu,
  Minimize2,
  Plus,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Twitter,
  UserCheck,
  Video,
  Wand2,
  Wrench,
  X
} from 'lucide-react';
import { mockDb } from './services/mockDatabase';
import { MasterDemoWalkthrough } from './components/MasterDemoWalkthrough';
import { OverviewView } from './components/views/OverviewView';
import { DashcamView } from './components/views/DashcamView';
import { CivicVisionView } from './components/views/CivicVisionView';
import { ComplaintsView } from './components/views/ComplaintsView';
import { RegistryView } from './components/views/RegistryView';
import { CityMemoryView } from './components/views/CityMemoryView';
import { CityMapView } from './components/views/CityMapView';
import { HotspotView } from './components/views/HotspotView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { FinancialView } from './components/views/FinancialView';
import { ContractorsView } from './components/views/ContractorsView';
import { DataModelsView } from './components/views/DataModelsView';
import { SettingsView } from './components/views/SettingsView';
import heroFlowers from './assets/hero-flowers.png';

export default function App() {
  const [activeModule, setActiveModule] = useState<string>('Overview');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('asset-rd-042');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeHeroPill, setActiveHeroPill] = useState<string>('City Memory Ledger');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Subscribe to persistent database changes
  useEffect(() => {
    const unsubscribe = mockDb.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const assets = mockDb.getAssets();
  const issues = mockDb.getIssues();
  const complaints = mockDb.getComplaints();
  const contractors = mockDb.getContractors();
  const repairs = mockDb.getRepairs();
  const vehicles = mockDb.getVehicles();
  const observations = mockDb.getObservations();

  const handleNavigate = (module: string, contextId?: string) => {
    setActiveModule(module);
    if (contextId) {
      setSelectedAssetId(contextId);
    }
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroPills = ['City Memory Ledger', 'Dashcam Patrol CV', 'Failure Prediction'];

  const allModules = [
    { name: 'Overview', icon: Compass, category: 'Pillar A: Core Civic' },
    { name: 'Complaints', icon: FileText, category: 'Pillar A: Core Civic', count: complaints.length },
    { name: 'Infrastructure Registry', icon: Building2, category: 'Pillar A: Core Civic', count: assets.length },
    { name: 'City Memory', icon: ShieldAlert, category: 'Pillar A: Core Civic', badge: 'Core' },
    { name: 'City Map', icon: MapPin, category: 'Pillar A: Core Civic' },
    { name: 'Hotspot Analysis', icon: Flame, category: 'Pillar A: Core Civic', badge: 'Critical' },
    { name: 'Maintenance', icon: Wrench, category: 'Pillar A: Core Civic', count: repairs.length },
    { name: 'Financial Intelligence', icon: DollarSign, category: 'Pillar A: Core Civic' },
    { name: 'Contractor Management', icon: UserCheck, category: 'Pillar A: Core Civic', count: contractors.length },
    { name: 'Dashcam Intelligence', icon: Video, category: 'Pillar B: AI Vision', badge: 'Live CV' },
    { name: 'Civic Vision', icon: Layers, category: 'Pillar B: AI Vision' },
    { name: 'Data & Models', icon: Cpu, category: 'Pillar B: AI Vision', badge: '3 Models' },
    { name: 'Settings', icon: SettingsIcon, category: 'Platform' }
  ];

  const recurringAlertsCount = assets.reduce((sum, a) => sum + (a.recurrenceCount || 0), 0);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-black text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Background Looping Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
      />

      {/* Main Content Floating Layer */}
      <div className="relative z-10 w-full min-h-screen p-3 sm:p-5 lg:p-6 flex flex-col justify-between box-border">
        {/* Top Floating Glass Command Bar */}
        <header className="liquid-glass rounded-3xl p-3 sm:p-4 mb-4 flex items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavigate('Overview')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img
                src="/logo.png"
                alt="NagarPaalan AI"
                width={32}
                height={32}
                className="w-8 h-8 object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-lg sm:text-xl tracking-tight text-white">
                    NAGARPAALAN
                  </span>
                  <span className="text-[10px] bg-white/20 text-white font-mono px-1.5 py-0.2 rounded font-bold">
                    AI
                  </span>
                </div>
                <div className="text-[10px] text-white/60 hidden sm:block">
                  City Memory &amp; Infrastructure Failure Prediction
                </div>
              </div>
            </div>
          </div>

          {/* Center Civic Pulse Badges */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <div className="liquid-glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-white/90">City Memory: Active</span>
              <span className="text-white/30">|</span>
              <span className="text-white/60 text-[11px]">BBMP Bengaluru</span>
            </div>

            {recurringAlertsCount > 0 && (
              <button
                type="button"
                onClick={() => handleNavigate('Hotspot Analysis')}
                className="liquid-glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-rose-300 hover:text-white transition-colors cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span className="font-semibold">{recurringAlertsCount} Recurrences</span>
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/80 hover:text-white flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={isFocusMode ? 'Switch to Two-Panel Split' : 'Maximize Active Module'}
            >
              {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFocusMode ? 'Split View' : 'Focus Canvas'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <span>13 Modules</span>
              <Menu className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </header>

        {/* Master Hackathon Demo Scenario Guide (Visible across all views) */}
        <div className="mb-4">
          <MasterDemoWalkthrough
            currentStep={mockDb.demoStep}
            onNavigateToModule={handleNavigate}
          />
        </div>

        {/* Dynamic Layout: Two-Panel Split OR Focus Canvas Mode */}
        {isFocusMode ? (
          /* FULL FOCUS CANVAS MODE */
          <main className="w-full liquid-glass-strong rounded-3xl p-5 sm:p-7 space-y-6 min-h-[calc(100vh-14rem)]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFocusMode(false)}
                  className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/70 hover:text-white flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to Split View</span>
                </button>
                <h2 className="text-xl font-medium text-white">{activeModule}</h2>
              </div>

              {/* Quick Module Selector Pills */}
              <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto max-w-2xl py-1">
                {allModules.slice(0, 7).map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => handleNavigate(m.name)}
                    className={`liquid-glass rounded-full px-3 py-1 text-xs whitespace-nowrap transition-all cursor-pointer ${
                      activeModule === m.name ? 'bg-white/20 text-white font-medium' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Module Renderer in Focus Mode */}
            {renderActiveModule(
              activeModule,
              assets,
              issues,
              complaints,
              repairs,
              contractors,
              vehicles,
              observations,
              selectedAssetId,
              setSelectedAssetId,
              handleNavigate
            )}
          </main>
        ) : (
          /* TWO-PANEL SPLIT (Hero Showcase on Left + Civic Command Deck on Right) */
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full flex-1 min-h-[calc(100vh-14rem)]">
            {/* LEFT PANEL: Hero & City Memory Foundation */}
            <section
              aria-label="City Memory Showcase"
              className="w-full lg:w-[50%] liquid-glass-strong rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative min-h-[580px] lg:min-h-full"
            >
              {/* Nav */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/60 font-mono">
                    PILLAR A &amp; B
                  </span>
                  <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-mono">
                    Hackathon Architecture
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate('City Memory')}
                  className="liquid-glass rounded-full px-3.5 py-1.5 flex items-center gap-1.5 text-xs text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                  <span>City Memory Engine</span>
                </button>
              </div>

              {/* Hero Center */}
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6 lg:py-8">
                {/* Center Logo */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 mb-5 lg:mb-6 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="City Memory Icon"
                    width={80}
                    height={80}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.35)] animate-pulse"
                    style={{ animationDuration: '4s' }}
                  />
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.05em] text-white leading-[1.08] max-w-xl mx-auto">
                  Innovating the <br />
                  <span className="font-serif italic text-white/80">spirit of City Memory</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto mt-3 leading-relaxed">
                  Persistent physical infrastructure memory tracking complaints, AI dashcam observations, repairs, contractor expenditure, and recurring failure predictions.
                </p>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleNavigate('City Memory', 'asset-rd-042');
                  }}
                  className="liquid-glass-strong rounded-full px-6 py-3 flex items-center gap-3 text-sm font-medium text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer mt-6 mb-5 shadow-2xl"
                >
                  <span>Explore City Memory</span>
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                    <Download className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                {/* Three Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {heroPills.map((pill) => {
                    const isActive = activeHeroPill === pill;
                    return (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => {
                          setActiveHeroPill(pill);
                          if (pill === 'City Memory Ledger') handleNavigate('City Memory');
                          if (pill === 'Dashcam Patrol CV') handleNavigate('Dashcam Intelligence');
                          if (pill === 'Failure Prediction') handleNavigate('Hotspot Analysis');
                        }}
                        className={`liquid-glass rounded-full px-4 py-2 text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                          isActive ? 'text-white bg-white/15 font-medium' : 'text-white/80'
                        }`}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>

                {/* Civic Pulse Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-6 text-left">
                  <div className="liquid-glass rounded-2xl p-2.5">
                    <span className="text-[10px] text-white/50 block">Tracked Assets</span>
                    <span className="text-base font-mono font-bold text-white">{assets.length}</span>
                    <span className="text-[9px] text-emerald-400 block">100% Twin</span>
                  </div>

                  <div className="liquid-glass rounded-2xl p-2.5">
                    <span className="text-[10px] text-white/50 block">Recurrences</span>
                    <span className="text-base font-mono font-bold text-rose-400">{recurringAlertsCount}</span>
                    <span className="text-[9px] text-rose-300 block">Chronic Alert</span>
                  </div>

                  <div className="liquid-glass rounded-2xl p-2.5">
                    <span className="text-[10px] text-white/50 block">Complaints</span>
                    <span className="text-base font-mono font-bold text-amber-300">{complaints.length}</span>
                    <span className="text-[9px] text-white/60 block">AI Verified</span>
                  </div>

                  <div className="liquid-glass rounded-2xl p-2.5">
                    <span className="text-[10px] text-white/50 block">Repair Spend</span>
                    <span className="text-base font-mono font-bold text-white">₹153.7k</span>
                    <span className="text-[9px] text-rose-400 block">₹125.2k Leakage</span>
                  </div>
                </div>
              </div>

              {/* Bottom Visionary Quote */}
              <footer className="text-center pt-4 border-t border-white/10">
                <div className="text-[10px] tracking-widest uppercase text-white/50 mb-1 font-medium">
                  VISIONARY CIVIC DESIGN
                </div>
                <p className="text-xs sm:text-sm text-white/90">
                  <span>We imagined a </span>
                  <span className="font-serif italic text-white/80">city</span>
                  <span> with no </span>
                  <span className="font-serif italic text-white/80">recurring failures.</span>
                </p>
                <div className="flex items-center justify-center gap-3 mt-2 w-full max-w-xs mx-auto">
                  <div className="h-px bg-white/20 flex-1" />
                  <span className="text-[9px] tracking-widest uppercase text-white/50 font-medium">
                    MARCUS AURELIO • NAGARPAALAN
                  </span>
                  <div className="h-px bg-white/20 flex-1" />
                </div>
              </footer>
            </section>

            {/* RIGHT PANEL: The Active Civic Intelligence Command Deck */}
            <section
              aria-label="Civic Command Deck"
              className="w-full lg:w-[50%] flex flex-col justify-between gap-4"
            >
              {/* Top Module Tabs Bar */}
              <div className="liquid-glass rounded-3xl p-3 flex items-center justify-between gap-2 overflow-x-auto shadow-xl">
                <div className="flex items-center gap-1.5">
                  {['Overview', 'Complaints', 'City Memory', 'City Map', 'Dashcam Intelligence', 'Hotspot Analysis'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => handleNavigate(tab)}
                      className={`liquid-glass rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-all cursor-pointer ${
                        activeModule === tab
                          ? 'bg-white/20 text-white font-medium shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFocusMode(true)}
                    className="liquid-glass rounded-full p-2 text-white/80 hover:text-white hover:scale-105 transition-transform cursor-pointer"
                    title="Maximize Module View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Module Deck Viewport */}
              <div className="flex-1 liquid-glass-strong rounded-3xl p-4 sm:p-5 overflow-y-auto max-h-[820px] shadow-2xl">
                {renderActiveModule(
                  activeModule,
                  assets,
                  issues,
                  complaints,
                  repairs,
                  contractors,
                  vehicles,
                  observations,
                  selectedAssetId,
                  setSelectedAssetId,
                  handleNavigate
                )}
              </div>

              {/* Quick Feature Bottom Trio */}
              <div className="liquid-glass rounded-3xl p-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('Dashcam Intelligence')}
                  className="liquid-glass rounded-2xl p-2.5 text-left hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-1">
                    <Wand2 className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[11px] font-medium text-white truncate">Dashcam CV</div>
                  <div className="text-[9px] text-white/50">iWatchRoad 92%</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('Infrastructure Registry')}
                  className="liquid-glass rounded-2xl p-2.5 text-left hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-1">
                    <BookOpen className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[11px] font-medium text-white truncate">Twin Registry</div>
                  <div className="text-[9px] text-white/50">{assets.length} Assets</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate('Civic Vision')}
                  className="liquid-glass rounded-2xl p-2.5 text-left hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mb-1">
                    <Layers className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[11px] font-medium text-white truncate">Civic Vision</div>
                  <div className="text-[9px] text-white/50">3 AI Adapters</div>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Slide-out 13-Module Directory Drawer */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All 13 Modules Navigation"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="liquid-glass-strong rounded-3xl max-w-xl w-full p-6 lg:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="NagarPaalan" className="w-7 h-7 object-contain" />
                <div>
                  <h3 className="font-semibold text-base tracking-tight text-white">
                    All 13 Application Modules
                  </h3>
                  <p className="text-xs text-white/50">Unified civic infrastructure management</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allModules.map((m) => {
                const Icon = m.icon;
                const isActive = activeModule === m.name;

                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => handleNavigate(m.name)}
                    className={`liquid-glass rounded-2xl p-3 text-left transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-between ${
                      isActive ? 'bg-white/20 text-white font-medium' : 'text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 text-white/80 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-medium text-white truncate">{m.name}</div>
                        <div className="text-[10px] text-white/50">{m.category}</div>
                      </div>
                    </div>

                    {(m.badge || m.count !== undefined) && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/90 shrink-0">
                        {m.badge || m.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-full liquid-glass rounded-full py-2.5 text-xs font-medium text-white/80 hover:text-white hover:scale-105 transition-transform cursor-pointer"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Router helper to mount the active module with persistent store data
function renderActiveModule(
  activeModule: string,
  assets: any[],
  issues: any[],
  complaints: any[],
  repairs: any[],
  contractors: any[],
  vehicles: any[],
  observations: any[],
  selectedAssetId: string | null,
  setSelectedAssetId: (id: string) => void,
  handleNavigate: (m: string, id?: string) => void
) {
  switch (activeModule) {
    case 'Overview':
      return (
        <OverviewView
          assets={assets}
          issues={issues}
          complaints={complaints}
          repairs={repairs}
          observations={observations}
          onNavigate={handleNavigate}
        />
      );
    case 'Dashcam Intelligence':
      return (
        <DashcamView
          vehicles={vehicles}
          assets={assets}
          issues={issues}
          observations={observations}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Civic Vision':
      return (
        <CivicVisionView
          assets={assets}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Complaints':
      return (
        <ComplaintsView
          complaints={complaints}
          issues={issues}
          assets={assets}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Infrastructure Registry':
      return (
        <RegistryView
          assets={assets}
          issues={issues}
          repairs={repairs}
          onSelectAsset={(id) => setSelectedAssetId(id)}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'City Memory':
      return (
        <CityMemoryView
          assets={assets}
          issues={issues}
          complaints={complaints}
          repairs={repairs}
          observations={observations}
          selectedAssetId={selectedAssetId}
          onSelectAsset={(id) => setSelectedAssetId(id)}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'City Map':
      return (
        <CityMapView
          assets={assets}
          issues={issues}
          vehicles={vehicles}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Hotspot Analysis':
      return (
        <HotspotView
          assets={assets}
          issues={issues}
          repairs={repairs}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Maintenance':
      return (
        <MaintenanceView
          repairs={repairs}
          issues={issues}
          assets={assets}
          contractors={contractors}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Financial Intelligence':
      return (
        <FinancialView
          repairs={repairs}
          assets={assets}
          contractors={contractors}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Contractor Management':
      return (
        <ContractorsView
          contractors={contractors}
          repairs={repairs}
          assets={assets}
          onNavigateToModule={handleNavigate}
        />
      );
    case 'Data & Models':
      return <DataModelsView />;
    case 'Settings':
      return <SettingsView />;
    default:
      return (
        <OverviewView
          assets={assets}
          issues={issues}
          complaints={complaints}
          repairs={repairs}
          observations={observations}
          onNavigate={handleNavigate}
        />
      );
  }
}
