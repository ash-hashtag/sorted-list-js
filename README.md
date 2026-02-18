# sorted-array

A TypeScript implementation of sorted arrays with efficient insertion and search using binary search.

## Implementations

### SortedArray
Single array implementation, best for general use and random insertions.

### DoubleSortedArray
Dual array implementation optimized for sequential/reverse insertions and when insertions cluster at ends.

## Features

- Automatic sorting on insertion
- Efficient binary search
- TypeScript support with full type definitions
- Custom comparator functions
- Upsert operations (insert or update)
- SortedArray extends native Array class

## Usage

### SortedArray

```typescript
import { SortedArray } from 'sorted-array';

const arr = new SortedArray<number>((a, b) => a - b);
arr.push(3, 1, 4, 1, 5);
console.log([...arr]); // [1, 1, 3, 4, 5]

const arr2 = SortedArray.fromArray([3, 1, 2], (a, b) => a - b);
console.log([...arr2]); // [1, 2, 3]
```

### DoubleSortedArray

```typescript
import { DoubleSortedArray } from 'sorted-array';

const arr = new DoubleSortedArray<number>((a, b) => a - b);
for (let i = 0; i < 100; i++) arr.insert(i);
console.log(arr.at(0)); // 0
console.log([...arr]); // [0, 1, 2, ..., 99]
```

## API

### SortedArray

```typescript
new SortedArray<T>(compareFn: (a: T, b: T) => number)
```

- `push(...elements: T[])` - Insert elements maintaining sort order
- `insert(value: T)` - Insert a single element
- `delete(value: T)` - Remove first occurrence of value
- `deleteAt(index: number)` - Remove element at index
- `upsert(value: T)` - Insert if not exists, update if exists
- `pop()` - Remove and return last element
- `clear()` - Remove all elements
- `fromArray(arr: T[], compareFn)` - Static method to create from array

### DoubleSortedArray

```typescript
new DoubleSortedArray<T>(compareFn: (a: T, b: T) => number)
```

- `insert(value: T)` - Insert element
- `at(index: number)` - Access element by index
- `toArray()` - Convert to regular array
- `length` - Get total element count
- Iterable via `[Symbol.iterator]()`

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

### Complexity

#### SortedArray
- Insert: O(n) worst case, optimized for appending to end
- Search: O(log n) for arrays with 8+ elements, O(n) for smaller arrays
- Delete: O(n) due to array shifting
- Access: O(1) for indexed access

#### DoubleSortedArray
- Insert: O(n) worst case, but significantly faster for sequential/reverse patterns
- Search: O(log n) via binary search
- Access: O(1) via at() method

### Benchmark Results

Performance comparison vs Regular Array with sort() (speedup multiplier):

#### Node.js (npx tsx)

##### 100 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 0.24ms | 0.35ms (0.7x) | 0.26ms (0.9x) |
| Reverse | 0.12ms | 0.46ms (0.3x) | 0.32ms (0.4x) |
| Random | 0.21ms | 0.26ms (0.8x) | 0.35ms (0.6x) |
| Front/Back | 0.18ms | 0.41ms (0.4x) | 0.10ms (1.9x) |

##### 1,000 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 8.50ms | 1.53ms (5.6x) | 1.34ms (6.4x) |
| Reverse | 9.15ms | 21.13ms (0.4x) | 1.03ms (8.9x) |
| Random | 8.32ms | 10.83ms (0.8x) | 7.46ms (1.1x) |
| Front/Back | 7.93ms | 10.74ms (0.7x) | 0.65ms (12.2x) |

##### 10,000 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 707.39ms | 5.95ms (118.9x) | 5.91ms (119.6x) |
| Reverse | 723.70ms | 1874.04ms (0.4x) | 5.49ms (131.9x) |
| Random | 702.34ms | 956.45ms (0.7x) | 485.74ms (1.4x) |
| Front/Back | 690.07ms | 952.59ms (0.7x) | 5.34ms (129.1x) |

**Key Insights:**
- Both implementations show dramatic improvements over Regular Array + sort() at scale (1000+ elements)
- DoubleSortedArray excels at sequential, reverse, and front/back patterns (up to 131.9x faster)
- SortedArray is best for sequential patterns (up to 118.9x faster)
- For random insertions, DoubleSortedArray maintains better performance
- At small sizes (100 elements), overhead makes Regular Array competitive

#### Bun Runtime

##### 100 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 0.19ms | 0.63ms (0.3x) | 0.38ms (0.5x) |
| Reverse | 0.10ms | 0.23ms (0.5x) | 0.24ms (0.4x) |
| Random | 0.12ms | 0.12ms (1.0x) | 0.11ms (1.1x) |
| Front/Back | 0.09ms | 0.06ms (1.6x) | 0.07ms (1.3x) |

##### 1,000 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 6.36ms | 0.52ms (12.3x) | 0.51ms (12.5x) |
| Reverse | 6.36ms | 0.51ms (12.5x) | 0.50ms (12.7x) |
| Random | 9.39ms | 0.54ms (17.3x) | 0.72ms (13.0x) |
| Front/Back | 6.23ms | 0.45ms (13.9x) | 0.42ms (14.9x) |

##### 10,000 Elements
| Pattern | Regular Array | SortedArray | DoubleSortedArray |
|---------|--------------|-------------|-------------------|
| Sequential | 587.27ms | 3.79ms (155.0x) | 3.99ms (147.2x) |
| Reverse | 621.13ms | 12.59ms (49.3x) | 3.49ms (177.9x) |
| Random | 952.95ms | 10.00ms (95.3x) | 9.21ms (103.4x) |
| Front/Back | 639.10ms | 8.11ms (78.8x) | 4.07ms (157.0x) |

**Key Insights:**
- Bun shows even better performance with both implementations (up to 177.9x faster)
- SortedArray performs exceptionally well on random insertions in Bun (up to 95.3x faster)
- DoubleSortedArray maintains superior performance on reverse and front/back patterns
- Both implementations benefit from Bun's optimized runtime

## When to Use DoubleSortedArray

Use DoubleSortedArray when:
- Insertions are mostly sequential (ascending order)
- Insertions are mostly reverse (descending order)
- Insertions cluster at the beginning or end of the range
- You're building a sorted list from streaming data

Use SortedArray when:
- Insertions are uniformly random
- You need full Array API compatibility
- You need delete/upsert operations

## License

MIT
