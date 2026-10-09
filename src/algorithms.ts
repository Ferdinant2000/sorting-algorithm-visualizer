import { AlgorithmType, ArrayItem, CodeLine, VisualizerStep } from './types';

export const ALGORITHM_CODE: Record<AlgorithmType, { filename: string; lines: CodeLine[] }> = {
  bubble: {
    filename: 'bubble_sort.c',
    lines: [
      { num: 1, text: "void bubble_sort(int a[], size_t n) {" },
      { num: 2, text: "    for (size_t i = 0; i < n - 1; i++) {" },
      { num: 3, text: "        bool swapped = false;" },
      { num: 4, text: "        for (size_t j = 0; j < n - 1 - i; j++) {" },
      { num: 5, text: "            if (a[j] > a[j + 1]) {" },
      { num: 6, text: "                int tmp = a[j];" },
      { num: 7, text: "                a[j] = a[j + 1];" },
      { num: 8, text: "                a[j + 1] = tmp;" },
      { num: 9, text: "                swapped = true;" },
      { num: 10, text: "            }" },
      { num: 11, text: "        }" },
      { num: 12, text: "        if (!swapped) break;" },
      { num: 13, text: "    }" },
      { num: 14, text: "}" },
    ],
  },
  selection: {
    filename: 'selection_sort.c',
    lines: [
      { num: 1, text: "void selection_sort(int a[], size_t n) {" },
      { num: 2, text: "    for (size_t i = 0; i < n - 1; i++) {" },
      { num: 3, text: "        size_t min_idx = i;" },
      { num: 4, text: "        for (size_t j = i + 1; j < n; j++) {" },
      { num: 5, text: "            if (a[j] < a[min_idx]) {" },
      { num: 6, text: "                min_idx = j;" },
      { num: 7, text: "            }" },
      { num: 8, text: "        }" },
      { num: 9, text: "        if (min_idx != i) {" },
      { num: 10, text: "            int tmp = a[i];" },
      { num: 11, text: "            a[i] = a[min_idx]; a[min_idx] = tmp;" },
      { num: 12, text: "        }" },
      { num: 13, text: "    }" },
      { num: 14, text: "}" },
    ],
  },
  insertion: {
    filename: 'insertion_sort.c',
    lines: [
      { num: 1, text: "void insertion_sort(int a[], size_t n) {" },
      { num: 2, text: "    for (size_t i = 1; i < n; i++) {" },
      { num: 3, text: "        int key = a[i];" },
      { num: 4, text: "        int j = i - 1;" },
      { num: 5, text: "        while (j >= 0 && a[j] > key) {" },
      { num: 6, text: "            a[j + 1] = a[j];" },
      { num: 7, text: "            j--;" },
      { num: 8, text: "        }" },
      { num: 9, text: "        a[j + 1] = key;" },
      { num: 10, text: "    }" },
      { num: 11, text: "}" },
    ],
  },
  quick: {
    filename: 'quick_sort.c',
    lines: [
      { num: 1, text: "int partition(int a[], int low, int high) {" },
      { num: 2, text: "    int pivot = a[high]; int i = low - 1;" },
      { num: 3, text: "    for (int j = low; j < high; j++) {" },
      { num: 4, text: "        if (a[j] < pivot) {" },
      { num: 5, text: "            i++; swap(&a[i], &a[j]);" },
      { num: 6, text: "        }" },
      { num: 7, text: "    }" },
      { num: 8, text: "    swap(&a[i + 1], &a[high]);" },
      { num: 9, text: "    return i + 1;" },
      { num: 10, text: "}" },
      { num: 11, text: "void quick_sort(int a[], int low, int high) {" },
      { num: 12, text: "    if (low < high) {" },
      { num: 13, text: "        int pi = partition(a, low, high);" },
      { num: 14, text: "        quick_sort(a, low, pi - 1);" },
      { num: 15, text: "        quick_sort(a, pi + 1, high);" },
      { num: 16, text: "    }" },
      { num: 17, text: "}" },
    ],
  },
};

