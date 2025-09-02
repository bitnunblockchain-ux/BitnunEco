import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  bitnunBlockchain, 
  proofOfActionConsensus, 
  aiConsensusEngine,
  type Transaction,
  type ProofOfAction 
} from "@/lib/blockchain";

interface ActionMiningContextType {
  actionCount: number;
  miningStatus: string;
  incrementActions: (type: string, reward?: number) => void;
  totalBTNEarned: number;
  blockchainStats: any;
  aiStats: any;
  userReputation: number;
}

const ActionMiningContext = createContext<ActionMiningContextType | undefined>(undefined);

export function ActionMiningProvider({ children }: { children: ReactNode }) {
  const [actionCount, setActionCount] = useState(0);
  const [totalBTNEarned, setTotalBTNEarned] = useState(0);
  const [blockchainStats, setBlockchainStats] = useState(bitnunBlockchain.getChainStats());
  const [aiStats, setAIStats] = useState(aiConsensusEngine.getAIStats());
  const [userReputation, setUserReputation] = useState(1.0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Generate device fingerprint
  const deviceFingerprint = `${navigator.userAgent}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}`;

  const actionMutation = useMutation({
    mutationFn: async (actionData: { userId: string; type: string; reward: number }) => {
      const response = await apiRequest("POST", "/api/actions", actionData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setTotalBTNEarned(prev => prev + (data.reward / 100));
      
      // Show reward notification for significant actions
      if (data.reward >= 25) {
        toast({
          title: "BTN Reward Earned!",
          description: `+${(data.reward / 100).toFixed(2)} BTN tokens`,
          duration: 2000,
        });
      }
    },
  });

  const incrementActions = (type: string = "click", reward: number = 5) => {
    setActionCount(prev => prev + 1);
    const userId = "default-user";
    
    // Generate Proof-of-Action
    const proof = proofOfActionConsensus.generateProof(userId, type, 2);
    
    // AI fraud detection analysis
    const authenticityScore = aiConsensusEngine.analyzeAction(
      userId,
      type,
      Date.now(),
      deviceFingerprint
    );
    
    proof.authenticityScore = authenticityScore;
    
    // Calculate optimized reward
    const optimizedReward = proofOfActionConsensus.calculateReward(proof);
    
    // Create blockchain transaction
    const transaction: Transaction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromAddress: '',
      toAddress: userId,
      amount: optimizedReward,
      timestamp: new Date().toISOString(),
      transactionType: `action_mining_${type}`,
      actionProof: JSON.stringify(proof),
      carbonOffset: type === 'share' ? 10 : 5,
    };
    
    // Add to blockchain
    if (bitnunBlockchain.addTransaction(transaction)) {
      // Mine block every 10 transactions
      if (actionCount % 10 === 0) {
        const blockHash = bitnunBlockchain.minePendingTransactions(userId);
        toast({
          title: "Block Mined!",
          description: `New block created: ${blockHash.substring(0, 8)}...`,
          duration: 2000,
        });
      }
      
      // Update states
      setTotalBTNEarned(prev => prev + (optimizedReward / 100));
      setBlockchainStats(bitnunBlockchain.getChainStats());
      setAIStats(aiConsensusEngine.getAIStats());
      setUserReputation(aiConsensusEngine.getUserReputation(userId));
      
      // Submit action to backend for persistence
      actionMutation.mutate({
        userId,
        type,
        reward: optimizedReward,
      });

      // Show reward notification with authenticity score
      if (authenticityScore >= 0.8) {
        toast({
          title: "BTN Reward Earned!",
          description: `+${(optimizedReward / 100).toFixed(2)} BTN tokens (${(authenticityScore * 100).toFixed(0)}% authentic)`,
          duration: 2000,
        });
      } else if (authenticityScore >= 0.5) {
        toast({
          title: "Reduced Reward",
          description: `+${(optimizedReward / 100).toFixed(2)} BTN tokens (suspicious activity detected)`,
          duration: 2000,
          variant: "destructive",
        });
      }
    }

    // Show milestone rewards
    const newCount = actionCount + 1;
    if (newCount % 50 === 0) {
      toast({
        title: "Milestone Achieved!",
        description: `${newCount} actions completed! Bonus reward: +2.0 BTN`,
        duration: 3000,
      });
      
      // Award milestone bonus
      setTimeout(() => {
        const bonusTransaction: Transaction = {
          id: `milestone_${Date.now()}`,
          fromAddress: '',
          toAddress: userId,
          amount: 200,
          timestamp: new Date().toISOString(),
          transactionType: 'milestone_bonus',
          carbonOffset: 25,
        };
        
        bitnunBlockchain.addTransaction(bonusTransaction);
      }, 100);
    }
  };

  // Track page interactions for Action Mining
  useEffect(() => {
    const handleClick = () => {
      incrementActions("click", 5);
    };

    const handleScroll = () => {
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        incrementActions("scroll", 2);
      }, 500);
    };

    const handleKeyPress = () => {
      incrementActions("keypress", 3);
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keypress', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [actionCount]);

  const miningStatus = actionMutation.isPending ? "Processing..." : "Mining Active";

  return (
    <ActionMiningContext.Provider 
      value={{
        actionCount,
        miningStatus,
        incrementActions,
        totalBTNEarned,
        blockchainStats,
        aiStats,
        userReputation,
      }}
    >
      {children}
    </ActionMiningContext.Provider>
  );
}

export function useActionMining() {
  const context = useContext(ActionMiningContext);
  if (!context) {
    throw new Error("useActionMining must be used within ActionMiningProvider");
  }
  return context;
}
