import { describe, it, expect, bench } from 'vitest';
import { DPCombinationFinder, DFSCombinationFinder, type Item } from '../combinationFinders';

describe('Combination Finder Benchmarks', () => {
//   const testItems: Item[] = [
//     { name: 'Item1', price: 10.50, minCount: 0, maxCount: 5 },
//     { name: 'Item2', price: 25.75, minCount: 1, maxCount: 3 },
//     { name: 'Item3', price: 5.25, minCount: 0, maxCount: 10 },
//     { name: 'Item4', price: 15.00, minCount: 0, maxCount: 4 }
//   ];
  const testItems: Item[] = [
    { name: 'Item1', price: 0.37, minCount: 0, maxCount: 0 },
    { name: 'Item2', price: 0.69, minCount: 0, maxCount: 0 },
    { name: 'Item3', price: 0.99, minCount: 0, maxCount: 0 },
  ];

  const targetPrice = 5.00;

  bench('Dynamic Programming', () => {
    const finder = new DPCombinationFinder();
    const results = finder.findCombinations(testItems, targetPrice);
    expect(results.length).toBeGreaterThan(0);
  });

  bench('DFS Brute Force', () => {
    const finder = new DFSCombinationFinder();
    const results = finder.findCombinations(testItems, targetPrice);
    expect(results.length).toBeGreaterThan(0);
  });

  // Additional test cases for different scenarios
  describe('Different Item Counts', () => {
    const smallItemSet: Item[] = [
      { name: 'Item1', price: 10.00, minCount: 0, maxCount: 5 },
      { name: 'Item2', price: 20.00, minCount: 1, maxCount: 3 }
    ];

    const largeItemSet: Item[] = [
      ...testItems,
      { name: 'Item5', price: 8.50, minCount: 0, maxCount: 8 },
      { name: 'Item6', price: 12.25, minCount: 0, maxCount: 6 },
      { name: 'Item7', price: 30.00, minCount: 0, maxCount: 2 }
    ];

    it('should handle small item sets', () => {
      const finder = new DPCombinationFinder();
      const results = finder.findCombinations(smallItemSet, 50.00);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle large item sets', () => {
      const finder = new DPCombinationFinder();
      const results = finder.findCombinations(largeItemSet, 150.00);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});