// 1. Bubble Sort Generator
function generateBubbleSteps(initialValues: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const n = initialValues.length;
  let currentArray: ArrayItem[] = initialValues.map((v, idx) => ({ id: idx, value: v }));
  let comparaCount = 0;
  let cambiaCount = 0;
  const lockedIndices: number[] = [];

  steps.push({
    array: [...currentArray],
    i: 0,
    j: 0,
    n,
    swapped: false,
    comparaCount: 0,
    cambiaCount: 0,
    activeLine: 1,
    comparisonText: null,
    cranePosition: 0,
    craneVisible: false,
    craneState: 'idle',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: [...lockedIndices],
    tipKey: 'bubble_compare',
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    steps.push({
      array: [...currentArray],
      i,
      j: 0,
      n,
      swapped: false,
      comparaCount,
      cambiaCount,
      activeLine: 3,
      comparisonText: null,
      cranePosition: 0,
      craneVisible: false,
      craneState: 'idle',
      liftOffset: 0,
      swappingPair: null,
      lockedIndices: [...lockedIndices],
      tipKey: i === 0 ? 'bubble_compare' : (i === 1 ? 'bubble_sink' : 'bubble_shorten'),
    });

    for (let j = 0; j < n - 1 - i; j++) {
      const leftVal = currentArray[j].value;
      const rightVal = currentArray[j + 1].value;
      const needsSwap = leftVal > rightVal;

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped,
        comparaCount,
        cambiaCount,
        activeLine: 4,
        comparisonText: null,
        cranePosition: j,
        craneVisible: true,
        craneState: 'positioning',
        liftOffset: 0,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: i === 0 ? 'bubble_compare' : (i === 1 ? 'bubble_sink' : 'bubble_shorten'),
      });

      comparaCount++;
      const compStr = `${leftVal} > ${rightVal}`;

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped,
        comparaCount,
        cambiaCount,
        activeLine: 5,
        comparisonText: compStr,
        cranePosition: j,
        craneVisible: true,
        craneState: needsSwap ? 'comparing-swap' : 'comparing-noswap',
        liftOffset: 0,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: 'bubble_compare',
      });

      if (needsSwap) {
        steps.push({
          array: [...currentArray],
          i,
          j,
          n,
          swapped,
          comparaCount,
          cambiaCount,
          activeLine: 6,
          comparisonText: compStr,
          cranePosition: j,
          craneVisible: true,
          craneState: 'swap-lift',
          liftOffset: -70,
          swappingPair: [j, j + 1],
          lockedIndices: [...lockedIndices],
          tipKey: 'bubble_compare',
        });

        cambiaCount++;
        steps.push({
          array: [...currentArray],
          i,
          j,
          n,
          swapped,
          comparaCount,
          cambiaCount,
          activeLine: 8,
          comparisonText: compStr,
          cranePosition: j,
          craneVisible: true,
          craneState: 'swap-cross',
          liftOffset: -70,
          swappingPair: [j, j + 1],
          lockedIndices: [...lockedIndices],
          tipKey: 'bubble_compare',
        });

        const nextArr = [...currentArray];
        const tmp = nextArr[j];
        nextArr[j] = nextArr[j + 1];
        nextArr[j + 1] = tmp;
        currentArray = nextArr;
        swapped = true;

        steps.push({
          array: [...currentArray],
          i,
          j,
          n,
          swapped: true,
          comparaCount,
          cambiaCount,
          activeLine: 9,
          comparisonText: null,
          cranePosition: j,
          craneVisible: true,
          craneState: 'swap-lower',
          liftOffset: 0,
          swappingPair: [j, j + 1],
          lockedIndices: [...lockedIndices],
          tipKey: 'bubble_compare',
        });
      }
    }

    const finalSortedIndex = n - 1 - i;
    if (!lockedIndices.includes(finalSortedIndex)) {
      lockedIndices.push(finalSortedIndex);
    }

    const isEarlyBreak = !swapped;
    steps.push({
      array: [...currentArray],
      i,
      j: n - 1 - i,
      n,
      swapped,
      comparaCount,
      cambiaCount,
      activeLine: 12,
      comparisonText: null,
      cranePosition: n - 1 - i,
      craneVisible: false,
      craneState: 'idle',
      liftOffset: 0,
      swappingPair: null,
      lockedIndices: isEarlyBreak ? Array.from({ length: n }, (_, idx) => idx) : [...lockedIndices],
      tipKey: isEarlyBreak ? 'bubble_break' : (i === 0 ? 'bubble_sink' : 'bubble_shorten'),
    });

    if (isEarlyBreak) break;
  }

  steps.push({
    array: [...currentArray],
    i: n - 1,
    j: 0,
    n,
    swapped: false,
    comparaCount,
    cambiaCount,
    activeLine: 14,
    comparisonText: null,
    cranePosition: 0,
    craneVisible: false,
    craneState: 'complete',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: Array.from({ length: n }, (_, idx) => idx),
    tipKey: 'complete',
  });

  return steps;
}

