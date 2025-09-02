// Browser-native blockchain implementation
// Simulates WASM functionality until full Rust compilation is available

import { sha256 } from 'js-sha256';

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
  carbonOffset: number; // CO2 saved in grams
}

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  timestamp: string;
  transactionType: string;
  actionProof?: string;
  carbonOffset: number;
}

export interface ProofOfAction {
  userId: string;
  actionType: string;
  timestamp: number;
  proofHash: string;
  difficulty: number;
  nonce: number;
  authenticityScore: number;
}

export interface AIConsensus {
  fraudDetector: FraudDetector;
  rewardOptimizer: RewardOptimizer;
  actionPatterns: Map<string, UserBehaviorPattern>;
  globalStats: GlobalBehaviorStats;
}

export interface UserBehaviorPattern {
  userId: string;
  actionHistory: ActionEvent[];
  timingPatterns: number[];
  deviceFingerprints: string[];
  reputationScore: number;
  totalActions: number;
  suspiciousEvents: number;
}

export interface ActionEvent {
  actionType: string;
  timestamp: number;
  authenticityScore: number;
  deviceFingerprint: string;
}

export interface GlobalBehaviorStats {
  totalUsers: number;
  totalActions: number;
  fraudRate: number;
  averageAuthenticity: number;
  peakActivityTimes: number[];
}

export interface FraudDetector {
  minActionInterval: number;
  maxActionsPerMinute: number;
  deviceSwitchingThreshold: number;
  timingVarianceThreshold: number;
}

export interface RewardOptimizer {
  baseRewards: Map<string, number>;
  difficultyMultiplier: number;
  economyBalance: number;
  inflationRate: number;
}

export class BitnunBlockchain {
  private blocks: Block[] = [];
  private pendingTransactions: Transaction[] = [];
  private miningDifficulty = 2;
  private miningReward = 1000; // 10.00 BTN in cents
  private totalSupply = 1000000000; // 10M BTN total supply
  private carbonOffset = 0;

  constructor() {
    this.blocks = [this.createGenesisBlock()];
    console.log('Bitnun Blockchain initialized with genesis block');
  }

  private createGenesisBlock(): Block {
    const genesisTransaction: Transaction = {
      id: 'genesis',
      fromAddress: '',
      toAddress: 'genesis',
      amount: this.totalSupply,
      timestamp: new Date().toISOString(),
      transactionType: 'genesis',
      carbonOffset: 0,
    };

    const timestamp = new Date().toISOString();
    const merkleRoot = this.calculateMerkleRoot([genesisTransaction]);
    
    const genesisBlock: Block = {
      index: 0,
      timestamp,
      transactions: [genesisTransaction],
      previousHash: '0',
      hash: '',
      nonce: 0,
      merkleRoot,
      carbonOffset: 0,
    };

    genesisBlock.hash = this.calculateHash(genesisBlock);
    return genesisBlock;
  }

  addTransaction(transaction: Transaction): boolean {
    if (this.validateTransaction(transaction)) {
      this.pendingTransactions.push(transaction);
      console.log(`Transaction added: ${transaction.id}`);
      return true;
    }
    console.log(`Invalid transaction rejected: ${transaction.id}`);
    return false;
  }

  minePendingTransactions(miningRewardAddress: string): string {
    // Add mining reward transaction
    const rewardTx: Transaction = {
      id: `reward_${Date.now()}`,
      fromAddress: '',
      toAddress: miningRewardAddress,
      amount: this.miningReward,
      timestamp: new Date().toISOString(),
      transactionType: 'mining_reward',
      carbonOffset: 15,
    };
    
    this.pendingTransactions.push(rewardTx);

    const newBlock: Block = {
      index: this.blocks.length,
      timestamp: new Date().toISOString(),
      transactions: [...this.pendingTransactions],
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(this.pendingTransactions),
      carbonOffset: 10, // Each block saves 10g CO2
    };

    newBlock.hash = this.mineBlock(newBlock);
    this.carbonOffset += 10;

    console.log(`Block mined: ${newBlock.hash} with ${newBlock.transactions.length} transactions`);
    
    this.blocks.push(newBlock);
    this.pendingTransactions = [];

    return newBlock.hash;
  }

  private mineBlock(block: Block): string {
    const target = '0'.repeat(this.miningDifficulty);
    const startTime = Date.now();

    while (!block.hash.startsWith(target)) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }

    const miningTime = Date.now() - startTime;
    console.log(`Block mined in ${miningTime}ms with nonce: ${block.nonce}`);
    
