
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

export const TOPOLOGY_NODES: NodeItem[] = [
    { id: 'start', label: 'Trigger Event', icon: Play, x: 'col-start-1', y: 'row-start-1' },
    { id: 'browser', label: 'Proxy Node', icon: Globe, x: 'col-start-2', y: 'row-start-1' },
    { id: 'extract', label: 'JSON Target', icon: Target, x: 'col-start-2', y: 'row-start-3' },
    { id: 'condition', label: 'Router Split', icon: GitBranch, x: 'col-start-3', y: 'row-start-3' },
    { id: 'email', label: 'Webhook Out', icon: Mail, x: 'col-start-4', y: 'row-start-2' },
    { id: 'done', label: 'Resolution', icon: CheckCircle2, x: 'col-start-4', y: 'row-start-4' },
];

export const METRIC_CARDS = [
    { icon: Cpu, title: 'Isolated Compute', val: '240ms', label: 'Avg execution time per DOM session block' },
    { icon: Code2, title: 'JSON Schemas', val: '100%', label: 'Strict programmatic formatting guarantees' },
    { icon: ShieldAlert, title: 'Adaptive Proxies', val: '0%', label: 'Failure rate using human behavior mapping' },
];

export const TIMELINE_STEPS = [
    { step: '01', title: 'Create Workflow', desc: 'Connect nodes visually to define your automation system.', nodeLabel: 'Start Node' },
    { step: '02', title: 'Configure Nodes', desc: 'Additional micro-services slide seamlessly into your layout view.', nodeLabel: 'Browser Node' },
    { step: '03', title: 'Execute Browser', desc: 'A moving indicator triggers the instance live with proxy routing.', nodeLabel: 'Extract Node' },
    { step: '04', title: 'Extract Data', desc: 'Targeted raw values instantly morph and flow to schemas.', nodeLabel: 'Condition Node' },
    { step: '05', title: 'Apply Logic', desc: 'Condition engine evaluates parameters cleanly before proceeding.', nodeLabel: 'Email Node' },
    { step: '06', title: 'Trigger Action', desc: 'Dispatches payload metrics directly out to any external webhook.', nodeLabel: 'End Node' },
];
