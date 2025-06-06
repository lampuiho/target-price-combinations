export interface Item {
  name: string;
  price: number;
  minCount: number;
  maxCount: number;
}

export interface CombinationResult {
  counts: number[];
  total: number;
  difference: number;
}

export interface CombinationFinder {
  findCombinations(items: Item[], targetPrice: number): CombinationResult[];
}

export class DPCombinationFinder implements CombinationFinder {
  findCombinations(items: Item[], targetPrice: number): CombinationResult[] {
    const formattedItems = items.map(item => ({
      price: item.price,
      minCount: item.minCount || 0,
      maxCount: item.maxCount || Infinity
    }));
    
    const n = formattedItems.length;
    const currentCounts = new Array(n).fill(0);
    const topResults: CombinationResult[] = [];
    
    // Initialize with minimum counts
    for (let i = 0; i < n; i++) {
      currentCounts[i] = formattedItems[i].minCount;
    }

    const dp = (index: number, currentPrice: number) => {
      if (index === n) {
        if (currentPrice >= targetPrice) {
          const difference = currentPrice - targetPrice;
          const result = {
            counts: [...currentCounts],
            total: currentPrice,
            difference
          };

          // Insert the result in the correct position to maintain sorted order
          let insertIndex = topResults.findIndex(r => r.difference > difference);
          if (insertIndex === -1 && topResults.length < 10) {
            insertIndex = topResults.length;
          }

          if (insertIndex !== -1) {
            topResults.splice(insertIndex, 0, result);
            // Keep only top 10 results
            if (topResults.length > 10) {
              topResults.pop();
            }
          }
        }
        return;
      }
      
      const item = formattedItems[index];
      const maxCount = Math.min(
        item.maxCount,
        Math.floor((targetPrice * 2 - currentPrice) / item.price) + 1
      );
      
      for (let count = item.minCount; count <= maxCount; count++) {
        currentCounts[index] = count;
        dp(index + 1, currentPrice + count * item.price);
        
        // Early termination if we have 10 results and current path can't produce better results
        if (topResults.length === 10 && 
            currentPrice + count * item.price > targetPrice + topResults[9]?.difference) {
          break;
        }
      }
    };
    
    dp(0, 0);
    
    return topResults;
  }
}

export class DFSCombinationFinder implements CombinationFinder {
  findCombinations(items: Item[], targetPrice: number): CombinationResult[] {
    const formattedItems = items.map(item => ({
      price: item.price,
      minCount: item.minCount || 0,
      maxCount: item.maxCount || Infinity
    }));
    
    const n = formattedItems.length;
    const currentCounts = new Array(n).fill(0);
    const topResults: CombinationResult[] = [];
    
    // Initialize with minimum counts
    for (let i = 0; i < n; i++) {
      currentCounts[i] = formattedItems[i].minCount;
    }

    const dfs = (index: number, currentPrice: number) => {
      if (index === n) {
        if (currentPrice >= targetPrice) {
          const difference = currentPrice - targetPrice;
          const result = {
            counts: [...currentCounts],
            total: currentPrice,
            difference
          };

          // Maintain top 10 results sorted by difference
          let insertIndex = topResults.findIndex(r => r.difference > difference);
          if (insertIndex === -1 && topResults.length < 10) {
            insertIndex = topResults.length;
          }

          if (insertIndex !== -1) {
            topResults.splice(insertIndex, 0, result);
            if (topResults.length > 10) {
              topResults.pop();
            }
          }
        }
        return;
      }
    
      const item = formattedItems[index];
      const maxPossible = Math.min(
        item.maxCount,
        Math.floor((targetPrice * 2 - currentPrice) / item.price) + 1
      );
      
      for (let count = item.minCount; count <= maxPossible; count++) {
        currentCounts[index] = count;
        dfs(index + 1, currentPrice + count * item.price);
        
        // Early termination if we have 10 results and current path can't produce better results
        if (topResults.length === 10 && 
            currentPrice + count * item.price > targetPrice + topResults[9]?.difference) {
          break;
        }
      }
    };
    
    dfs(0, 0);
    
    return topResults;
  }
}