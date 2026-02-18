import { DoubleSortedArray, SortedArray } from './index';

const numCmp = (a: number, b: number) => a - b;

function benchmark(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const time = performance.now() - start;
  console.log(`${name}: ${time.toFixed(2)}ms`);
  return time;
}

function runBenchmark(name: string, size: number, values: number[]) {
  console.log(`\n${name} (${size} elements):`);
  
  const regularTime = benchmark('  Regular Array', () => {
    const arr: number[] = [];
    for (const val of values) {
      arr.push(val);
      arr.sort(numCmp);
    }
  });
  
  const sortedTime = benchmark('  SortedArray', () => {
    const arr = new SortedArray<number>(numCmp);
    for (const val of values) arr.insert(val);
  });
  
  const doubleTime = benchmark('  DoubleSortedArray', () => {
    const arr = new DoubleSortedArray<number>(numCmp);
    for (const val of values) arr.insert(val);
  });
  
  console.log(`  Speedup vs Regular: SortedArray ${(regularTime / sortedTime).toFixed(1)}x, DoubleSortedArray ${(regularTime / doubleTime).toFixed(1)}x`);
}

const sizes = [100, 1000, 10_000];

for (const size of sizes) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`BENCHMARK WITH ${size} ELEMENTS`);
  console.log('='.repeat(50));
  
  runBenchmark('Sequential insertions', size, Array.from({ length: size }, (_, i) => i));
  runBenchmark('Reverse insertions', size, Array.from({ length: size }, (_, i) => size - 1 - i));
  runBenchmark('Random insertions', size, Array.from({ length: size }, () => Math.floor(Math.random() * size * 10)));
  runBenchmark('Front/Back insertions', size, Array.from({ length: size }, (_, i) => i % 2 == 0 ? i : -i));
}