    return block.hash;
  }

  private calculateHash(block: Block): string {
    const data = `${block.index}${block.timestamp}${block.previousHash}${block.merkleRoot}${block.nonce}${JSON.stringify(block.transactions)}`;
    return sha256(data);
  }

  private calculateMerkleRoot(transactions: Transaction[]): string {
    if (transactions.length === 0) return '0';

    let hashes = transactions.map(tx => sha256(tx.id));

    while (hashes.length > 1) {
      const nextLevel: string[] = [];
      
      for (let i = 0; i < hashes.length; i += 2) {
        const combined = i + 1 < hashes.length 
          ? hashes[i] + hashes[i + 1]
          : hashes[i] + hashes[i];
        nextLevel.push(sha256(combined));
      }
      
      hashes = nextLevel;
    }

    return hashes[0];
  }

  getBalance(address: string): number {
    let balance = 0;

    for (const block of this.blocks) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  validateChain(): boolean {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        console.log(`Invalid block hash at index ${i}`);
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log(`Invalid previous hash at index ${i}`);
        return false;
      }
    }

    console.log('Blockchain validation successful');
    return true;
  }

  getChainStats() {
    return {
      totalBlocks: this.blocks.length,
      totalTransactions: this.blocks.reduce((sum, block) => sum + block.transactions.length, 0),
      totalSupply: this.totalSupply,
      carbonOffset: this.carbonOffset,
      miningDifficulty: this.miningDifficulty,
    };
  }

  private validateTransaction(transaction: Transaction): boolean {
    if (transaction.fromAddress === '') {
      return true; // Mining reward or genesis
    }

    const balance = this.getBalance(transaction.fromAddress);
    return balance >= transaction.amount;
  }

  private getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }
}

export class ProofOfActionConsensus {
  generateProof(userId: string, actionType: string, difficulty: number = 2): ProofOfAction {
    const timestamp = Date.now();
    const target = '0'.repeat(difficulty);
    let nonce = 0;
    let proofHash = '';

    while (!proofHash.startsWith(target)) {
      nonce++;
      const data = `${userId}${actionType}${timestamp}${nonce}`;
      proofHash = sha256(data);
    }

    console.log(`Proof-of-Action generated for ${actionType} action with nonce: ${nonce}`);

    return {
      userId,
      actionType,
      timestamp,
      proofHash,
      difficulty,
      nonce,
      authenticityScore: 1.0,
    };
  }

  validateProof(proof: ProofOfAction): boolean {
    const target = '0'.repeat(proof.difficulty);
    const data = `${proof.userId}${proof.actionType}${proof.timestamp}${proof.nonce}`;
    const calculatedHash = sha256(data);

    return calculatedHash === proof.proofHash && 
           calculatedHash.startsWith(target) &&
           proof.authenticityScore >= 0.7;
  }

  calculateReward(proof: ProofOfAction): number {
    const baseReward = this.getBaseReward(proof.actionType);
    const reward = baseReward * proof.authenticityScore * (1 + proof.difficulty / 10);
    return Math.max(Math.floor(reward), 1);
  }

  private getBaseReward(actionType: string): number {
    const rewards: Record<string, number> = {
      click: 5,
      scroll: 2,
      share: 25,
      form_submit: 50,
      referral: 100,
      daily_login: 20,
    };
    return rewards[actionType] || 1;
  }
}

export class AIConsensusEngine {
  private fraudDetector: FraudDetector;
  private rewardOptimizer: RewardOptimizer;
  private actionPatterns = new Map<string, UserBehaviorPattern>();
  private globalStats: GlobalBehaviorStats;

  constructor() {
    this.fraudDetector = {
      minActionInterval: 50,
      maxActionsPerMinute: 120,
      deviceSwitchingThreshold: 5,
      timingVarianceThreshold: 10,
    };

    this.rewardOptimizer = {
      baseRewards: new Map([
        ['click', 5],
        ['scroll', 2],
        ['share', 25],
        ['form_submit', 50],
        ['referral', 100],
        ['daily_login', 20],
      ]),
      difficultyMultiplier: 1.0,
      economyBalance: 1.0,
      inflationRate: 0.02,
    };

    this.globalStats = {
      totalUsers: 0,
      totalActions: 0,
      fraudRate: 0.05,
      averageAuthenticity: 0.85,
      peakActivityTimes: [],
    };
  }

