<script setup lang="ts">
import { ref, reactive } from 'vue';
import { type CombinationFinder, DPCombinationFinder, DFSCombinationFinder } from './combinationFinders';

interface Item {
  name: string;
  price: number;
  minCount: number;
  maxCount: number;
}
interface CombinationResult {
  counts: number[];
  total: number;
}
const newItem = reactive({
  name: '',
  price: 0,
  minCount: 0,
  maxCount: 0
});

const items = ref<Item[]>([]);
const targetPrice = ref(0);
const results = ref<CombinationResult[]>([]);
const totalResults = ref(0);
const bestMatchPrice = ref(0);
const selectedAlgorithm = ref<'dp' | 'dfs'>('dp');

const formatPrice = (price: number): string => {
  return price.toFixed(2);
};
const addItem = () => {
  if (!newItem.name || !newItem.price) return;
  
  items.value.push({
    name: newItem.name,
    price: parseFloat(newItem.price.toFixed(2)),
    minCount: newItem.minCount || 0,
    maxCount: newItem.maxCount || Infinity
  });
  
  // Reset form
  newItem.name = '';
  newItem.price = 0;
  newItem.minCount = 0;
  newItem.maxCount = 0;
};
const removeItem = (index: number) => {
  items.value.splice(index, 1);
};
const calculateCombinations = () => {
  if (!targetPrice.value || items.value.length === 0) return;
  
  const finder: CombinationFinder = selectedAlgorithm.value === 'dp' 
    ? new DPCombinationFinder() 
    : new DFSCombinationFinder();
  
  const combinations = finder.findCombinations(items.value, targetPrice.value);
  
  results.value = combinations.slice(0, 10);
  totalResults.value = combinations.length;
  bestMatchPrice.value = combinations.length > 0 ? combinations[0].total : 0;
};
</script>
<template>
  <div class="calculator">
    <h1>Item Combination Calculator</h1>
    
    <div class="item-form">
      <h2>Add Item</h2>
      <div class="form-group">
        <label for="itemName">Name:</label>
        <input id="itemName" v-model="newItem.name" placeholder="Item name">
      </div>
      <div class="form-group">
        <label for="itemPrice">Price:</label>
        <input id="itemPrice" v-model.number="newItem.price" type="number" step="0.01" min="0.01" placeholder="0.00">
      </div>
      <div class="form-group">
        <label for="itemMin">Min Count:</label>
        <input id="itemMin" v-model.number="newItem.minCount" type="number" min="0" placeholder="0 (no min)">
      </div>
      <div class="form-group">
        <label for="itemMax">Max Count:</label>
        <input id="itemMax" v-model.number="newItem.maxCount" type="number" min="0" placeholder="0 (no max)">
      </div>
      <button @click="addItem">Add Item</button>
    </div>
    
    <div class="items-list">
      <h2>Current Items</h2>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Min Count</th>
            <th>Max Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ formatPrice(item.price) }}</td>
            <td>{{ item.minCount || 'None' }}</td>
            <td>{{ item.maxCount || 'None' }}</td>
            <td><button @click="removeItem(index)">Remove</button></td>
          </tr>
        </tbody>
      </table>
      <p v-else>No items added yet.</p>
    </div>
    
    <div class="target-form">
      <h2>Calculate Combinations</h2>
      <div class="form-group">
        <label for="targetPrice">Target Price:</label>
        <input id="targetPrice" v-model.number="targetPrice" type="number" step="0.01" min="0.01" placeholder="0.00">
      </div>
      <div class="form-group">
        <label>Algorithm:</label>
        <select v-model="selectedAlgorithm">
          <option value="dp">Dynamic Programming</option>
          <option value="dfs">DFS Brute Force</option>
        </select>
      </div>
      <button @click="calculateCombinations">Calculate</button>
    </div>
    
    <tr v-for="(result, index) in results" :key="index">
      <td>
        <span v-for="(count, itemIndex) in result.counts" :key="itemIndex">
          {{ items[itemIndex].name }}: {{ count }},
        </span>
      </td>
      <td>{{ formatPrice(result.total) }}</td>
      <td>+{{ formatPrice(result.total - targetPrice) }}</td>
    </tr>
  </div>
</template>
<style scoped>
.calculator {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.item-form, .target-form, .results {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.form-group {
  margin-bottom: 10px;
}
label {
  display: inline-block;
  width: 120px;
}
input {
  width: 100px;
  padding: 5px;
}
button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
button:hover {
  background-color: #45a049;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>