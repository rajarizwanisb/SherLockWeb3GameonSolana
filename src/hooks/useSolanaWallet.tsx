import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface DetectiveIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
  wallet_address: string;
}

interface DetectiveCase {
  id: string;
  title: string;
  difficulty: 'Novice' | 'Intermediate' | 'Expert' | 'Master';
  description: string;
  story: string[];
  clues: string[];
  solution: string;
  reward: number;
  mint_address: string;
  is_owned: boolean;
  is_solved: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category?: string;
  is_user_created?: boolean;
  creator_address?: string;
  price?: number;
}

interface MockWallet {
  publicKey: {
    toString: () => string;
  };
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any) => Promise<string>;
}

interface SolanaWalletContextType {
  // Wallet state
  wallet: MockWallet;
  connected: boolean;
  connecting: boolean;
  disconnecting: boolean;
  publicKey: { toString: () => string } | null;
  realMode: boolean;
  
  // Game state
  userIdentity: DetectiveIdentity | null;
  ownedCases: DetectiveCase[];
  walletBalance: number;
  
  // Actions
  connect: (useRealWallet?: boolean) => Promise<void>;
  disconnect: () => Promise<void>;
  createIdentity: (identityData: Partial<DetectiveIdentity>) => Promise<DetectiveIdentity>;
  updateReputation: (newRep: number, casesSolved: number) => Promise<void>;
  createCase: (caseData: Partial<DetectiveCase>) => Promise<DetectiveCase>;
  buyCase: (caseMint: string, price: number) => Promise<void>;
  solveCase: (caseId: string, rewardAmount: number) => Promise<void>;
  requestAirdrop: (amount?: number) => Promise<void>;
  refreshData: () => Promise<void>;
  switchToDemo: () => Promise<void>;
  switchToReal: () => Promise<void>;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | null>(null);

export const useSolanaWallet = () => {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within SolanaWalletProvider');
  }
  return context;
};

// Mock wallet addresses for different modes
const generateWalletAddress = (realMode: boolean) => {
  if (realMode) {
    return 'REAL1234567890abcdefghijklmnopqrstuvwxyz123456789';
  } else {
    return 'DEMO1234567890abcdefghijklmnopqrstuvwxyz123456789';
  }
};

const createMockWallet = (realMode: boolean): MockWallet => ({
  publicKey: {
    toString: () => generateWalletAddress(realMode)
  },
  connected: false,
  connecting: false,
  disconnecting: false,
  connect: async () => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, realMode ? 2000 : 1000));
  },
  disconnect: async () => {
    // Simulate disconnection
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  sendTransaction: async (transaction: any) => {
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, realMode ? 3000 : 500));
    return 'mock_signature_' + Date.now();
  }
});

