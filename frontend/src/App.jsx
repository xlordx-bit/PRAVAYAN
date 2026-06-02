import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Network, 
  Leaf, 
  ArrowRight, 
  X, 
  Activity, 
  Cpu, 
  Compass, 
  Database,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import FlowVisualizer from './components/FlowVisualizer';

// Helper Component for Roll-up Counter Animation
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * end);
      setCount(current);
      countRef.current = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  // Format count with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\w))/g, ",");
  };

  return <span>{formatNumber(count)}{suffix}</span>;
}

export default function App() {
  // UI states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  
  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Telemetry simulation state
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('logs');
  
  // Card cursor spotlight glow coordinates
  const cardRefs = [useRef(null), useRef(null), useRef(null)];

  const handleMouseMove = (e, index) => {
    const card = cardRefs[index].current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Generate simulated telemetry data on interval when sidebar is open
  useEffect(() => {
    if (!isTelemetryOpen) return;

    // Initial logs
    const initialLogs = [
      { id: 1, time: '11:06:50', device: 'Node-12 (Tucson)', status: 'Active', val: 'AQI: 42 (Good)' },
      { id: 2, time: '11:06:51', device: 'Node-04 (Phoenix)', status: 'Active', val: 'Temp: 28.4°C' },
      { id: 3, time: '11:06:52', device: 'Node-28 (Tempe)', status: 'Active', val: 'Humidity: 32%' },
    ];
    setTelemetryLogs(initialLogs);

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const nodes = [
        { name: 'Node-01 (Flagstaff)', type: 'Temp', unit: '°C', min: 14, max: 22 },
        { name: 'Node-12 (Tucson)', type: 'AQI', unit: '', min: 35, max: 55 },
        { name: 'Node-19 (Mesa)', type: 'CO2', unit: ' ppm', min: 380, max: 420 },
        { name: 'Node-28 (Tempe)', type: 'Humidity', unit: '%', min: 25, max: 40 },
        { name: 'Node-42 (Scottsdale)', type: 'Wind', unit: ' km/h', min: 5, max: 18 },
      ];
      
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const randomValue = (Math.random() * (randomNode.max - randomNode.min) + randomNode.min).toFixed(1);
      
      const newLog = {
        id: Date.now(),
        time,
        device: randomNode.name,
        status: Math.random() > 0.05 ? 'Active' : 'Warning',
        val: `${randomNode.type}: ${randomValue}${randomNode.unit}`
      };

      setTelemetryLogs(prev => [newLog, ...prev.slice(0, 14)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isTelemetryOpen]);

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }
    
    // Simple mock authentication success
    setLoginError('');
    setLoginSuccess(true);
    setTimeout(() => {
      setIsLoginOpen(false);
      setLoginSuccess(false);
      setEmail('');
      setPassword('');
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-[#fbfaff] overflow-hidden flex flex-col font-sans">
      
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-200/30 blur-[120px] pointer-events-none animate-float-medium" />
      
      {/* --- HEADER --- */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center group cursor-pointer">
          {/* Animated Purple Gradient Logo */}
          <div className="relative flex items-center justify-center mr-2.5">
            <svg className="w-9 h-9 transition-transform duration-500 group-hover:rotate-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 14C8 10 12 10 16 14C20 18 24 18 28 14" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M4 20C8 16 12 16 16 20C20 24 24 24 28 20" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.75" />
              <path d="M4 8C8 4 12 4 16 8C20 12 24 12 28 8" stroke="url(#logo-grad)" strokeWidth="3.5" strokeLinecap="round" strokeOpacity="0.45" />
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Pravayan
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-9">
          <a href="#about" className="text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-250">
            About Us
          </a>
          <a href="#events" className="text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-250">
            Events Portal
          </a>
          <a href="#impact" className="text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-250">
            Our Impact
          </a>
          <button 
            onClick={() => setIsTelemetryOpen(true)}
            className="group flex items-center space-x-2 text-[15px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-250"
          >
            <span>Live Telemetry Data</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </button>
        </nav>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="relative px-6 py-2.5 rounded-xl border border-indigo-600/35 text-[13px] font-bold tracking-wider text-indigo-700 hover:text-white bg-transparent overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-indigo-600 before:-z-10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300 z-0"
          >
            LOGIN
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-0">
        
        {/* Left: Heading & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left max-w-xl">
          <h1 className="text-[44px] sm:text-[54px] lg:text-[62px] font-extrabold tracking-tight text-slate-900 leading-[1.08] select-none">
            SENSING<br />
            INFRASTRUCTURE.<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              EMPOWERING<br />
              COMMUNITIES.
            </span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
            Our mission is to discover Arizona's 1st-martian advanced environmental technology and master AI digital twins.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* View Active Campaigns button */}
            <button 
              onClick={() => setIsTelemetryOpen(true)}
              className="group flex items-center justify-center space-x-2 bg-indigo-600 text-white font-semibold text-sm px-7 py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/35 transition-all duration-200"
            >
              <span>View Active Campaigns</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Explore Live Maps button */}
            <button 
              onClick={() => setIsTelemetryOpen(true)}
              className="group flex items-center justify-center space-x-2 bg-white text-indigo-700 border border-indigo-600/20 font-semibold text-sm px-7 py-4 rounded-xl hover:bg-slate-50 hover:border-indigo-600/40 hover:shadow-md transition-all duration-200"
            >
              <span>Explore Live Maps</span>
              <ArrowRight className="w-4 h-4 text-indigo-500 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right: Isometric Flow Visualizer Graphic */}
        <div className="lg:col-span-6 w-full relative">
          <FlowVisualizer />
        </div>
      </main>

      {/* --- METRICS FOOTER CARDS --- */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 pb-16 pt-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Field Operations */}
          <div
            ref={cardRefs[0]}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            className="group relative rounded-2xl border border-white/40 bg-white/55 backdrop-blur-md p-7 text-left hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-lg shadow-slate-100/40 hover:shadow-xl hover:shadow-indigo-100/50"
            style={{
              background: 'radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent 40%)',
              backgroundColor: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            <div className="flex items-start space-x-5">
              {/* Icon Container */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                <Calendar className="w-6 h-6 transition-all duration-300 group-hover:rotate-6 group-hover:stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-indigo-600 uppercase">
                  Field Operations
                </span>
                <h3 className="text-[28px] font-extrabold text-slate-900 mt-1 mb-2 leading-none">
                  <AnimatedCounter end={14} suffix="+" /> Events
                </h3>
                <p className="text-[13px] text-slate-500 font-normal leading-relaxed">
                  Events and deployments in advanced environmental technology.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Active Infrastructure */}
          <div
            ref={cardRefs[1]}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            className="group relative rounded-2xl border border-white/40 bg-white/55 backdrop-blur-md p-7 text-left hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-lg shadow-slate-100/40 hover:shadow-xl hover:shadow-indigo-100/50"
            style={{
              background: 'radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(124, 58, 237, 0.08), transparent 40%)',
              backgroundColor: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            <div className="flex items-start space-x-5">
              {/* Icon Container */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 transition-transform duration-300 group-hover:scale-110">
                <Network className="w-6 h-6 transition-all duration-300 group-hover:rotate-12 group-hover:stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-purple-600 uppercase">
                  Active Infrastructure
                </span>
                <h3 className="text-[28px] font-extrabold text-slate-900 mt-1 mb-2 leading-none">
                  <AnimatedCounter end={42} /> Nodes
                </h3>
                <p className="text-[13px] text-slate-500 font-normal leading-relaxed">
                  Sensor nodes deployed across municipal telemetry grids.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Ecological Impact */}
          <div
            ref={cardRefs[2]}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            className="group relative rounded-2xl border border-white/40 bg-white/55 backdrop-blur-md p-7 text-left hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-lg shadow-slate-100/40 hover:shadow-xl hover:shadow-indigo-100/50"
            style={{
              background: 'radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(236, 72, 153, 0.08), transparent 40%)',
              backgroundColor: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            <div className="flex items-start space-x-5">
              {/* Icon Container */}
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 transition-transform duration-300 group-hover:scale-110">
                <Leaf className="w-6 h-6 transition-all duration-300 group-hover:-rotate-12 group-hover:stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-wider text-pink-600 uppercase">
                  Ecological Impact
                </span>
                <h3 className="text-[28px] font-extrabold text-slate-900 mt-1 mb-2 leading-none">
                  <AnimatedCounter end={2800} suffix="+" /> Kg
                </h3>
                <p className="text-[13px] text-slate-500 font-normal leading-relaxed">
                  CO2 offset and particulate matter filtered from municipal environments.
                </p>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* --- TELEMETRY SLIDE-OVER DASHBOARD DRAWER --- */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-500 ${isTelemetryOpen ? 'visible' : 'invisible'}`}
        aria-labelledby="slide-over-title" 
        role="dialog" 
        aria-modal="true"
      >
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-500 ${isTelemetryOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsTelemetryOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div 
            className={`w-screen max-w-md transform transition-transform duration-500 ease-in-out bg-white shadow-2xl flex flex-col justify-between ${isTelemetryOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <h2 className="text-lg font-bold text-slate-900" id="slide-over-title">
                  Live Telemetry Stream
                </h2>
              </div>
              <button 
                onClick={() => setIsTelemetryOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-100 bg-white">
              <button 
                onClick={() => setActiveTelemetryTab('logs')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTelemetryTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Activity Logs
              </button>
              <button 
                onClick={() => setActiveTelemetryTab('stats')}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTelemetryTab === 'stats' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Infrastructure Stats
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50/50">
              {activeTelemetryTab === 'logs' ? (
                <div className="space-y-3 mt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Real-time incoming packets</div>
                  {telemetryLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs transition-all hover:border-indigo-200/60 animate-[slideIn_0.2s_ease-out]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-md">
                          {log.time}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          log.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-bold text-slate-800">{log.device}</div>
                      <div className="mt-1 text-xs text-slate-500 flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{log.val}</span>
                      </div>
                    </div>
                  ))}
                  
                  {telemetryLogs.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      Connecting to telemetry node cluster...
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Cluster Performance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3.5 rounded-xl text-left">
                        <div className="text-xs text-slate-500 font-semibold flex items-center">
                          <Cpu className="w-4 h-4 text-purple-500 mr-1.5" /> CPU Load
                        </div>
                        <div className="text-xl font-extrabold text-slate-800 mt-1">12.4 %</div>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl text-left">
                        <div className="text-xs text-slate-500 font-semibold flex items-center">
                          <Database className="w-4 h-4 text-indigo-500 mr-1.5" /> Memory
                        </div>
                        <div className="text-xl font-extrabold text-slate-800 mt-1">4.2 GB</div>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl text-left col-span-2">
                        <div className="text-xs text-slate-500 font-semibold flex items-center">
                          <Compass className="w-4 h-4 text-pink-500 mr-1.5" /> Active Satellites
                        </div>
                        <div className="text-xl font-extrabold text-slate-800 mt-1">3 Mars-Orbit Links</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Diagnostic Status</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                          <span>Bandwidth Utilization</span>
                          <span>76%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '76%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-600 font-bold mb-1">
                          <span>Sensor Battery Health</span>
                          <span>94%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-white">
              <button 
                onClick={() => {
                  setIsTelemetryOpen(false);
                  setIsLoginOpen(true);
                }}
                className="w-full bg-slate-900 text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Authenticate Live Access
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PREMIUM LOGIN MODAL --- */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isLoginOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsLoginOpen(false)}
        />
        
        {/* Card */}
        <div className={`relative bg-white rounded-3xl w-full max-w-[420px] p-8 shadow-2xl mx-4 z-10 transform transition-all duration-300 ${isLoginOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
          <button 
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Heading */}
          <div className="text-center mt-2 mb-6">
            <h3 className="text-2xl font-black text-slate-900">
              Welcome back
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter credentials to access Martian Environmental Portal
            </p>
          </div>

          {loginSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Access Granted</h4>
                <p className="text-xs text-slate-500 mt-1">Redirecting you to telemetry portal...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl p-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email field */}
              <div className="relative">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@pravayan.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-slate-50/50 hover:bg-slate-50/80 transition-colors"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Security Passkey
                  </label>
                  <a href="#forgot" className="text-[10px] font-bold text-indigo-600 hover:underline">
                    Forgot key?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 bg-slate-50/50 hover:bg-slate-50/80 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold text-sm py-3.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 transition-all mt-2"
              >
                Authenticate Portal
              </button>

              <div className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                Protected by Pravayan Security Protocol v10.4.
                Unauthorized entry is logged under Martian Code Sec-4.
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
