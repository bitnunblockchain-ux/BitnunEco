import { useActionMining } from "@/hooks/use-action-mining";

export default function MiningCounter() {
  const { actionCount, miningStatus } = useActionMining();

  return (
    <div 
      className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg z-50 mining-glow"
      data-testid="mining-counter"
    >
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-primary-foreground rounded-full mining-pulse"></div>
        <span className="text-sm font-medium">
          Actions: <span data-testid="action-count">{actionCount}</span>
        </span>
      </div>
    </div>
  );
}