  analyzeAction(
    userId: string,
    actionType: string,
    timestamp: number,
    deviceFingerprint: string
  ): number {
    const userPattern = this.getUserPattern(userId);
    const authenticityScore = this.detectFraud(userPattern, actionType, timestamp, deviceFingerprint);

    // Record the action
    const actionEvent: ActionEvent = {
      actionType,
      timestamp,
      authenticityScore,
      deviceFingerprint,
    };

    userPattern.actionHistory.push(actionEvent);
    userPattern.totalActions++;

    // Update timing patterns
    if (userPattern.actionHistory.length > 1) {
      const lastAction = userPattern.actionHistory[userPattern.actionHistory.length - 2];
      userPattern.timingPatterns.push(timestamp - lastAction.timestamp);
    }

    // Update device fingerprints
    if (!userPattern.deviceFingerprints.includes(deviceFingerprint)) {
      userPattern.deviceFingerprints.push(deviceFingerprint);
    }

    // Update reputation
    userPattern.reputationScore = (userPattern.reputationScore * 0.95) + (authenticityScore * 0.05);

    // Flag suspicious behavior
    if (authenticityScore < 0.5) {
      userPattern.suspiciousEvents++;
      console.log(`Suspicious activity detected for user: ${userId}`);
    }

    // Update global stats
    this.globalStats.totalActions++;
    this.globalStats.averageAuthenticity = 
      (this.globalStats.averageAuthenticity * 0.999) + (authenticityScore * 0.001);

    console.log(`AI Analysis - User: ${userId}, Action: ${actionType}, Authenticity: ${authenticityScore.toFixed(2)}`);

    return authenticityScore;
  }

  private getUserPattern(userId: string): UserBehaviorPattern {
    if (!this.actionPatterns.has(userId)) {
      this.actionPatterns.set(userId, {
        userId,
        actionHistory: [],
        timingPatterns: [],
        deviceFingerprints: [],
        reputationScore: 1.0,
        totalActions: 0,
        suspiciousEvents: 0,
      });
      this.globalStats.totalUsers++;
    }
    return this.actionPatterns.get(userId)!;
  }

  private detectFraud(
    userPattern: UserBehaviorPattern,
    actionType: string,
    timestamp: number,
    deviceFingerprint: string
  ): number {
    let authenticityScore = 1.0;

    // Check timing patterns
    if (userPattern.timingPatterns.length > 0) {
      const lastInterval = userPattern.timingPatterns[userPattern.timingPatterns.length - 1];
      if (lastInterval < this.fraudDetector.minActionInterval) {
        authenticityScore *= 0.2; // Very suspicious
      }
    }

    // Check action frequency
    const oneMinuteAgo = timestamp - 60000;
    const recentActions = userPattern.actionHistory.filter(
      action => action.timestamp > oneMinuteAgo
    ).length;

    if (recentActions > this.fraudDetector.maxActionsPerMinute) {
      authenticityScore *= 0.1; // Bot-like behavior
    }

    // Check device switching
    if (userPattern.deviceFingerprints.length > this.fraudDetector.deviceSwitchingThreshold) {
      authenticityScore *= 0.3; // Suspicious device switching
    }

    // Check reputation history
    if (userPattern.reputationScore < 0.5) {
      authenticityScore *= 0.6; // Poor reputation
    }

    // Action-specific checks
    authenticityScore *= this.getActionSpecificMultiplier(actionType, userPattern);

    return Math.max(authenticityScore, 0.1);
  }

  private getActionSpecificMultiplier(actionType: string, userPattern: UserBehaviorPattern): number {
    const recentActions = userPattern.actionHistory.slice(-10);
    const sameActionCount = recentActions.filter(action => action.actionType === actionType).length;

    switch (actionType) {
      case 'click':
        return sameActionCount > 8 ? 0.4 : 1.0;
      case 'scroll':
        return sameActionCount > 6 ? 0.5 : 1.0;
      case 'share':
        return sameActionCount > 2 ? 0.2 : 1.0;
      case 'form_submit':
        return sameActionCount > 3 ? 0.3 : 1.0;
      default:
        return 0.8;
    }
  }

  getUserReputation(userId: string): number {
    const pattern = this.actionPatterns.get(userId);
    return pattern?.reputationScore || 1.0;
  }

  isUserSuspicious(userId: string): boolean {
    const pattern = this.actionPatterns.get(userId);
    if (!pattern) return false;

    return pattern.reputationScore < 0.6 ||
           pattern.suspiciousEvents > 10 ||
           (pattern.suspiciousEvents / pattern.totalActions) > 0.3;
  }

  getAIStats() {
    return {
      totalUsersAnalyzed: this.actionPatterns.size,
      totalActionsProcessed: this.globalStats.totalActions,
      currentFraudRate: this.globalStats.fraudRate,
      averageAuthenticity: this.globalStats.averageAuthenticity,
      suspiciousUsers: Array.from(this.actionPatterns.values())
        .filter(p => p.reputationScore < 0.6).length,
    };
  }
}

// Global blockchain instance
export const bitnunBlockchain = new BitnunBlockchain();
export const proofOfActionConsensus = new ProofOfActionConsensus();
export const aiConsensusEngine = new AIConsensusEngine();