export const SolanaWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [realMode, setRealMode] = useState(false);
  const [wallet, setWallet] = useState<MockWallet>(createMockWallet(false));
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [userIdentity, setUserIdentity] = useState<DetectiveIdentity | null>(null);
  const [ownedCases, setOwnedCases] = useState<DetectiveCase[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(2.5);

  // Load saved data from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('sh3rlock_real_mode');
    const savedIdentity = localStorage.getItem('sh3rlock_identity');
    const savedCases = localStorage.getItem('sh3rlock_cases');
    const savedBalance = localStorage.getItem('sh3rlock_balance');
    const savedConnected = localStorage.getItem('sh3rlock_connected');
    
    if (savedMode === 'true') {
      setRealMode(true);
      setWallet(createMockWallet(true));
    }
    
    if (savedIdentity) {
      setUserIdentity(JSON.parse(savedIdentity));
    }
    if (savedCases) {
      setOwnedCases(JSON.parse(savedCases));
    }
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    }
    if (savedConnected === 'true') {
      setConnected(true);
      if (wallet) {
        wallet.connected = true;
      }
    }
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    localStorage.setItem('sh3rlock_real_mode', realMode.toString());
    localStorage.setItem('sh3rlock_connected', connected.toString());
    if (userIdentity) {
      localStorage.setItem('sh3rlock_identity', JSON.stringify(userIdentity));
    }
    localStorage.setItem('sh3rlock_cases', JSON.stringify(ownedCases));
    localStorage.setItem('sh3rlock_balance', walletBalance.toString());
  }, [realMode, connected, userIdentity, ownedCases, walletBalance]);

  useEffect(() => {
    saveData();
  }, [saveData]);

  // Update wallet when mode changes
  useEffect(() => {
    setWallet(createMockWallet(realMode));
  }, [realMode]);

  const refreshData = useCallback(async () => {
    // Simulate data refresh
    console.log(`Refreshing ${realMode ? 'real' : 'demo'} wallet data...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [realMode]);

  const connect = useCallback(async (useRealWallet: boolean = false) => {
    setConnecting(true);
    try {
      const newRealMode = useRealWallet;
      setRealMode(newRealMode);
      
      const newWallet = createMockWallet(newRealMode);
      setWallet(newWallet);
      
      // Simulate wallet connection
      await newWallet.connect();
      
      newWallet.connected = true;
      setConnected(true);
      
      // Set initial balance based on mode
      setWalletBalance(newRealMode ? 0.5 : 2.5);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setDisconnecting(true);
    try {
      await wallet.disconnect();
      
      wallet.connected = false;
      setConnected(false);
      
      // Clear all data
      setUserIdentity(null);
      setOwnedCases([]);
      setWalletBalance(0);
      
      // Clear localStorage
      localStorage.removeItem('sh3rlock_identity');
      localStorage.removeItem('sh3rlock_cases');
      localStorage.removeItem('sh3rlock_balance');
      localStorage.removeItem('sh3rlock_real_mode');
      localStorage.removeItem('sh3rlock_connected');
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setDisconnecting(false);
    }
  }, [wallet]);

  const switchToDemo = useCallback(async () => {
    if (realMode && connected) {
      await disconnect();
    }
    setRealMode(false);
    setWallet(createMockWallet(false));
    setUserIdentity(null);
    setOwnedCases([]);
    setWalletBalance(2.5);
    setConnected(false);
  }, [realMode, connected, disconnect]);

  const switchToReal = useCallback(async () => {
    if (!realMode && connected) {
      await disconnect();
    }
    setRealMode(true);
    setWallet(createMockWallet(true));
    setUserIdentity(null);
    setOwnedCases([]);
    setWalletBalance(0.5);
    setConnected(false);
  }, [realMode, connected, disconnect]);

  const createIdentity = useCallback(async (identityData: Partial<DetectiveIdentity>) => {
    // Simulate identity creation transaction
    await wallet.sendTransaction({});
    
    const identity: DetectiveIdentity = {
      id: `identity_${Date.now()}`,
      name: identityData.name || 'Anonymous Detective',
      detective_rank: identityData.detective_rank || 'Rookie Detective',
      cases_solved: 0,
      reputation: 0.0,
      avatar_traits: identityData.avatar_traits || ['Observant', 'Logical', 'Determined'],
      mint_address: `mint_${Date.now()}_identity`,
      wallet_address: wallet.publicKey.toString()
    };
    
    setUserIdentity(identity);
    
    // Deduct transaction cost
    const transactionCost = realMode ? 0.01 : 0.005;
    setWalletBalance(prev => Math.max(0, prev - transactionCost));
    
    return identity;
  }, [wallet, realMode]);

  const updateReputation = useCallback(async (newRep: number, casesSolved: number) => {
    if (!userIdentity) return;
    
    setUserIdentity(prev => prev ? {
      ...prev,
      reputation: newRep,
      cases_solved: casesSolved
    } : null);
  }, [userIdentity]);

  const createCase = useCallback(async (caseData: Partial<DetectiveCase>) => {
    // Simulate case creation transaction
    await wallet.sendTransaction({});
    
    const newCase: DetectiveCase = {
      id: `case_${Date.now()}`,
      title: caseData.title || 'Mystery Case',
      difficulty: caseData.difficulty || 'Novice',
      description: caseData.description || 'A mysterious case',
      story: caseData.story || [],
      clues: caseData.clues || [],
      solution: caseData.solution || '',
      reward: caseData.reward || 0.5,
      mint_address: `mint_${Date.now()}_case`,
      is_owned: true,
      is_solved: false,
      rarity: caseData.rarity || 'Common',
      category: caseData.category || 'Traditional',
      is_user_created: true,
      creator_address: wallet.publicKey.toString()
    };
    
    setOwnedCases(prev => [...prev, newCase]);
    
    // Deduct creation cost
    const creationCost = realMode ? 0.02 : 0.01;
    setWalletBalance(prev => Math.max(0, prev - creationCost));
    
    return newCase;
  }, [wallet, realMode]);

  const buyCase = useCallback(async (caseMint: string, price: number) => {
    if (walletBalance < price) {
      throw new Error('Insufficient balance');
    }
    
    // Simulate purchase transaction
    await wallet.sendTransaction({});
    
    setWalletBalance(prev => prev - price);
  }, [wallet, walletBalance]);

  const solveCase = useCallback(async (caseId: string, rewardAmount: number) => {
    // Simulate reward transaction
    if (realMode) {
      await wallet.sendTransaction({});
    }
    
    setWalletBalance(prev => prev + rewardAmount);
    
    // Mark case as solved
    setOwnedCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, is_solved: true } : c
    ));
    
    // Update reputation
    if (userIdentity) {
      const newCasesSolved = userIdentity.cases_solved + 1;
      const newReputation = Math.min(10, userIdentity.reputation + 0.1);
      await updateReputation(newReputation, newCasesSolved);
    }
  }, [realMode, wallet, userIdentity, updateReputation]);

  const requestAirdrop = useCallback(async (amount: number = 2) => {
    // Simulate airdrop
    await new Promise(resolve => setTimeout(resolve, realMode ? 2000 : 500));
    
    if (realMode) {
      // Simulate potential failure in real mode
      const success = Math.random() > 0.2; // 80% success rate
      if (!success) {
        throw new Error('Airdrop failed - network congestion or rate limit reached');
      }
    }
    
    setWalletBalance(prev => prev + amount);
  }, [realMode]);

  const contextValue: SolanaWalletContextType = {
    // Wallet state
    wallet,
    connected,
    connecting,
    disconnecting,
    publicKey: connected ? wallet.publicKey : null,
    realMode,
    
    // Game state
    userIdentity,
    ownedCases,
    walletBalance,
    
    // Actions
    connect,
    disconnect,
    createIdentity,
    updateReputation,
    createCase,
    buyCase,
    solveCase,
    requestAirdrop,
    refreshData,
    switchToDemo,
    switchToReal
  };

  return (
    <SolanaWalletContext.Provider value={contextValue}>
      {children}
    </SolanaWalletContext.Provider>
  );
};