// 2. Selection Sort Generator
function generateSelectionSteps(initialValues: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const n = initialValues.length;
  let currentArray: ArrayItem[] = initialValues.map((v, idx) => ({ id: idx, value: v }));
  let comparaCount = 0;
  let cambiaCount = 0;
  const lockedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...currentArray],
      i,
      j: i,
      n,
      swapped: false,
      comparaCount,
      cambiaCount,
      activeLine: 3,
      comparisonText: `min = a[${i}] (${currentArray[i].value})`,
      cranePosition: i,
      craneVisible: false,
      craneState: 'idle',
      liftOffset: 0,
      swappingPair: null,
      lockedIndices: [...lockedIndices],
      tipKey: 'selection_search',
    });

    for (let j = i + 1; j < n; j++) {
      comparaCount++;
      const isSmaller = currentArray[j].value < currentArray[minIdx].value;
      const compStr = `${currentArray[j].value} < ${currentArray[minIdx].value}`;

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped: false,
        comparaCount,
        cambiaCount,
        activeLine: 5,
        comparisonText: compStr,
        cranePosition: j - 1,
        craneVisible: true,
        craneState: 'positioning',
        liftOffset: 0,
        swappingPair: [minIdx, j],
        lockedIndices: [...lockedIndices],
        tipKey: 'selection_search',
      });

      if (isSmaller) {
        minIdx = j;
        steps.push({
          array: [...currentArray],
          i,
          j,
          n,
          swapped: false,
          comparaCount,
          cambiaCount,
          activeLine: 6,
          comparisonText: `min_idx = ${minIdx}`,
          cranePosition: Math.min(minIdx, n - 2),
          craneVisible: true,
          craneState: 'comparing-swap',
          liftOffset: 0,
          swappingPair: [i, minIdx],
          lockedIndices: [...lockedIndices],
          tipKey: 'selection_search',
        });
      }
    }

    if (minIdx !== i) {
      cambiaCount++;
      // Crane lifts
      steps.push({
        array: [...currentArray],
        i,
        j: minIdx,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 10,
        comparisonText: `${currentArray[i].value} <-> ${currentArray[minIdx].value}`,
        cranePosition: Math.min(i, minIdx),
        craneVisible: true,
        craneState: 'swap-lift',
        liftOffset: -70,
        swappingPair: [i, minIdx],
        lockedIndices: [...lockedIndices],
        tipKey: 'selection_found',
      });

      steps.push({
        array: [...currentArray],
        i,
        j: minIdx,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 11,
        comparisonText: `swap(a[${i}], a[${minIdx}])`,
        cranePosition: Math.min(i, minIdx),
        craneVisible: true,
        craneState: 'swap-cross',
        liftOffset: -70,
        swappingPair: [i, minIdx],
        lockedIndices: [...lockedIndices],
        tipKey: 'selection_found',
      });

      const nextArr = [...currentArray];
      const tmp = nextArr[i];
      nextArr[i] = nextArr[minIdx];
      nextArr[minIdx] = tmp;
      currentArray = nextArr;

      steps.push({
        array: [...currentArray],
        i,
        j: minIdx,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 12,
        comparisonText: null,
        cranePosition: Math.min(i, minIdx),
        craneVisible: true,
        craneState: 'swap-lower',
        liftOffset: 0,
        swappingPair: [i, minIdx],
        lockedIndices: [...lockedIndices],
        tipKey: 'selection_found',
      });
    }

    lockedIndices.push(i);
  }

  lockedIndices.push(n - 1);
  steps.push({
    array: [...currentArray],
    i: n - 1,
    j: 0,
    n,
    swapped: false,
    comparaCount,
    cambiaCount,
    activeLine: 14,
    comparisonText: null,
    cranePosition: 0,
    craneVisible: false,
    craneState: 'complete',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: Array.from({ length: n }, (_, idx) => idx),
    tipKey: 'complete',
  });

  return steps;
}

