// This file provides typed mock data structures for development and testing
// Note: The actual application uses real backend APIs and storage

export interface MockUser {
  id: string;
  username: string;
  btnBalance: number;
  level: number;
  experience: number;
  totalActions: number;
  carbonSaved: number;
  rank: number;
  title: string;
}

export interface MockNFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  creator: string;
  category: string;
}

export interface MockTransaction {
  id: string;
  type: "mining" | "purchase" | "sale" | "bonus";
  amount: number;
  description: string;
  timestamp: Date;
}

export interface MockAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// Type-safe mock data generators for development
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: "mock-user-1",
  username: "EcoMiner",
  btnBalance: 2847,
  level: 8,
  experience: 2847,
  totalActions: 1247,
  carbonSaved: 23700,
  rank: 47,
  title: "Rising Miner",
  ...overrides,
});

export const createMockNFT = (overrides: Partial<MockNFT> = {}): MockNFT => ({
  id: "mock-nft-1",
  name: "Green Future #001",
  description: "Sustainable energy visualization",
  imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  price: 25.5,
  creator: "@eco_artist",
  category: "art",
  ...overrides,
});

export const createMockTransaction = (overrides: Partial<MockTransaction> = {}): MockTransaction => ({
  id: "mock-tx-1",
  type: "mining",
  amount: 15.25,
  description: "Action Mining Reward",
  timestamp: new Date(),
  ...overrides,
});

export const createMockAchievement = (overrides: Partial<MockAchievement> = {}): MockAchievement => ({
  id: "mock-achievement-1",
  name: "First Thousand",
  description: "1,000 actions mined",
  icon: "star",
  unlockedAt: new Date(),
  ...overrides,
});

// Validation helpers for type safety
export const isValidMockUser = (user: any): user is MockUser => {
  return (
    typeof user === 'object' &&
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.btnBalance === 'number' &&
    typeof user.level === 'number'
  );
};

export const isValidMockNFT = (nft: any): nft is MockNFT => {
  return (
    typeof nft === 'object' &&
    typeof nft.id === 'string' &&
    typeof nft.name === 'string' &&
    typeof nft.price === 'number'
  );
};

// Export default mock data collections for convenience
export const mockUsers: MockUser[] = [
  createMockUser(),
  createMockUser({
    id: "mock-user-2",
    username: "GreenMachine",
    btnBalance: 14239,
    level: 22,
    rank: 2,
    title: "Sustainability Champion"
  }),
];

export const mockNFTs: MockNFT[] = [
  createMockNFT(),
  createMockNFT({
    id: "mock-nft-2",
    name: "Wind Symphony #007",
    description: "Wind energy abstract composition",
    imageUrl: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    price: 45.0,
    creator: "@wind_creator"
  }),
];

export const mockTransactions: MockTransaction[] = [
  createMockTransaction(),
  createMockTransaction({
    id: "mock-tx-2",
    type: "purchase",
    amount: -45.0,
    description: "NFT Purchase",
    timestamp: new Date(Date.now() - 86400000)
  }),
];

export const mockAchievements: MockAchievement[] = [
  createMockAchievement(),
  createMockAchievement({
    id: "mock-achievement-2",
    name: "Social Butterfly",
    description: "50 social shares",
    icon: "globe"
  }),
];
