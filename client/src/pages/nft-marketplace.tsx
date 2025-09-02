import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export default function NFTMarketplace() {
  const { data: nfts, isLoading } = useQuery({
    queryKey: ["/api/nfts"],
  });

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="title-nft-marketplace">NFT Marketplace</h1>
            <p className="text-muted-foreground">Discover, mint, and trade sustainable NFTs with zero gas fees</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-secondary" data-testid="button-mint-nft">
            <Plus className="mr-2 h-4 w-4" />
            Mint NFT
          </Button>
        </div>

        {/* Filter Bar */}
        <Card className="mb-8" data-testid="card-filters">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Category:</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40" data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Price:</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40" data-testid="select-price">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-10">0-10 BTN</SelectItem>
                    <SelectItem value="10-100">10-100 BTN</SelectItem>
                    <SelectItem value="100+">100+ BTN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" data-testid="button-apply-filters">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NFT Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts?.map((nft) => (
            <Card key={nft.id} className="stats-card overflow-hidden" data-testid={`nft-card-${nft.id}`}>
              <img 
                src={nft.imageUrl} 
                alt={nft.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2" data-testid={`nft-name-${nft.id}`}>{nft.name}</h3>
                <p className="text-sm text-muted-foreground mb-3" data-testid={`nft-description-${nft.id}`}>
                  {nft.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-primary ml-1" data-testid={`nft-price-${nft.id}`}>
                      {(nft.price / 100).toFixed(1)} BTN
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Rank:</span>
                    <span className="font-medium">#{Math.floor(Math.random() * 300) + 1}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {nft.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">by @creator</span>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                  data-testid={`button-buy-nft-${nft.id}`}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!nfts?.length && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No NFTs Available</h3>
            <p className="text-muted-foreground mb-6">Be the first to mint an NFT in our sustainable marketplace</p>
            <Button data-testid="button-mint-first-nft">
              <Plus className="mr-2 h-4 w-4" />
              Mint Your First NFT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
