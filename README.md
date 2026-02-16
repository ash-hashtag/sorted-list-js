# sorted-array

A TypeScript implementation of a sorted array with efficient insertion and search using binary search for larger arrays.


## Features

- Automatic sorting on insertion
- Efficient binary search for arrays with 8+ elements
- TypeScript support with full type definitions
- Custom comparator functions
- Upsert operations (insert or update)
- Extends native Array class

## Usage

```typescript
import { SortedArray } from 'sorted-array';

// Create with a comparator function
const arr = new SortedArray<number>((a, b) => a - b);

// Insert elements (automatically sorted)
arr.push(3, 1, 4, 1, 5);
console.log([...arr]); // [1, 1, 3, 4, 5]

// Create from existing array
const arr2 = SortedArray.fromArray([3, 1, 2], (a, b) => a - b);
console.log([...arr2]); // [1, 2, 3]
```

## API

### Constructor

```typescript
new SortedArray<T>(compareFn: (a: T, b: T) => number)
```

### Methods

- `push(...elements: T[])` - Insert elements maintaining sort order
- `insert(value: T)` - Insert a single element
- `delete(value: T)` - Remove first occurrence of value
- `deleteAt(index: number)` - Remove element at index
- `upsert(value: T)` - Insert if not exists, update if exists
- `pop()` - Remove and return last element
- `clear()` - Remove all elements
- `fromArray(arr: T[], compareFn)` - Static method to create from array

## Use Cases

### 1. Priority Queue / Task Scheduling

```typescript
interface Task {
  id: string;
  priority: number;
  name: string;
}

const tasks = new SortedArray<Task>((a, b) => b.priority - a.priority);
tasks.push(
  { id: '1', priority: 5, name: 'Low priority' },
  { id: '2', priority: 10, name: 'High priority' },
  { id: '3', priority: 7, name: 'Medium priority' }
);

// Always get highest priority task
const nextTask = tasks[0]; // { id: '2', priority: 10, ... }
```

### 2. Leaderboard / Ranking System

```typescript
interface Player {
  name: string;
  score: number;
}

const leaderboard = new SortedArray<Player>((a, b) => b.score - a.score);
leaderboard.push(
  { name: 'Alice', score: 100 },
  { name: 'Bob', score: 150 },
  { name: 'Charlie', score: 120 }
);

// Top 3 players
const top3 = leaderboard.slice(0, 3);
```

### 3. Event Timeline

```typescript
interface Event {
  timestamp: number;
  type: string;
  data: any;
}

const timeline = new SortedArray<Event>((a, b) => a.timestamp - b.timestamp);
timeline.push(
  { timestamp: Date.now() + 1000, type: 'reminder', data: {} },
  { timestamp: Date.now() + 500, type: 'notification', data: {} }
);

// Events are chronologically ordered
```

### 4. Maintaining Unique Sorted Values

```typescript
const uniqueScores = new SortedArray<number>((a, b) => a - b);

// Use upsert to maintain uniqueness
uniqueScores.upsert(10); // true (inserted)
uniqueScores.upsert(10); // false (already exists)
uniqueScores.upsert(5);  // true (inserted)

console.log([...uniqueScores]); // [5, 10]
```

### 5. Price Monitoring

```typescript
interface PricePoint {
  price: number;
  timestamp: number;
}

const prices = new SortedArray<PricePoint>((a, b) => a.price - b.price);
prices.push(
  { price: 100.5, timestamp: Date.now() },
  { price: 99.8, timestamp: Date.now() + 1000 },
  { price: 101.2, timestamp: Date.now() + 2000 }
);

// Quick access to min/max prices
const minPrice = prices[0];
const maxPrice = prices[prices.length - 1];
```

### 6. String Sorting (Alphabetical)

```typescript
const names = new SortedArray<string>((a, b) => a.localeCompare(b));
names.push('Charlie', 'Alice', 'Bob');
console.log([...names]); // ['Alice', 'Bob', 'Charlie']
```

## Performance

- Insert: O(n) worst case, optimized for appending to end
- Search: O(log n) for arrays with 8+ elements, O(n) for smaller arrays
- Delete: O(n) due to array shifting
- Access: O(1) for indexed access

## License

MIT