// 3. Insertion Sort Generator
function generateInsertionSteps(initialValues: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const n = initialValues.length;
  let currentArray: ArrayItem[] = initialValues.map((v, idx) => ({ id: idx, value: v }));
  let comparaCount = 0;
  let cambiaCount = 0;
  const lockedIndices: number[] = [0];

  for (let i = 1; i < n; i++) {
    steps.push({
      array: [...currentArray],
      i,
      j: i,
      n,
      swapped: false,
      comparaCount,
      cambiaCount,
      activeLine: 3,
      comparisonText: `key = ${currentArray[i].value}`,
      cranePosition: Math.max(0, i - 1),
      craneVisible: true,
      craneState: 'positioning',
      liftOffset: 0,
      swappingPair: [i - 1, i],
      lockedIndices: [...lockedIndices],
      tipKey: 'insertion_pick',
    });

    let j = i - 1;
    while (j >= 0) {
      comparaCount++;
      const needShift = currentArray[j].value > currentArray[j + 1].value;
      const compStr = `${currentArray[j].value} > ${currentArray[j + 1].value}`;

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped: needShift,
        comparaCount,
        cambiaCount,
        activeLine: 5,
        comparisonText: compStr,
        cranePosition: j,
        craneVisible: true,
        craneState: needShift ? 'comparing-swap' : 'comparing-noswap',
        liftOffset: 0,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: needShift ? 'insertion_shift' : 'insertion_pick',
      });

      if (!needShift) break;

      cambiaCount++;
      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 6,
        comparisonText: compStr,
        cranePosition: j,
        craneVisible: true,
        craneState: 'swap-lift',
        liftOffset: -70,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: 'insertion_shift',
      });

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 6,
        comparisonText: compStr,
        cranePosition: j,
        craneVisible: true,
        craneState: 'swap-cross',
        liftOffset: -70,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: 'insertion_shift',
      });

      const nextArr = [...currentArray];
      const tmp = nextArr[j];
      nextArr[j] = nextArr[j + 1];
      nextArr[j + 1] = tmp;
      currentArray = nextArr;

      steps.push({
        array: [...currentArray],
        i,
        j,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 7,
        comparisonText: null,
        cranePosition: j,
        craneVisible: true,
        craneState: 'swap-lower',
        liftOffset: 0,
        swappingPair: [j, j + 1],
        lockedIndices: [...lockedIndices],
        tipKey: 'insertion_shift',
      });

      j--;
    }

    if (!lockedIndices.includes(i)) {
      lockedIndices.push(i);
    }
  }

  steps.push({
    array: [...currentArray],
    i: n - 1,
    j: 0,
    n,
    swapped: false,
    comparaCount,
    cambiaCount,
    activeLine: 11,
    comparisonText: null,
    cranePosition: 0,
    craneVisible: false,
    craneState: 'complete',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: Array.from({ length: n }, (_, idx) => idx),
    tipKey: 'complete',
  });

  return steps;
}

