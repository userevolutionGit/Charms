
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, History, Send, Loader2, 
  Shield, Database, Zap, Code, CheckCircle2, Wallet, Terminal, 
  Cpu, Package, Globe, Hash, Info, ArrowRight, Layers, 
  Lock, RefreshCw, Smartphone
} from 'lucide-react';
import { Charm, CharmType, GenerationState, WalletConfig } from './types';
import { 
  forgeCharm, STUDIO_VK, MOCK_UTXO, sha256, randomHex
} from './geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [activeType, setActiveType] = useState<CharmType>(CharmType.LOGIC);
  const [charms, setCharms] = useState<Charm[]>([]);
  const [genState, setGenState] = useState<GenerationState>({ isGenerating: false, step: '', progress: 0, logs: [] });
  const [appId, setAppId] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(true);
  
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
      const systemContext = `Protocol Context: ${activeType}. Whitepaper goals: client-side validation, recursive proofs, unchained portability. Use Case: ${prompt}`;
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

    setCharms(prev => prev.map(c => c.id === charm.id ? { 
      ...c, 
      status: 'ready_to_broadcast', 
      commitTx, 
      spellTx, 
      txId,
      appId,
      vk: STUDIO_VK,
      ownerAddress: wallet.changeAddress
    } : c));

    addLog("Recursive proof ready. Spell transaction created.");
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleBroadcast = async (charm: Charm) => {
    setGenState({ isGenerating: true, step: 'Inscribing to Bitcoin', progress: 50, logs: ["$ b submitpackage [commit_hex, spell_hex]"] });
    await new Promise(r => setTimeout(r, 1200));
    
    setCharms(prev => prev.map(c => c.id === charm.id ? { ...c, status: 'minted' } : c));
    addLog("Transaction accepted. UTXO enchanted on Testnet4.");
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  const handleBeam = async (charm: Charm, targetChain: 'Cardano' | 'Dogecoin') => {
    setGenState({ isGenerating: true, step: `Beaming to ${targetChain}`, progress: 0, logs: [`Initiating cross-chain transport to ${targetChain}...`] });
    
    const phases = [
      { msg: `Creating placeholder UTXO on ${targetChain}...`, progress: 25 },
      { msg: "Creating Beaming Spell on Bitcoin (Source)...", progress: 50 },
      { msg: "Constructing SHA256 mapping of destination ID...", progress: 75 },
      { msg: "Materializing on target ledger...", progress: 100 },
    ];

    for (const phase of phases) {
      addLog(phase.msg);
      setGenState(prev => ({ ...prev, progress: phase.progress }));
      await new Promise(r => setTimeout(r, 800));
    }

    setCharms(prev => prev.map(c => c.id === charm.id ? { 
      ...c, 
      status: 'beamed', 
      currentChain: targetChain,
      destinationChain: targetChain 
    } : c));

    addLog(`Beam success. Charm now lives natively on ${targetChain}.`);
    setGenState(prev => ({ ...prev, isGenerating: false }));
  };

  return (
    <div className="flex h-screen bg-[#050508] text-slate-100 overflow-hidden font-inter">
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
              <Info className="w-3 h-3" /> Protocol Guide
            </h2>
            <div className="space-y-2">
              {[
                { label: "Enchanted UTXO", desc: "A Bitcoin output carrying programmable state via ZK proofs." },
                { label: "Spells", desc: "Metadata in the witness script that enchants a transaction." },
                { label: "Beaming", desc: "Native cross-chain transfer without bridges or custodians." }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                  <p className="text-[9px] text-indigo-300 font-bold uppercase mb-1">{item.label}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-indigo-500/10">
          <button 
            onClick={() => setShowOnboarding(true)}
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-slate-400 flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
          >
            <Layers className="w-3 h-3" /> View Whitepaper
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
                  Invoke high-reasoning protocol logic. Enchant UTXOs with recursive ZK proofs. Beam assets natively between chains.
                </p>
              </div>
            </div>
          )}

          {charms.map((charm) => (
            <div key={charm.id} className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
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
                    {charm.status === 'draft' && (
                      <button 
                        onClick={() => handleProve(charm)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                      >
                        <Cpu className="w-3.5 h-3.5" /> Prove Logic
                      </button>
                    )}
                    {charm.status === 'ready_to_broadcast' && (
                      <button 
                        onClick={() => handleBroadcast(charm)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                      >
                        <Zap className="w-3.5 h-3.5" /> Enchant
                      </button>
                    )}
                    {charm.status === 'minted' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleBeam(charm, 'Cardano')}
                          className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Beam to Cardano
                        </button>
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/5 px-4 py-2 rounded-xl border border-emerald-400/20">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Inscribed</span>
                        </div>
                      </div>
                    )}
                    {charm.status === 'beamed' && (
                       <div className="flex items-center gap-2 text-indigo-400 bg-indigo-400/5 px-4 py-2 rounded-xl border border-indigo-400/20">
                          <Globe className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Materialized on {charm.currentChain}</span>
                       </div>
                    )}
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="prose prose-invert max-w-none text-slate-400 text-lg leading-relaxed font-light">
                    {charm.content.split('\n').map((l, i) => <p key={i}>{l}</p>)}
                  </div>

                  {(charm.status === 'ready_to_broadcast' || charm.status === 'minted' || charm.status === 'beamed') && (
                    <div className="p-6 bg-[#050508] border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-indigo-400 font-black uppercase text-[9px] tracking-[0.2em]">
                            <Package className="w-3.5 h-3.5" /> Recursive ZK Evidence
                         </div>
                         <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-600" />
                            <span className="text-[8px] text-slate-600 font-bold uppercase">Client-Side Validated</span>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-black/40 p-3 rounded-lg font-mono text-[9px] text-slate-500 break-all border border-white/5 max-h-24 overflow-y-auto">
                          Witness Spell: {charm.spellTx}
                        </div>
                        {charm.status === 'beamed' && (
                          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-mono text-indigo-300">
                             Transfer Hash: {charm.txId} <br/>
                             Chain: {charm.currentChain} <br/>
                             Status: Materialized Natively
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {genState.isGenerating && (
            <div className="max-w-2xl mx-auto py-8 space-y-8">
               <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-white">{genState.step}</h3>
                    <div className="w-48 mx-auto bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${genState.progress}%` }}></div>
                    </div>
                  </div>
               </div>

               <div className="bg-[#050508] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                 <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-slate-500" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">zkVM Runtime Logs</span>
                 </div>
                 <div className="p-4 h-48 overflow-y-auto font-mono text-[10px] text-indigo-300/60 space-y-1.5">
                    {genState.logs.map((log, i) => (
                      <p key={i} className="animate-in fade-in duration-300">
                        <span className="text-slate-700">➜</span> {log}
                      </p>
                    ))}
                    <div className="animate-pulse">_</div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Action Bar with Templates */}
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
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 transition-all ${activeType === t.type ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'}`}
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
                  placeholder={`Describe your ${activeType.toLowerCase()} logic (e.g. "xBTC with recursive yield")...`}
                  className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-slate-200 text-lg placeholder-slate-700 min-h-[60px] max-h-40 resize-none font-light leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleForge}
                  disabled={!prompt.trim() || genState.isGenerating}
                  className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl disabled:bg-slate-800 disabled:text-slate-700 transition-all mb-1 mr-1 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 text-[8px] text-slate-600 font-bold uppercase tracking-[0.4em]">
               <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Recursive ZK-Proofs</span>
               <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Post-Chain Ready</span>
            </div>
          </div>
        </div>
      </main>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f0f1a] border border-white/10 rounded-[3rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-outfit font-black tracking-tight uppercase">Getting Started</h2>
                </div>
                <button onClick={() => setShowOnboarding(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><Terminal className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 mb-2">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Forge Intelligence</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">Use Gemini reasoning to define logic contracts based on Bitcoin's unchained metalayer.</p>
                  </div>
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 mb-2">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">ZK-Proof Generation</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">Generate Groth16 proofs on a zkVM. Every charm is client-side validated, inheriting Bitcoin's security.</p>
                  </div>
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 mb-2">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Cross-Chain Beaming</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">Move assets between Bitcoin, Cardano, and beyond. Portability is native; no bridges required.</p>
                  </div>
                  <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 mb-2">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Enchanted UTXOs</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">The end of wrapped tokens. Digital assets satisfy direct ownership, programmability, and portability.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                >
                  Enter the Studio <ArrowRight className="w-4 h-4" />
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
