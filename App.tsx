
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, History, Send, Loader2, 
  Shield, Database, Zap, Code, CheckCircle2, Wallet, Terminal, 
  Cpu, Package, Globe, Hash, Info, ArrowRight, Layers, 
  Lock, RefreshCw, Smartphone, ChevronLeft, ChevronDown, HelpCircle,
  BookOpen, FileText, Activity
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
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
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
  const [openAccordion, setOpenAccordion] = useState<string | null>('toad');
  
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

  const handleForge = async () => {
    if (!prompt.trim()) return;

    setGenState({ isGenerating: true, step: 'Enchanting UTXO...', progress: 10, logs: ["Initiating client-side validation logic..."] });
    try {
      const systemContext = `Protocol Context: ${activeType}. 
Whitepaper goals: client-side validation, recursive proofs, unchained portability. 
Use Case: ${prompt}.
Format the response in structured, professional Markdown.`;
      
      const result = await forgeCharm(systemContext, (step) => {
        addLog(step);
        setGenState(prev => ({ ...prev, step, progress: Math.min(prev.progress + 15, 95) }));
      });
      const newCharm: Charm = {
        id: Math.random().toString(36).substr(2, 9),
        type: activeType,
        title: prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt,
        content: result.content,
        timestamp: Date.now(),
        status: 'draft',
        sources: result.sources,
        currentChain: 'Bitcoin'
      };
      setCharms(prev => [...prev, newCharm]);
      setPrompt('');
      addLog("Artifact enchanted with recursive ZK proof metadata.");
    } catch (error) {
      console.error("Forge failed:", error);
      addLog("ERROR: Reasoning sync failed.");
    } finally {
      setGenState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const handleProve = async (charm: Charm) => {
    setGenState({ isGenerating: true, step: 'Casting Spell Proof', progress: 0, logs: ["$ charms spell prove --app-id=" + appId] });
    const phases = [
      { msg: "Compiling Rust contract to RISC-V binary...", progress: 20 },
      { msg: "Generating recursive ZK-SNARK witness...", progress: 45 },
      { msg: "Verifying all pre-requisite transaction spells...", progress: 70 },
      { msg: "Finalizing Groth16 proof envelope...", progress: 95 },
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
    setGenState({ isGenerating: true, step: 'Inscribing to Bitcoin', progress: 50, logs: ["$ b submitpackage [commit_hex, spell_hex]"] });
    await new Promise(r => setTimeout(r, 1200));
    setCharms(prev => prev.map(c => c.id === charm.id ? { ...c, status: 'minted' } : c));
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleBeam = async (charm: Charm, targetChain: 'Cardano' | 'Dogecoin') => {
    setGenState({ isGenerating: true, step: `Beaming to ${targetChain}`, progress: 0, logs: [`Initiating cross-chain transport to ${targetChain}...`] });
    const phases = [{ msg: `Creating placeholder UTXO on ${targetChain}...`, progress: 25 }, { msg: "Creating Beaming Spell on Bitcoin...", progress: 50 }, { msg: "Constructing SHA256 mapping...", progress: 75 }, { msg: "Materializing on target ledger...", progress: 100 }];
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
              <Info className="w-3 h-3" /> Protocol Help
            </h2>
            <div className="space-y-2">
              {[
                { label: "ToAD Model", desc: "Improved ledger model satisfying predicates F:(ins, outs, x, w) → Bool." },
                { label: "recursive zkVM", desc: "Enables off-chain validation without historical traversal." },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                  <p className="text-[9px] text-indigo-300 font-bold uppercase mb-1">{item.label}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
              <button 
                onClick={() => { setOnboardingTab('encyclopedia'); setShowOnboarding(true); }}
                className="w-full py-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3 h-3" /> Navigator
              </button>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-indigo-500/10">
          <button 
            onClick={() => { setOnboardingTab('welcome'); setShowOnboarding(true); }}
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-slate-400 flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
          >
            <Layers className="w-3 h-3" /> Whitepaper Abstract
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 pb-64">
          {charms.length === 0 && !genState.isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8 py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-10 animate-pulse"></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative border border-white/10">
                  <Zap className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-outfit font-black tracking-tight text-white uppercase">
                  Enchant Bitcoin
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-light">
                  Forge smart assets natively on the Bitcoin ledger using recursive ZK proofs and the ToAD eUTXO model.
                </p>
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
                    {charm.status === 'draft' && <button onClick={() => handleProve(charm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Prove</button>}
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
                { type: CharmType.LOGIC, label: "App Contract", icon: Code },
                { type: CharmType.STABLECOIN, label: "Self-Auditing Stablecoin", icon: Smartphone },
                { type: CharmType.XBTC, label: "Unchained Bitcoin (xBTC)", icon: Zap },
                { type: CharmType.FUNGIBLE, label: "eUTXO Token", icon: Layers }
              ].map(t => (
                <button 
                  key={t.type}
                  onClick={() => setActiveType(t.type)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 transition-all ${activeType === t.type ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-500 border-white/5'}`}
                >
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              ))}
            </div>
            <div className="relative group">
              <div className="relative bg-[#10101c]/80 border border-white/10 rounded-[2rem] p-2 flex items-end gap-2 shadow-2xl backdrop-blur-xl">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleForge())}
                  placeholder={`Forge a ${activeType.toLowerCase()} charm...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-slate-200 text-lg placeholder-slate-700 min-h-[60px] max-h-40 resize-none font-light leading-relaxed"
                  rows={1}
                />
                <button onClick={handleForge} disabled={!prompt.trim() || genState.isGenerating} className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl disabled:bg-slate-800 transition-all mb-1 mr-1"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Onboarding Overlay - Encyclopedia Concept Navigator */}
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
                    <h2 className="text-2xl font-outfit font-black tracking-tight uppercase leading-tight">Protocol Navigator</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Client-Side Validation & zkVM Evidence</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setOnboardingTab(onboardingTab === 'welcome' ? 'encyclopedia' : 'welcome')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-white/5"
                  >
                    {onboardingTab === 'welcome' ? 'Technical Spec' : 'Whitepaper Abstract'}
                  </button>
                  <button onClick={() => setShowOnboarding(false)} className="p-3 hover:bg-white/5 rounded-full text-slate-500"><Terminal className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {onboardingTab === 'welcome' ? (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-indigo-400 font-outfit uppercase">Abstract</h3>
                    <p className="text-slate-400 leading-relaxed font-light">
                      Bitcoin remains the heart of the crypto economy, yet its poor programmability and scalability have capped its potential. Enter **Charms** — a revolutionary protocol that “enchants” Bitcoin, enabling programmable and portable assets natively on its ledger. Leveraging client-side validation of recursive zkVM proofs, Charms eliminates the need for bridges, trusted validators, or transaction graph traversal.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Activity className="w-6 h-6 text-indigo-400 mb-4" />
                        <h4 className="text-white uppercase mb-2">Unchained</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">State verified by recursive zk-proofs, not a single ledger. Materialize natively on any chain.</p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Smartphone className="w-6 h-6 text-indigo-400 mb-4" />
                        <h4 className="text-white uppercase mb-2">Client-Side</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Validation happens off-chain. Clients read spells and verify Groth16 proofs locally.</p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Globe className="w-6 h-6 text-indigo-400 mb-4" />
                        <h4 className="text-white uppercase mb-2">Chain Agnostic</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Seamlessly "beam" assets between Bitcoin, Cardano, and other UTXO blockchains.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AccordionItem 
                      title="ToAD: Tokens as App Data" 
                      isOpen={openAccordion === 'toad'} 
                      onClick={() => setOpenAccordion(openAccordion === 'toad' ? null : 'toad')}
                      icon={<FileText className="w-4 h-4" />}
                    >
                      <p>Charms started as ToAD — a fresh take on an Extended UTXO model. Proposed as an improved ledger model for zkBitcoin, it satisfies a validation predicate signature:</p>
                      
                      <div className="p-4 bg-black/40 rounded-xl font-mono text-indigo-400 text-center mb-6 border border-white/5">
                        F : (ins, outs, x, w) → Bool
                      </div>
                      
                      <p className="font-bold text-white uppercase text-[10px] tracking-widest mb-2">Technical Definitions:</p>
                      <ul className="list-disc pl-5 mb-6">
                        <li><strong>ins</strong>: set of outputs spent by the transaction.</li>
                        <li><strong>outs</strong>: set of outputs created by the transaction.</li>
                        <li><strong>x</strong>: public redeeming (or spending) data necessary to validate the transaction.</li>
                        <li><strong>w</strong>: private witness data necessary to validate the transaction (e.g. pre-images).</li>
                      </ul>

                      <p className="font-bold text-white uppercase text-[10px] tracking-widest mb-4">Implementation Pseudo-code:</p>
                      <pre className="bg-black/60 p-5 rounded-2xl text-[11px] leading-relaxed text-indigo-200 border border-white/5 overflow-x-auto">
{`// 1. Define the Application Structure
struct App {
  tag: char,      // 't' for tokens, 'n' for NFTs
  identity: B32,  // 32-byte unique asset ID
  vk: B32         // Verification Key hash of logic
}

// 2. Define the Enchanted UTXO
struct UTXO {
  id: UTXO_ID,
  // The state map: validation predicate -> state data
  charms: Map<App, Data> 
}

// 3. The Validation Predicate F
function F(app: App, tx: Transaction, x: Public, w: Private) -> Bool {
  // Logic MUST satisfy the App's Verification Key (vk)
  const is_valid_logic = verify_zk_proof(app.vk, tx, x, w);
  
  if (app.tag === 't') {
    // Standard Token Preservation: Sum(ins) === Sum(outs)
    const sum_in = tx.ins.reduce((s, u) => s + u.charms.get(app).amount, 0);
    const sum_out = tx.outs.reduce((s, u) => s + u.charms.get(app).amount, 0);
    return is_valid_logic && (sum_in === sum_out);
  }
  
  return is_valid_logic;
}`}
                      </pre>
                    </AccordionItem>

                    <AccordionItem 
                      title="Spells and Spells-Data" 
                      isOpen={openAccordion === 'spells'} 
                      onClick={() => setOpenAccordion(openAccordion === 'spells' ? null : 'spells')}
                      icon={<Zap className="w-4 h-4" />}
                    >
                      <p>Spells are the magic that creates charms. A spell enchants a transaction. It is included in a Taproot witness envelope:</p>
                      <pre className="bg-black/60 p-4 rounded-xl text-[10px] text-indigo-300">
{`OP_FALSE
OP_IF
 OP_PUSH "spell"
 OP_PUSH $spell_data
 OP_PUSH $proof_data
OP_ENDIF`}
                      </pre>
                      <p>A spell is correct if it parses, makes sense for the tx, and has a valid proof. Double-spending is prevented by Bitcoin base layer.</p>
                    </AccordionItem>

                    <AccordionItem 
                      title="Recursive zkVM Proofs" 
                      isOpen={openAccordion === 'proofs'} 
                      onClick={() => setOpenAccordion(openAccordion === 'proofs' ? null : 'proofs')}
                      icon={<Activity className="w-4 h-4" />}
                    >
                      <p>Charms client library doesn't need to traverse transaction history. Recursive Groth16 proofs attest to:</p>
                      <ol>
                        <li>All pre-requisite transactions produced the charms in their outputs (correct spells).</li>
                        <li>All Charms app contracts in this transaction are satisfied (satisfied proofs).</li>
                      </ol>
                      <p>This makes every client a Charms validator, even web or mobile apps.</p>
                    </AccordionItem>

                    <AccordionItem 
                      title="Beaming Protcol" 
                      isOpen={openAccordion === 'beaming'} 
                      onClick={() => setOpenAccordion(openAccordion === 'beaming' ? null : 'beaming')}
                      icon={<Globe className="w-4 h-4" />}
                    >
                      <p>Beaming decouples Charms from the underlying blockchain. Assets move to other chains (and back to Bitcoin) natively:</p>
                      <ul>
                        <li><strong>Chain C (Dest)</strong>: Create "placeholder" UTXO.</li>
                        <li><strong>Chain B (Src)</strong>: Create Charms output added to <code>beamed_outs</code> mapping with the SHA256 hash of the placeholder ID.</li>
                      </ul>
                      <p>Apps become cross-chain without trying to become cross-chain.</p>
                    </AccordionItem>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-white/5 mt-8 flex flex-col md:flex-row gap-4 items-center">
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group"
                >
                  Launch Forge Studio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