// 4. Quick Sort Generator
function generateQuickSteps(initialValues: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const n = initialValues.length;
  let currentArray: ArrayItem[] = initialValues.map((v, idx) => ({ id: idx, value: v }));
  let comparaCount = 0;
  let cambiaCount = 0;
  const lockedIndices: number[] = [];

  function quickSortHelper(low: number, high: number) {
    if (low >= high) {
      if (low >= 0 && low < n && !lockedIndices.includes(low)) {
        lockedIndices.push(low);
      }
      return;
    }

    const pivotVal = currentArray[high].value;
    let i = low - 1;

    steps.push({
      array: [...currentArray],
      i: low,
      j: high,
      n,
      swapped: false,
      comparaCount,
      cambiaCount,
      activeLine: 2,
      comparisonText: `pivot = ${pivotVal}`,
      cranePosition: Math.max(0, high - 1),
      craneVisible: false,
      craneState: 'idle',
      liftOffset: 0,
      swappingPair: null,
      lockedIndices: [...lockedIndices],
      tipKey: 'quick_pivot',
    });

    for (let j = low; j < high; j++) {
      comparaCount++;
      const isSmaller = currentArray[j].value < pivotVal;
      const compStr = `${currentArray[j].value} < ${pivotVal}`;

      steps.push({
        array: [...currentArray],
        i: Math.max(0, i),
        j,
        n,
        swapped: false,
        comparaCount,
        cambiaCount,
        activeLine: 4,
        comparisonText: compStr,
        cranePosition: Math.min(j, n - 2),
        craneVisible: true,
        craneState: isSmaller ? 'comparing-swap' : 'comparing-noswap',
        liftOffset: 0,
        swappingPair: [j, high],
        lockedIndices: [...lockedIndices],
        tipKey: 'quick_pivot',
      });

      if (isSmaller) {
        i++;
        if (i !== j) {
          cambiaCount++;
          steps.push({
            array: [...currentArray],
            i,
            j,
            n,
            swapped: true,
            comparaCount,
            cambiaCount,
            activeLine: 5,
            comparisonText: `swap(${currentArray[i].value}, ${currentArray[j].value})`,
            cranePosition: Math.min(i, j),
            craneVisible: true,
            craneState: 'swap-lift',
            liftOffset: -70,
            swappingPair: [i, j],
            lockedIndices: [...lockedIndices],
            tipKey: 'quick_swap',
          });

          steps.push({
            array: [...currentArray],
            i,
            j,
            n,
            swapped: true,
            comparaCount,
            cambiaCount,
            activeLine: 5,
            comparisonText: `swap(${currentArray[i].value}, ${currentArray[j].value})`,
            cranePosition: Math.min(i, j),
            craneVisible: true,
            craneState: 'swap-cross',
            liftOffset: -70,
            swappingPair: [i, j],
            lockedIndices: [...lockedIndices],
            tipKey: 'quick_swap',
          });

          const nextArr = [...currentArray];
          const tmp = nextArr[i];
          nextArr[i] = nextArr[j];
          nextArr[j] = tmp;
          currentArray = nextArr;

          steps.push({
            array: [...currentArray],
            i,
            j,
            n,
            swapped: true,
            comparaCount,
            cambiaCount,
            activeLine: 5,
            comparisonText: null,
            cranePosition: Math.min(i, j),
            craneVisible: true,
            craneState: 'swap-lower',
            liftOffset: 0,
            swappingPair: [i, j],
            lockedIndices: [...lockedIndices],
            tipKey: 'quick_swap',
          });
        }
      }
    }

    // Place pivot at i + 1
    const pIdx = i + 1;
    if (pIdx !== high) {
      cambiaCount++;
      steps.push({
        array: [...currentArray],
        i: pIdx,
        j: high,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 8,
        comparisonText: `pivot to a[${pIdx}]`,
        cranePosition: Math.min(pIdx, high),
        craneVisible: true,
        craneState: 'swap-lift',
        liftOffset: -70,
        swappingPair: [pIdx, high],
        lockedIndices: [...lockedIndices],
        tipKey: 'quick_swap',
      });

      steps.push({
        array: [...currentArray],
        i: pIdx,
        j: high,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 8,
        comparisonText: `pivot to a[${pIdx}]`,
        cranePosition: Math.min(pIdx, high),
        craneVisible: true,
        craneState: 'swap-cross',
        liftOffset: -70,
        swappingPair: [pIdx, high],
        lockedIndices: [...lockedIndices],
        tipKey: 'quick_swap',
      });

      const nextArr = [...currentArray];
      const tmp = nextArr[pIdx];
      nextArr[pIdx] = nextArr[high];
      nextArr[high] = tmp;
      currentArray = nextArr;

      steps.push({
        array: [...currentArray],
        i: pIdx,
        j: high,
        n,
        swapped: true,
        comparaCount,
        cambiaCount,
        activeLine: 9,
        comparisonText: null,
        cranePosition: Math.min(pIdx, high),
        craneVisible: true,
        craneState: 'swap-lower',
        liftOffset: 0,
        swappingPair: [pIdx, high],
        lockedIndices: [...lockedIndices],
        tipKey: 'quick_swap',
      });
    }

    if (!lockedIndices.includes(pIdx)) {
      lockedIndices.push(pIdx);
    }

    quickSortHelper(low, pIdx - 1);
    quickSortHelper(pIdx + 1, high);
  }

  quickSortHelper(0, n - 1);

  steps.push({
    array: [...currentArray],
    i: n - 1,
    j: 0,
    n,
    swapped: false,
    comparaCount,
    cambiaCount,
    activeLine: 17,
    comparisonText: null,
    cranePosition: 0,
    craneVisible: false,
    craneState: 'complete',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: Array.from({ length: n }, (_, idx) => idx),
    tipKey: 'complete',
  });

  return steps;
}

export function generateAlgorithmSteps(type: AlgorithmType, array: number[]): VisualizerStep[] {
  switch (type) {
    case 'bubble':
      return generateBubbleSteps(array);
    case 'selection':
      return generateSelectionSteps(array);
    case 'insertion':
      return generateInsertionSteps(array);
    case 'quick':
      return generateQuickSteps(array);
    default:
      return generateBubbleSteps(array);
  }
}
