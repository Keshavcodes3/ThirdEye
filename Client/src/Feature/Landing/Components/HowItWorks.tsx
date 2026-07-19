import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Zap,
    Filter,
    MessageSquare,
    Table2,
    CheckCircle2,
    Plus,
    ChevronDown
} from 'lucide-react';

const BLUE = '#2F6FED';
const BLUE_SOFT = '#EAF1FF';
const GREEN = '#12B76A';
const NODE_W = 208;
const NODE_H = 64;

const INITIAL_NODES = [
    { id: 'trigger', title: 'New order received', subtitle: 'Trigger · Webhook', icon: Zap, type: 'trigger', x: 20, y: 150 },
    { id: 'filter', title: 'Order total > $50', subtitle: 'Filter', icon: Filter, type: 'filter', x: 288, y: 150 },
    { id: 'slack', title: 'Send Slack alert', subtitle: 'Action · Slack', icon: MessageSquare, type: 'action', x: 556, y: 32 },
    { id: 'sheet', title: 'Add row to sheet', subtitle: 'Action · Sheets', icon: Table2, type: 'action', x: 556, y: 268 },
    { id: 'done', title: 'Mark as processed', subtitle: 'Action · CRM', icon: CheckCircle2, type: 'action', x: 824, y: 150 }
];

const EDGES = [
    { from: 'trigger', to: 'filter' },
    { from: 'filter', to: 'slack', label: 'Yes' },
    { from: 'filter', to: 'sheet', label: 'No' },
    { from: 'slack', to: 'done' },
    { from: 'sheet', to: 'done' }
];

function portOut(n) {
    return { x: n.x + NODE_W, y: n.y + NODE_H / 2 };
}
function portIn(n) {
    return { x: n.x, y: n.y + NODE_H / 2 };
}

export default function WorkflowBuilder() {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [selectedId, setSelectedId] = useState('trigger');
    const [active, setActive] = useState(true);
    const draggingId = useRef(null);
    const dragOffset = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const onNodeMouseDown = (e, id) => {
        const rect = containerRef.current.getBoundingClientRect();
        const node = nodes.find((n) => n.id === id);
        dragOffset.current = {
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y
        };
        draggingId.current = id;
        setSelectedId(id);
    };

    const onMove = useCallback((e) => {
        if (!draggingId.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.current.x;
        const y = e.clientY - rect.top - dragOffset.current.y;
        setNodes((prev) =>
            prev.map((n) => (n.id === draggingId.current ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n))
        );
    }, []);

    const onUp = useCallback(() => {
        draggingId.current = null;
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [onMove, onUp]);

    const byId = (id) => nodes.find((n) => n.id === id);

    return (
        <section className="w-full max-w-5xl mx-auto bg-white font-sans text-[#101828] antialiased">
            <style>{`
                @keyframes pulse-soft { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
                .pulse-dot { animation: pulse-soft 1.8s ease-in-out infinite; }
                
                /* Hide scrollbar for Chrome, Safari and Opera */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>

            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: BLUE_SOFT }}
                    >
                        <Zap className="w-3.5 h-3.5" style={{ color: BLUE }} />
                    </div>
                    <span className="text-[14px] font-semibold">Order fulfillment</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3]" />
                </div>

                <button
                    onClick={() => setActive((a) => !a)}
                    className="flex items-center gap-2 rounded-full border border-[#E4E7EC] pl-1.5 pr-3 py-1"
                >
                    <span
                        className="w-8 h-[18px] rounded-full relative transition-colors duration-200"
                        style={{ backgroundColor: active ? BLUE : '#E4E7EC' }}
                    >
                        <span
                            className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200"
                            style={{ left: active ? 18 : 2 }}
                        />
                    </span>
                    <span className="text-[12px] font-medium text-[#344054]">
                        {active ? 'Active' : 'Paused'}
                    </span>
                </button>
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto no-scrollbar">
                <div
                    ref={containerRef}
                    className="relative"
                    style={{
                        minWidth: 1040,
                        height: 380,
                        backgroundImage: 'radial-gradient(#E4E7EC 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        backgroundColor: '#FCFCFD'
                    }}
                >
                    <svg className="absolute inset-0 pointer-events-none" width="1040" height="380">
                        {EDGES.map((edge, i) => {
                            const s = portOut(byId(edge.from));
                            const t = portIn(byId(edge.to));
                            const dx = Math.max(60, (t.x - s.x) / 2);
                            const d = `M ${s.x} ${s.y} C ${s.x + dx} ${s.y}, ${t.x - dx} ${t.y}, ${t.x} ${t.y}`;
                            const touchesSelected = edge.from === selectedId || edge.to === selectedId;
                            return (
                                <g key={i}>
                                    <path
                                        d={d}
                                        fill="none"
                                        stroke={touchesSelected ? BLUE : '#D0D5DD'}
                                        strokeWidth={touchesSelected ? 2 : 1.5}
                                    />
                                    {active && (
                                        <circle r="3.5" fill={BLUE}>
                                            <animateMotion dur="2.4s" repeatCount="indefinite" path={d} begin={`${i * 0.3}s`} />
                                        </circle>
                                    )}
                                    {edge.label && (
                                        <g transform={`translate(${(s.x + t.x) / 2}, ${(s.y + t.y) / 2})`}>
                                            <rect x="-16" y="-10" width="32" height="20" rx="10" fill="white" stroke="#E4E7EC" />
                                            <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="600" fill="#667085">
                                                {edge.label}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {nodes.map((node) => {
                        const Icon = node.icon;
                        const isSelected = node.id === selectedId;
                        return (
                            <div
                                key={node.id}
                                className="absolute"
                                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                                onMouseDown={(e) => onNodeMouseDown(e, node.id)}
                            >
                                <div
                                    className={`w-full h-full rounded-xl bg-white border flex items-center gap-3 px-3.5 cursor-grab active:cursor-grabbing transition-shadow ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow-md'
                                        }`}
                                    style={{
                                        borderColor: isSelected ? BLUE : '#E4E7EC',
                                        boxShadow: isSelected ? `0 0 0 3px ${BLUE}1A` : undefined
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: BLUE_SOFT }}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: BLUE }} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[13px] font-semibold truncate">{node.title}</div>
                                        <div className="text-[11px] text-[#667085] truncate">{node.subtitle}</div>
                                    </div>
                                    {node.type === 'trigger' && active && (
                                        <span
                                            className="ml-auto w-2 h-2 rounded-full shrink-0 pulse-dot"
                                            style={{ backgroundColor: GREEN }}
                                        />
                                    )}
                                </div>

                                {/* ports */}
                                <div
                                    className="absolute w-2.5 h-2.5 rounded-full bg-white border-2"
                                    style={{ borderColor: BLUE, left: -5, top: NODE_H / 2 - 5 }}
                                />
                                <div
                                    className="absolute w-2.5 h-2.5 rounded-full bg-white border-2"
                                    style={{ borderColor: BLUE, right: -5, top: NODE_H / 2 - 5 }}
                                />
                            </div>
                        );
                    })}

                    {/* add-step ghost node */}
                    <button
                        className="absolute flex items-center justify-center w-9 h-9 rounded-full border border-dashed border-[#D0D5DD] text-[#98A2B3] hover:border-[#2F6FED] hover:text-[#2F6FED] transition-colors"
                        style={{ left: 824 + NODE_W + 24, top: 150 + NODE_H / 2 - 18 }}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}