import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import {
    Play,
    Globe,
    Target,
    GitBranch,
    Mail,
    CheckCircle2,
    ArrowRight,
    Menu,
    X,
    Sparkles,
    Network,
    Activity,
    Code2,
    Cpu,
    ShieldAlert,
    Sliders,
    Pause,
    RotateCcw
} from 'lucide-react';
import CleanPipelineSimulator from './Components/HowItWorks';
import { METRIC_CARDS, TIMELINE_STEPS, TOPOLOGY_NODES } from './Components/Data';
// --- APPLICATION DATA STRUCTURES ---
interface NodeItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    x: string;
    y: string;
}


const customEase = [0.16, 1, 0.3, 1];
const blockFadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: customEase } }
};

// --- SUB-COMPONENT: INTERACTIVE TOPOLOGY GRAPH LINK SYSTEM ---
const InteractiveTopologyCanvas: React.FC = () => {
    const [activeId, setActiveId] = useState('start');

    useEffect(() => {
        const sequence = ['start', 'browser', 'extract', 'condition', 'email', 'done'];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % sequence.length;
            setActiveId(sequence[idx]);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full aspect-[4/3] min-h-[420px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-6 shadow-xs flex flex-col justify-between">
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

            <div className="flex items-center justify-between border-b border-slate-200 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-[11px] text-slate-500 font-medium tracking-tight">topology_orchestrator</span>
                </div>
                <span className="font-mono text-[10px] text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                    Live Instance
                </span>
            </div>

            <div className="relative flex-1 grid grid-cols-4 grid-rows-4 gap-4 items-center justify-items-center py-6 my-auto">
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 12 25 L 37 25 L 37 75 L 62 75 L 87 50 M 62 75 L 87 100"
                        fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
                </svg>

                {TOPOLOGY_NODES.map((node) => {
                    const Icon = node.icon;
                    const isActive = node.id === activeId;

                    return (
                        <div key={node.id} className={`${node.x} ${node.y} relative w-full flex flex-col items-center justify-center z-10`}>
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.08 : 1,
                                    borderColor: isActive ? '#2563eb' : '#cbd5e1'
                                }}
                                transition={{ duration: 0.3, ease: customEase }}
                                className={`w-12 h-12 rounded-xl border flex items-center justify-center relative transition-all shadow-xs ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full">
                                        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75" />
                                    </span>
                                )}
                            </motion.div>

                            <span className={`mt-2 font-mono text-[10px] tracking-tight whitespace-nowrap px-2 py-0.5 rounded transition-all ${isActive ? 'font-medium text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-400'
                                }`}>
                                {node.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 font-mono text-[10px] text-slate-400 z-10">
                <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    1,420 operations / sec
                </span>
                <span>Isolated Topology</span>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: FULLY INTERACTIVE TIMELINE ANIMATOR ---
const ScrollDrivenTimeline: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % TIMELINE_STEPS.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const percentageWidth = `${(currentIndex / (TIMELINE_STEPS.length - 1)) * 100}%`;

    return (
        <div className="w-full relative py-6">
            {/* Dynamic Interactive Timeline Top Control Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight font-mono transition-all ${isAutoPlaying
                            ? 'bg-amber-50 border border-amber-200 text-amber-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                            }`}
                    >
                        {isAutoPlaying ? (
                            <>
                                <Pause className="w-3.5 h-3.5" /> Pause Engine
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5 fill-current" /> Run Live Pipeline
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => { setCurrentIndex(0); setIsAutoPlaying(false); }}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Reset Pipeline"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-md">
                    <span className="font-mono text-[10px] text-slate-400 font-medium">NODE_0{currentIndex + 1}</span>
                    <input
                        type="range"
                        min="0"
                        max={TIMELINE_STEPS.length - 1}
                        value={currentIndex}
                        onChange={(e) => {
                            setCurrentIndex(parseInt(e.target.value));
                            setIsAutoPlaying(false);
                        }}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="font-mono text-[10px] text-slate-400 font-medium">06</span>
                </div>
            </div>

            <div className="relative w-full mb-12">
                <div className="absolute top-[164px] left-0 w-full h-[2px] bg-slate-100 z-0 hidden lg:block" />

                {/* Animated Fill bar connecting the active state steps */}
                <motion.div
                    animate={{ width: percentageWidth }}
                    transition={{ duration: 0.4, ease: customEase }}
                    className="absolute top-[164px] left-0 h-[2px] bg-blue-600 z-10 hidden lg:block origin-left"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 relative z-20">
                    {TIMELINE_STEPS.map((step, idx) => {
                        const isActive = idx === currentIndex;
                        const isCompleted = idx < currentIndex;

                        return (
                            <button
                                key={step.step}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setIsAutoPlaying(false);
                                }}
                                className="flex flex-col items-center lg:items-start text-left w-full group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                            >
                                <div className="mb-6 min-h-[72px] text-center lg:text-left pointer-events-none w-full">
                                    <div className={`font-mono text-xs font-bold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-300'}`}>
                                        {step.step}
                                    </div>
                                    <h3 className={`text-base font-semibold mt-1 transition-colors duration-300 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400 font-normal'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-light leading-relaxed mt-1.5 max-w-[200px] mx-auto lg:mx-0">
                                        {step.desc}
                                    </p>
                                </div>

                                <div className={`h-44 w-full max-w-[200px] mx-auto bg-slate-50 border rounded-xl p-4 flex flex-col justify-between items-center relative transition-all duration-300 shadow-xs ${isActive ? 'border-blue-300 bg-blue-50/20 shadow-xs ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                                    }`}>

                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-white ${isActive ? 'border-blue-600 shadow-md' : isCompleted ? 'border-slate-300 bg-slate-100' : 'border-slate-200'
                                        }`}>
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isActive ? 'bg-blue-600 scale-110' : isCompleted ? 'bg-slate-400' : 'bg-transparent'
                                            }`} />
                                    </div>

                                    <div className="flex-1 w-full flex flex-col justify-center items-center font-mono text-[10px] mt-2 text-center pointer-events-none">

                                        {idx === 0 && (
                                            <motion.div animate={{ opacity: isActive || isCompleted ? 1 : 0.4 }} className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-slate-700">
                                                ▶ Start Node
                                            </motion.div>
                                        )}

                                        {idx === 1 && (
                                            <div className="space-y-1 w-full text-center">
                                                <div className="bg-white border border-slate-200 px-1.5 py-0.5 rounded inline-block text-slate-400 text-[9px]">Start</div>
                                                <div className="text-slate-300 text-[9px]">↓</div>
                                                <motion.div animate={(isActive || isCompleted) ? { y: 0, opacity: 1 } : { y: 4, opacity: 0.3 }} className="bg-white border border-blue-600 px-1.5 py-0.5 rounded inline-block text-blue-600 font-medium">
                                                    Browser
                                                </motion.div>
                                            </div>
                                        )}

                                        {idx === 2 && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-400">● ──</span>
                                                <motion.span animate={isActive ? { x: [0, 6, 0] } : {}} transition={{ repeat: Infinity, duration: 1.2 }} className="text-blue-600 font-bold">▶</motion.span>
                                                <span className={`px-1.5 py-0.5 border rounded ${isActive ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}>
                                                    {isActive ? 'Loading...' : 'Browser'}
                                                </span>
                                            </div>
                                        )}

                                        {idx === 3 && (
                                            <div className="space-y-1 text-[9px]">
                                                <div className="text-slate-400 line-through">Amazon DOM</div>
                                                <div className="text-slate-300">↓</div>
                                                <motion.div animate={isActive ? { scale: [1, 1.04, 1] } : {}} className="bg-blue-600 text-white font-medium px-2 py-0.5 rounded shadow-sm">
                                                    ₹24,999
                                                </motion.div>
                                            </div>
                                        )}

                                        {idx === 4 && (
                                            <div className="space-y-1">
                                                <div className="text-slate-400 text-[9px]">24999 &lt; 50000</div>
                                                <motion.div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-bold">
                                                    ✓ TRUE
                                                </motion.div>
                                            </div>
                                        )}

                                        {idx === 5 && (
                                            <div className="text-center space-y-1">
                                                <span className="text-[9px] text-slate-400 block">Dispatch Notification</span>
                                                <motion.span className="text-blue-600 font-bold text-[10px] block">
                                                    {isActive ? '⚡ Sent' : '✓ End Complete'}
                                                </motion.span>
                                            </div>
                                        )}

                                    </div>

                                    <div className="w-full text-center text-[9px] font-mono text-slate-300 mt-2 border-t border-slate-100 pt-1.5">
                                        {step.nodeLabel}
                                    </div>

                                </div>

                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// --- MAIN ARCHITECTURE INTERFACE SYSTEM ---
export default function ThirdEyeSystemInterface() {
    const [currentPage, setCurrentPage] = useState<'home' | 'features' | 'console'>('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 12);
    });

    const handleNavigation = (page: 'home' | 'features' | 'console') => {
        setCurrentPage(page);
        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">

            {/* ---------- UNIFIED NAVIGATION BAR ---------- */}
            <header className={`fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md transition-all duration-300 border-b ${isScrolled ? 'border-slate-100 h-16' : 'border-transparent h-20'
                }`}>
                <div className="max-w-[1200px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
                    <button onClick={() => handleNavigation('home')} className="font-semibold text-lg tracking-tight text-slate-900 flex items-center gap-2 transition-opacity hover:opacity-80">
                        ThirdEye<span className="w-2 h-2 rounded-full bg-blue-600" />
                    </button>

                    <nav className="hidden md:flex items-center gap-10 text-xs font-medium tracking-tight">
                        <button
                            onClick={() => handleNavigation('home')}
                            className={`transition-colors ${currentPage === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => handleNavigation('features')}
                            className={`transition-colors ${currentPage === 'features' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            Core Engine
                        </button>
                        <button
                            onClick={() => handleNavigation('console')}
                            className={`transition-colors ${currentPage === 'console' ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            Dev Console
                        </button>
                    </nav>

                    <div className="hidden md:flex items-center">
                        <button
                            onClick={() => handleNavigation('console')}
                            className="inline-flex items-center bg-blue-600 text-white text-xs font-medium rounded-xl px-5 py-2.5 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-sm tracking-tight"
                        >
                            Launch Platform
                        </button>
                    </div>

                    <button
                        className="md:hidden flex w-10 h-10 items-center justify-center text-slate-800"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* MOBILE INTERFACE OVERLAY */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 overflow-hidden shadow-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: customEase }}
                        >
                            <div className="px-6 py-6 flex flex-col gap-4 text-sm font-medium">
                                <button onClick={() => handleNavigation('home')} className="text-left py-2 text-slate-600 hover:text-blue-600">Overview</button>
                                <button onClick={() => handleNavigation('features')} className="text-left py-2 text-slate-600 hover:text-blue-600">Core Engine</button>
                                <button onClick={() => handleNavigation('console')} className="text-left py-2 text-slate-600 hover:text-blue-600">Dev Console</button>
                                <div className="h-[1px] bg-slate-100 my-1" />
                                <button onClick={() => handleNavigation('console')} className="w-full text-center bg-blue-600 text-white py-3 rounded-xl">
                                    Launch Platform
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ---------- CONTENT CANVAS SWITCHER ---------- */}
            <main className="pt-20">
                <AnimatePresence mode="wait">

                    {/* PAGE 1: OVERVIEW PAGE */}
                    {currentPage === 'home' && (
                        <motion.div key="home-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                            {/* HERO STRUCTURAL MAP */}
                            <section className="bg-white py-16 md:py-24 border-b border-slate-100">
                                <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                                    <motion.div className="lg:col-span-5 max-w-[480px]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: customEase }}>
                                        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-6">
                                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-700">Topology Architecture</span>
                                        </div>
                                        <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-[1.02] text-slate-900">
                                            Automate the open web, <span className="font-semibold text-blue-600">cleanly.</span>
                                        </h1>
                                        <p className="mt-5 text-[15px] leading-relaxed text-slate-400 font-light">
                                            Map visual graphs, monitor live executions, and pipe isolated sessions straight into structured schemas with absolute runtime stability.
                                        </p>
                                        <div className="mt-8">
                                            <button onClick={() => handleNavigation('console')} className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-medium rounded-xl px-5 py-3 hover:bg-blue-700 transition-all group shadow-sm">
                                                Build execution tree
                                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                    <motion.div className="lg:col-span-7 w-full max-wxl lg:max-w-none mx-auto" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: customEase, delay: 0.1 }}>
                                        <InteractiveTopologyCanvas />
                                    </motion.div>
                                </div>
                            </section>
                            <CleanPipelineSimulator />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ---------- FOOTER ACCENT METRICS ---------- */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="font-sans font-semibold text-slate-900">ThirdEye</span>
                        <span className="text-slate-300">|</span>
                        <span>Platform Framework v2.0.4</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => handleNavigation('home')} className="hover:text-blue-600">Overview</button>
                        <button onClick={() => handleNavigation('features')} className="hover:text-blue-600">Engine</button>
                        <button onClick={() => handleNavigation('console')} className="hover:text-blue-600">Console</button>
                    </div>
                    <span>© 2026 ThirdEye. Core System Verified.</span>
                </div>
            </footer>

        </div>
    );
}