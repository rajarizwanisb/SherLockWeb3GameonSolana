import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createInitializeMintInstruction,
  MintLayout
} from '@solana/spl-token';
import { 
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  MetaplexFile,
  toMetaplexFile
} from '@metaplex-foundation/js';

// Solana RPC endpoints
export const SOLANA_RPC_ENDPOINT = process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

// Game program IDs (these would be your deployed smart contracts)
export const DETECTIVE_PROGRAM_ID = new PublicKey('Sh3rD3t3ct1v3Pr0gr4mABC123456789DEF123456');
export const CASE_NFT_PROGRAM_ID = new PublicKey('C4s3NFTPr0gr4mXYZ789ABC123456789DEF123456');
export const MARKETPLACE_PROGRAM_ID = new PublicKey('M4rk3tPl4c3Pr0gr4m789ABC123456789DEF123456');

// Initialize Metaplex for NFT operations
let metaplex: Metaplex | null = null;

export const initializeMetaplex = (wallet: any) => {
  if (!wallet) return null;
  
  metaplex = new Metaplex(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());
    
  return metaplex;
};

// User Identity NFT Functions
export interface DetectiveIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
  wallet_address: string;
}

export const createDetectiveIdentity = async (
  wallet: any,
  identityData: Partial<DetectiveIdentity>
): Promise<DetectiveIdentity> => {
  if (!wallet || !metaplex) {
    throw new Error('Wallet not connected or Metaplex not initialized');
  }

  try {
    // Create NFT metadata
    const metadata = {
      name: `Detective: ${identityData.name || 'Anonymous'}`,
      symbol: 'SH3R',
      description: `Sh3rlock Mysteries Detective Identity - Rank: ${identityData.detective_rank || 'Rookie'}`,
      image: 'https://example.com/detective-badge.png', // Replace with actual image
      attributes: [
        {
          trait_type: 'Rank',
          value: identityData.detective_rank || 'Rookie'
        },
        {
          trait_type: 'Cases Solved',
          value: identityData.cases_solved || 0
        },
        {
          trait_type: 'Reputation',
          value: (identityData.reputation || 0).toFixed(1)
        },
        ...(identityData.avatar_traits || []).map(trait => ({
          trait_type: 'Trait',
          value: trait
        }))
      ],
      properties: {
        category: 'identity',
        creators: [
          {
            address: wallet.publicKey.toString(),
            share: 100
          }
        ]
      }
    };

    // Create the NFT
    const { nft } = await metaplex.nfts().create({
      uri: await metaplex.nfts().uploadMetadata(metadata),
      name: metadata.name,
      symbol: metadata.symbol,
      sellerFeeBasisPoints: 0,
      isCollection: false,
      isMutable: true, // Allow updates for reputation changes
      // Make it non-transferable by setting update authority
      updateAuthority: wallet,
      tokenStandard: 0, // NonFungible
    });

    const identity: DetectiveIdentity = {
      id: nft.address.toString(),
      name: identityData.name || 'Anonymous Detective',
      detective_rank: identityData.detective_rank || 'Rookie Detective',
      cases_solved: identityData.cases_solved || 0,
      reputation: identityData.reputation || 0.0,
      avatar_traits: identityData.avatar_traits || ['Observant', 'Logical'],
      mint_address: nft.address.toString(),
      wallet_address: wallet.publicKey.toString()
    };

    return identity;
  } catch (error) {
    console.error('Error creating detective identity:', error);
    throw error;
  }
};

export const updateDetectiveReputation = async (
  wallet: any,
  identityMint: string,
  newReputation: number,
  casesSolved: number
): Promise<void> => {
  if (!wallet || !metaplex) {
    throw new Error('Wallet not connected');
  }

  try {
    const mintPublicKey = new PublicKey(identityMint);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

    // Update metadata with new reputation
    const updatedMetadata = {
      ...nft.json,
      attributes: [
        ...nft.json?.attributes?.filter(attr => 
          attr.trait_type !== 'Cases Solved' && attr.trait_type !== 'Reputation'
        ) || [],
        {
          trait_type: 'Cases Solved',
          value: casesSolved
        },
        {
          trait_type: 'Reputation',
          value: newReputation.toFixed(1)
        }
      ]
    };

    await metaplex.nfts().update({
      nftOrSft: nft,
      uri: await metaplex.nfts().uploadMetadata(updatedMetadata)
    });
  } catch (error) {
    console.error('Error updating detective reputation:', error);
    throw error;
  }
};

// Case NFT Functions
export interface DetectiveCase {
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
  price?: number; // For marketplace
}

