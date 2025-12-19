
export enum CharmType {
  LOGIC = 'LOGIC',
  FUNGIBLE = 'FUNGIBLE',
  STABLECOIN = 'STABLECOIN',
  XBTC = 'xBTC'
}

export interface Charm {
  id: string;
  type: CharmType;
  title: string;
  content: string;
  timestamp: number;
  sources?: { web: { uri: string; title: string } }[];
  // Blockchain Props
  status: 'draft' | 'proving' | 'ready_to_broadcast' | 'minted' | 'beaming' | 'beamed';
  txId?: string;
  appId?: string;
  vk?: string;
  ownerAddress?: string;
  commitTx?: string;
  spellTx?: string;
  currentChain: 'Bitcoin' | 'Cardano' | 'Dogecoin';
  destinationChain?: 'Bitcoin' | 'Cardano' | 'Dogecoin';
}

export interface WalletConfig {
  fundingUtxo: string;
  fundingValue: string;
  changeAddress: string;
}

export interface GenerationState {
  isGenerating: boolean;
  step: string;
  progress: number;
  logs: string[];
}
