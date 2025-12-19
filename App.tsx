
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, History, Send, Loader2, 
  Shield, Database, Zap, Code, CheckCircle2, Wallet, Terminal, 
  Cpu, Package, Globe, Hash, Info, ArrowRight, Layers, 
  Lock, RefreshCw, Smartphone, ChevronLeft, ChevronDown, HelpCircle,
  BookOpen, FileText, Activity, Box, MousePointer2, GitCommit, FileCode
} from 'lucide-react';
import { Charm, CharmType, GenerationState, WalletConfig } from './types';
import { 
  forgeCharm, STUDIO_VK, MOCK_UTXO, sha256, randomHex
} from './geminiService';

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void; icon: React.ReactNode }> = ({ title, children, isOpen, onClick, icon }) => (
  <div className="border-b border-white/5 last:border-none">
    <button 
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left group transition-colors hover:bg-white/[0.02] px-4 rounded-lg"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'}`}>
          {icon}
        </div>
        <span className={`text-sm font-outfit font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {title}
        </span>
      </div>
      <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
      <div className="px-16 text-slate-400 prose prose-invert prose-sm max-w-none">
        {children}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [activeType, setActiveType] = useState<CharmType>(CharmType.LOGIC);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [genState, setGenState] = useState<GenerationState>({ isGenerating: false, step: '', progress: 0, logs: [] });
  const [appId, setAppId] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingTab, setOnboardingTab] = useState<'welcome' | 'encyclopedia'>('welcome');
  const [openAccordion, setOpenAccordion] = useState<string | null>('tooling');
  
  const [wallet] = useState<WalletConfig>({
    fundingUtxo: "2d6d1603f0738085f2035d496baf2b91a639d204b414ea180beb417a3e09f84e:1",
    fundingValue: "50000",
    changeAddress: "tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv"
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sha256(MOCK_UTXO).then(setAppId);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [charms, genState.isGenerating]);

  const addLog = (log: string) => {
    setGenState(prev => ({ ...prev, logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${log}`] }));
  };

  const handleForge = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setGenState({ isGenerating: true, step: 'Forging via charms-lib...', progress: 10, logs: ["charms-lib: Initializing RISC-V workspace...", "cargo: checking dependencies..."] });
    try {
      const systemContext = `Protocol Context: ${activeType}. Using charms-lib for proof orchestration. Use Case: ${finalPrompt}. Format output in professional Markdown. Include specific technical details on how 'charms-lib' handles the predicate F(ins, outs, x, w).`;
      
      const result = await forgeCharm(systemContext, (step) => {
        addLog(`charms-lib: ${step}`);
        setGenState(prev => ({ ...prev, step, progress: Math.min(prev.progress + 15, 95) }));
      });
      const newCharm: Charm = {
        id: Math.random().toString(36).substr(2, 9),
        type: activeType,
        title: finalPrompt.length > 30 ? finalPrompt.substring(0, 30) + '...' : finalPrompt,
        content: result.content,
        timestamp: Date.now(),
        status: 'draft',
        sources: result.sources,
        currentChain: 'Bitcoin'
      };
      setCharms(prev => [...prev, newCharm]);
      setPrompt('');
      addLog("charms-lib: Artifact compiled to ZK-witness. Ready for enchantment.");
    } catch (error) {
      console.error("Forge failed:", error);
      addLog("ERROR: Reasoning sync failed.");
    } finally {
      setGenState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleProve = async (charm: Charm) => {
    setGenState({ isGenerating: true, step: 'charms-lib proofing', progress: 0, logs: ["$ charms spell prove --app-id=" + appId] });
    const phases = [
      { msg: "Compiling logic to RISC-V ELF via charms-lib...", progress: 20 },
      { msg: "Requesting SP1 zkVM witness generation...", progress: 45 },
      { msg: "Verifying recursive spell chain...", progress: 70 },
      { msg: "Wrapping in Groth16 envelope...", progress: 95 },
    ];
    for (const phase of phases) {
      addLog(phase.msg);
      setGenState(prev => ({ ...prev, progress: phase.progress }));
      await new Promise(r => setTimeout(r, 600));
    }
    const commitTx = "02000000000101" + randomHex(64);
    const spellTx = "02000000000102" + randomHex(80);
    const txId = await sha256(spellTx);
    setCharms(prev => prev.map(c => c.id === charm.id ? { ...c, status: 'ready_to_broadcast', commitTx, spellTx, txId, appId, vk: STUDIO_VK, ownerAddress: wallet.changeAddress } : c));
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleBroadcast = async (charm: Charm) => {
    setGenState({ isGenerating: true, step: 'Inscribing Spell', progress: 50, logs: ["charms-lib: Preparing Bitcoin Taproot envelope..."] });
    await new Promise(r => setTimeout(r, 1200));
    setCharms(prev => prev.map(c => c.id === charm.id ? { ...c, status: 'minted' } : c));
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleBeam = async (charm: Charm, targetChain: 'Cardano' | 'Dogecoin') => {
    setGenState({ isGenerating: true, step: `Beaming via charms-lib`, progress: 0, logs: [`charms-lib: Initiating native transport to ${targetChain}...`] });
    const phases = [{ msg: "Calculating destination UTXO mapping...", progress: 25 }, { msg: "Generating Beam Proof...", progress: 50 }, { msg: "Inscribing beam-out on Bitcoin...", progress: 75 }, { msg: "Materializing on target ledger...", progress: 100 }];
    for (const phase of phases) {
      addLog(phase.msg);
      setGenState(prev => ({ ...prev, progress: phase.progress }));
      await new Promise(r => setTimeout(r, 800));
    }
    setCharms(prev => prev.map(c => c.id === charm.id ? { ...c, status: 'beamed', currentChain: targetChain, destinationChain: targetChain } : c));
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  return (
    <div className="flex h-screen bg-[#050508] text-slate-100 overflow-hidden font-inter text-sm">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-indigo-500/10 bg-[#0a0a12]/90 backdrop-blur-3xl">
        <div className="p-6 border-b border-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-md font-outfit font-bold tracking-tight">Charms Studio</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section>
            <h2 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
              <Wallet className="w-3 h-3" /> Active Wallet
            </h2>
            <div className="p-3 bg-white/[0.03] rounded-lg border border-white/5 space-y-3">
              <p className="text-[8px] text-slate-500 uppercase">Funding UTXO</p>
              <p className="text-[9px] font-mono text-slate-400 break-all bg-black/40 p-1.5 rounded leading-tight">
                {wallet.fundingUtxo}
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-indigo-400">{wallet.fundingValue} sats</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-[8px]">Unspent</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> Tooling
            </h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-900/50 rounded-lg border border-white/5 font-mono text-[9px] text-emerald-400">
                $ cargo add charms-lib
              </div>
              <button 
                onClick={() => { setOnboardingTab('encyclopedia'); setOpenAccordion('tooling'); setShowOnboarding(true); }}
                className="w-full py-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center justify-center gap-2"
              >
                <Terminal className="w-3 h-3" /> Dev Docs
              </button>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-indigo-500/10">
          <button 
            onClick={() => { setOnboardingTab('welcome'); setShowOnboarding(true); }}
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-slate-400 flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
          >
            <Layers className="w-3 h-3" /> Protocol Abstract
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-16 pb-64">
          {charms.length === 0 && !genState.isGenerating && (
            <div className="max-w-4xl mx-auto space-y-16 py-10">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                  <Sparkles className="w-3 h-3" /> AI-Powered eUTXO Factory
                </div>
                <h2 className="text-5xl font-outfit font-black tracking-tight text-white uppercase leading-none">
                  Unchain Bitcoin
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-light max-w-2xl mx-auto">
                  Forge programmable tokens, self-auditing stablecoins, and cross-chain artifacts. Enchanted UTXOs powered by <strong>charms-lib</strong>.
                </p>
              </div>

              {/* Workflow Map */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                 <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-indigo-500/10 -translate-y-1/2 z-0"></div>
                 {[
                   { step: 1, title: 'Forge', icon: Zap, desc: 'Describe logic & compile RISC-V' },
                   { step: 2, title: 'Prove', icon: Cpu, desc: 'Generate recursive ZK-SNARK' },
                   { step: 3, title: 'Enchant', icon: Lock, desc: 'Inscribe Taproot Spell' },
                   { step: 4, title: 'Beam', icon: Globe, desc: 'Native cross-chain transport' }
                 ].map((s) => (
                   <div key={s.step} className="relative z-10 bg-[#0f0f1a] border border-white/5 p-5 rounded-2xl flex flex-col items-center text-center space-y-3 group hover:border-indigo-500/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Step 0{s.step}</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">{s.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{s.desc}</p>
                   </div>
                 ))}
              </div>

              {/* Creation Guides */}
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                  <MousePointer2 className="w-4 h-4" /> Recommended Blueprints
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { 
                      title: "Fungible Token (eUTXO)", 
                      desc: "Create a standard 't' tag token using ToAD preservation logic. Total input amount must equal total output.", 
                      prompt: "Create a fungible token named 'GoldCoin' with tag 't'. Implement standard ToAD amount preservation in the app_contract logic where sum of inputs equals sum of outputs.",
                      icon: Layers,
                      type: CharmType.FUNGIBLE
                    },
                    { 
                      title: "Self-Auditing Stablecoin", 
                      desc: "A stablecoin that requires a ZK-proof of off-chain liquidity (e.g. CashApp) before any new minting occurs.", 
                      prompt: "Forge a stablecoin charm named 'cUSD' that implements a self-auditing logic. The app_contract must verify a public witness 'x' representing a proof of reserve from a custodian account before satisfying the predicate.",
                      icon: Smartphone,
                      type: CharmType.STABLECOIN
                    },
                    { 
                      title: "Unchained Bitcoin (xBTC)", 
                      desc: "A programmable BTC representation that can be beamed natively to Cardano without bridges.", 
                      prompt: "Design xBTC: a programmable Bitcoin wrapper. It must implement the beaming protocol using the beamed_outs mapping of SHA256 hashes for destination UTXOs on Cardano.",
                      icon: Zap,
                      type: CharmType.XBTC
                    },
                    { 
                      title: "Recursive Yield Protocol", 
                      desc: "App contract that tracks yield accrual across recursive state updates without transaction history traversal.", 
                      prompt: "Implement a logic contract for a recursive yield protocol. Use the 'datum' field to store cumulative yield and verify correct updates using charms-lib recursive spell proofs.",
                      icon: GitCommit,
                      type: CharmType.LOGIC
                    }
                  ].map((guide, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setActiveType(guide.type);
                        handleForge(guide.prompt);
                      }}
                      className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-4 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <guide.icon className="w-12 h-12" />
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-all">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{guide.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                          {guide.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Initialize Workflow <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {charms.map((charm) => (
            <div key={charm.id} className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
              <div className="bg-[#0f0f1a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-indigo-500/20">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      {charm.status === 'beamed' ? <Globe className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-md text-slate-100">{charm.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black ${charm.status === 'minted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {charm.currentChain}
                        </span>
                        <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black">
                          {charm.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {charm.status === 'draft' && <button onClick={() => handleProve(charm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Generate Proof</button>}
                    {charm.status === 'ready_to_broadcast' && <button onClick={() => handleBroadcast(charm)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Enchant</button>}
                    {charm.status === 'minted' && <button onClick={() => handleBeam(charm, 'Cardano')} className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Beam</button>}
                  </div>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  <div className="prose prose-invert prose-slate max-w-none">
                    <ReactMarkdown>{charm.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#050508] via-[#050508]/95 to-transparent">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { type: CharmType.LOGIC, label: "Logic Contract", icon: Code },
                { type: CharmType.STABLECOIN, label: "Stablecoin", icon: Smartphone },
                { type: CharmType.XBTC, label: "xBTC Protocol", icon: Zap },
                { type: CharmType.FUNGIBLE, label: "eUTXO Asset", icon: Layers }
              ].map(t => (
                <button 
                  key={t.type}
                  onClick={() => setActiveType(t.type)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 transition-all ${activeType === t.type ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-slate-500 border-white/5'}`}
                >
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              ))}
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-[#10101c]/80 border border-white/10 rounded-[2rem] p-2 flex items-end gap-2 shadow-2xl backdrop-blur-xl">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleForge())}
                  placeholder={`Describe charm logic for charms-lib compilation...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-slate-200 text-lg placeholder-slate-700 min-h-[60px] max-h-40 resize-none font-light leading-relaxed"
                  rows={1}
                />
                <button onClick={() => handleForge()} disabled={!prompt.trim() || genState.isGenerating} className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl disabled:bg-slate-800 transition-all mb-1 mr-1"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-[3rem] max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-8 md:p-12 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-outfit font-black tracking-tight uppercase leading-tight">Charms Navigator</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol implementation via charms-lib</p>
                  </div>
                </div>
                <button onClick={() => setShowOnboarding(false)} className="p-3 hover:bg-white/5 rounded-full text-slate-500 transition-colors"><Terminal className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                <div className="space-y-2">
                  <AccordionItem 
                    title="Developer Tooling" 
                    isOpen={openAccordion === 'tooling'} 
                    onClick={() => setOpenAccordion(openAccordion === 'tooling' ? null : 'tooling')}
                    icon={<Box className="w-4 h-4" />}
                  >
                    <p>To start building with the unchained standard, add the official crate to your Rust project:</p>
                    <div className="p-4 bg-black/60 rounded-xl font-mono text-emerald-400 border border-white/5 mb-6">
                      $ cargo add charms-lib
                    </div>
                    <p className="text-xs text-slate-500 mb-4">This library provides the necessary primitives for CBOR serialization, Groth16 proof generation, and Taproot spell orchestration.</p>
                    
                    <h4 className="text-white uppercase text-[10px] tracking-widest mb-4">Rust Implementation Example:</h4>
                    <pre className="bg-black/80 p-5 rounded-2xl text-[11px] leading-relaxed text-indigo-300 border border-white/5 overflow-x-auto">
{`use charms_lib::{App, Transaction, Data, UtxoId};
use charms_lib::crypto::verify_zk_proof;

/// The canonical ToAD predicate implementation
pub fn app_contract(
    app: &App, 
    tx: &Transaction, 
    x: &Data, 
    w: &Data
) -> bool {
    // 1. Verify logic against App Verification Key (vk)
    let logic_valid = verify_zk_proof(&app.vk, tx, x, w);
    
    // 2. Specialized handling for fungible tokens (tag 't')
    if app.tag == 't' {
        let sum_ins: u64 = tx.ins.values()
            .filter_map(|charms| charms.get(app))
            .map(|data| data.as_u64())
            .sum();
            
        let sum_outs: u64 = tx.outs.iter()
            .filter_map(|charms| charms.get(app))
            .map(|data| data.as_u64())
            .sum();
            
        return logic_valid && (sum_ins == sum_outs);
    }

    logic_valid
}`}
                    </pre>
                  </AccordionItem>

                  <AccordionItem 
                    title="ToAD: Tokens as App Data" 
                    isOpen={openAccordion === 'toad'} 
                    onClick={() => setOpenAccordion(openAccordion === 'toad' ? null : 'toad')}
                    icon={<FileText className="w-4 h-4" />}
                  >
                    <p>Charms started as ToAD — a fresh take on an Extended UTXO model. A transaction involving zkBitcoin apps satisfies a validation predicate with signature:</p>
                    <div className="p-4 bg-black/40 rounded-xl font-mono text-indigo-400 text-center mb-6 border border-white/5">
                      F : (ins, outs, x, w) → Bool
                    </div>
                    <ul className="list-disc pl-5">
                      <li><strong>ins/outs</strong>: UTXO sets defined in <code>charms-lib</code>.</li>
                      <li><strong>x (Public)</strong>: Redeeming data (signatures, etc).</li>
                      <li><strong>w (Witness)</strong>: Private data for ZK-witness generation.</li>
                    </ul>
                  </AccordionItem>

                  <AccordionItem 
                    title="Spells & Taproot Envelopes" 
                    isOpen={openAccordion === 'spells'} 
                    onClick={() => setOpenAccordion(openAccordion === 'spells' ? null : 'spells')}
                    icon={<Zap className="w-4 h-4" />}
                  >
                    <p>Spells "magically" enchant Bitcoin transactions. <code>charms-lib</code> handles the generation of the Taproot witness envelope:</p>
                    <pre className="bg-black/60 p-4 rounded-xl text-[10px] text-indigo-300">
{`OP_FALSE
OP_IF
 OP_PUSH "spell"
 OP_PUSH $spell_data   // CBOR-encoded NormalizedSpell
 OP_PUSH $proof_data   // Groth16 Proof
OP_ENDIF`}
                    </pre>
                  </AccordionItem>

                  <AccordionItem 
                    title="Recursive Proofs" 
                    isOpen={openAccordion === 'proofs'} 
                    onClick={() => setOpenAccordion(openAccordion === 'proofs' ? null : 'proofs')}
                    icon={<Activity className="w-4 h-4" />}
                  >
                    <p>The <code>charms-spell-checker</code> program verifies that:</p>
                    <ol>
                      <li>The spell is well-formed.</li>
                      <li>The transaction satisfies all app contracts.</li>
                      <li><strong>Recursion</strong>: All parent spell proofs are correct.</li>
                    </ol>
                  </AccordionItem>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8">
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                >
                  Enter Forge Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