export const createCaseNFT = async (
  wallet: any,
  caseData: Partial<DetectiveCase>
): Promise<DetectiveCase> => {
  if (!wallet || !metaplex) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create NFT metadata for the case
    const metadata = {
      name: caseData.title || 'Mystery Case',
      symbol: 'SH3RC',
      description: caseData.description || 'A mysterious detective case',
      image: 'https://example.com/case-cover.png', // Replace with actual image
      attributes: [
        {
          trait_type: 'Difficulty',
          value: caseData.difficulty || 'Novice'
        },
        {
          trait_type: 'Rarity',
          value: caseData.rarity || 'Common'
        },
        {
          trait_type: 'Category',
          value: caseData.category || 'Traditional'
        },
        {
          trait_type: 'Reward',
          value: `${caseData.reward || 0.5} SOL`
        },
        {
          trait_type: 'Creator',
          value: caseData.is_user_created ? 'User Generated' : 'AI Generated'
        }
      ],
      properties: {
        category: 'case',
        files: [
          {
            uri: 'https://example.com/case-data.json', // Store full case data
            type: 'application/json'
          }
        ],
        creators: [
          {
            address: wallet.publicKey.toString(),
            share: 100
          }
        ]
      },
      // Store the full case data in the metadata
      case_data: {
        story: caseData.story || [],
        clues: caseData.clues || [],
        solution: caseData.solution || '',
        difficulty: caseData.difficulty || 'Novice'
      }
    };

    // Create the Case NFT
    const { nft } = await metaplex.nfts().create({
      uri: await metaplex.nfts().uploadMetadata(metadata),
      name: metadata.name,
      symbol: metadata.symbol,
      sellerFeeBasisPoints: 500, // 5% royalty for creator
      isCollection: false,
      isMutable: false, // Cases are immutable once created
      tokenStandard: 0, // NonFungible
    });

    const caseNFT: DetectiveCase = {
      id: nft.address.toString(),
      title: caseData.title || 'Mystery Case',
      difficulty: caseData.difficulty || 'Novice',
      description: caseData.description || 'A mysterious detective case',
      story: caseData.story || [],
      clues: caseData.clues || [],
      solution: caseData.solution || '',
      reward: caseData.reward || 0.5,
      mint_address: nft.address.toString(),
      is_owned: true,
      is_solved: false,
      rarity: caseData.rarity || 'Common',
      category: caseData.category || 'Traditional',
      is_user_created: caseData.is_user_created || false,
      creator_address: wallet.publicKey.toString()
    };

    return caseNFT;
  } catch (error) {
    console.error('Error creating case NFT:', error);
    throw error;
  }
};

// Marketplace Functions
export const listCaseForSale = async (
  wallet: any,
  caseMint: string,
  price: number
): Promise<void> => {
  if (!wallet || !metaplex) {
    throw new Error('Wallet not connected');
  }

  try {
    const mintPublicKey = new PublicKey(caseMint);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

    // List NFT for sale
    await metaplex.auctionHouse().list({
      auctionHouse: await getOrCreateAuctionHouse(wallet),
      mintAccount: mintPublicKey,
      price: { basisPoints: price * LAMPORTS_PER_SOL, identifier: 'SOL' }
    });
  } catch (error) {
    console.error('Error listing case for sale:', error);
    throw error;
  }
};

export const purchaseCase = async (
  wallet: any,
  caseMint: string,
  price: number
): Promise<void> => {
  if (!wallet || !metaplex) {
    throw new Error('Wallet not connected');
  }

  try {
    const mintPublicKey = new PublicKey(caseMint);
    
    // Find the listing
    const auctionHouse = await getOrCreateAuctionHouse(wallet);
    const listings = await metaplex.auctionHouse().findListingsBy({
      auctionHouse,
      mintAccount: mintPublicKey
    });

    if (listings.length === 0) {
      throw new Error('Case not found for sale');
    }

    const listing = listings[0];

    // Execute the purchase
    await metaplex.auctionHouse().buy({
      auctionHouse,
      listing
    });
  } catch (error) {
    console.error('Error purchasing case:', error);
    throw error;
  }
};

// Reward System
export const rewardSolver = async (
  wallet: any,
  recipientAddress: string,
  rewardAmount: number
): Promise<string> => {
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports: rewardAmount * LAMPORTS_PER_SOL
      })
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Error sending reward:', error);
    throw error;
  }
};

// Helper function for auction house
const getOrCreateAuctionHouse = async (wallet: any) => {
  if (!metaplex) throw new Error('Metaplex not initialized');

  try {
    // Try to find existing auction house
    const auctionHouses = await metaplex.auctionHouse().findAllBy({
      creator: wallet.publicKey
    });

    if (auctionHouses.length > 0) {
      return auctionHouses[0];
    }

    // Create new auction house if none exists
    const { auctionHouse } = await metaplex.auctionHouse().create({
      sellerFeeBasisPoints: 250, // 2.5% fee
      authority: wallet,
      feeWithdrawalDestination: wallet.publicKey,
      treasuryWithdrawalDestination: wallet.publicKey
    });

    return auctionHouse;
  } catch (error) {
    console.error('Error with auction house:', error);
    throw error;
  }
};

// Utility Functions
export const getWalletBalance = async (walletAddress: string): Promise<number> => {
  try {
    const balance = await connection.getBalance(new PublicKey(walletAddress));
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return 0;
  }
};

export const getUserNFTs = async (walletAddress: string): Promise<any[]> => {
  if (!metaplex) return [];

  try {
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: new PublicKey(walletAddress)
    });

    return nfts;
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    return [];
  }
};

// Demo/Development Functions
export const airdropSol = async (walletAddress: string, amount: number = 2): Promise<void> => {
  try {
    const airdropSignature = await connection.requestAirdrop(
      new PublicKey(walletAddress),
      amount * LAMPORTS_PER_SOL
    );
    
    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdropped ${amount} SOL to ${walletAddress}`);
  } catch (error) {
    console.error('Error airdropping SOL:', error);
    throw error;
  }
};