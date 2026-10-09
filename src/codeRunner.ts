import { AlgorithmType, ArrayItem, CodeLanguage, VisualizerStep } from './types';

export type ValidationOutcome =
  | 'idle'
  | 'success'
  | 'reverse'
  | 'unsorted'
  | 'cheat'
  | 'syntax_error'
  | 'blank_empty';

export interface CodeRunResult {
  outcome: ValidationOutcome;
  errorMessage?: string;
  steps: VisualizerStep[];
}

/**
 * Transpiles Python sorting code (indentation-based) into executable JS code.
 */
function transpilePythonToJS(pyCode: string): string {
  const rawLines = pyCode.replace(/\r\n/g, '\n').split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  for (let line of rawLines) {
    // Strip comments
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx);
    }
    if (!line.trim()) continue;

    const indentMatch = line.match(/^(\s*)/);
    const currentIndent = indentMatch ? indentMatch[1].length : 0;
    let trimmed = line.trim();

    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('}');
    }

    // Handle inline 'if not swapped: break'
    if (/^if\s+not\s+swapped\s*:\s*break$/.test(trimmed)) {
      jsLines.push('if (!swapped) { break; }');
      continue;
    }

    // Handle tuple swap: a[X], a[Y] = a[Y], a[X]
    const tupleSwapMatch = trimmed.match(/^a\[(.+?)\]\s*,\s*a\[(.+?)\]\s*=\s*a\[(.+?)\]\s*,\s*a\[(.+?)\]\s*;?$/);
    if (tupleSwapMatch) {
      const lhs1 = tupleSwapMatch[1].trim();
      const lhs2 = tupleSwapMatch[2].trim();
      jsLines.push(`__swap(${lhs1}, ${lhs2});`);
      continue;
    }

    // Handle compound statement on one line like: i += 1; a[i], a[j] = a[j], a[i]
    if (trimmed.includes(';')) {
      const parts = trimmed.split(';').map((s) => s.trim()).filter(Boolean);
      const convertedParts = parts.map((p) => {
        const m = p.match(/^a\[(.+?)\]\s*,\s*a\[(.+?)\]\s*=\s*a\[(.+?)\]\s*,\s*a\[(.+?)\]$/);
        if (m) return `__swap(${m[1].trim()}, ${m[2].trim()});`;
        return p + ';';
      });
      jsLines.push(convertedParts.join(' '));
      continue;
    }

    // Replace Python booleans & logical operators
    trimmed = trimmed
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\band\b/g, '&&')
      .replace(/\bor\b/g, '||')
      .replace(/\bnot\s+/g, '!');

    // def func(args):
    const defMatch = trimmed.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*:$/);
    if (defMatch) {
      jsLines.push(`function ${defMatch[1]}(${defMatch[2]}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // for v in range(start, end):
    const range2Match = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\s*\(\s*(.+?)\s*,\s*(.+?)\s*\)\s*:$/);
    if (range2Match) {
      const v = range2Match[1];
      const start = range2Match[2];
      const end = range2Match[3];
      jsLines.push(`for (let ${v} = ${start}; ${v} < ${end}; ${v}++) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // for v in range(end):
    const range1Match = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\s*\(\s*(.+?)\s*\)\s*:$/);
    if (range1Match) {
      const v = range1Match[1];
      const end = range1Match[2];
      jsLines.push(`for (let ${v} = 0; ${v} < ${end}; ${v}++) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // while cond:
    const whileMatch = trimmed.match(/^while\s+(.+?)\s*:$/);
    if (whileMatch) {
      jsLines.push(`while (${whileMatch[1]}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // if cond:
    const ifMatch = trimmed.match(/^if\s+(.+?)\s*:$/);
    if (ifMatch) {
      jsLines.push(`if (${ifMatch[1]}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // elif cond:
    const elifMatch = trimmed.match(/^elif\s+(.+?)\s*:$/);
    if (elifMatch) {
      jsLines.push(`else if (${elifMatch[1]}) {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // else:
    if (/^else\s*:$/.test(trimmed)) {
      jsLines.push(`else {`);
      indentStack.push(currentIndent + 4);
      continue;
    }

    // variable assignment
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/.test(trimmed) && !trimmed.startsWith('a[')) {
      jsLines.push(`var ${trimmed};`);
    } else {
      jsLines.push(`${trimmed};`);
    }
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}

/**
 * Transpiles C99 sorting code into executable JS code.
 */
function transpileCToJS(cCode: string): string {
  let code = cCode;

  // Replace swap(&a[X], &a[Y]) or swap(a, X, Y)
  code = code.replace(/swap\s*\(\s*&\s*a\s*\[\s*(.+?)\s*\]\s*,\s*&\s*a\s*\[\s*(.+?)\s*\]\s*\)/g, '__swap($1, $2)');
  code = code.replace(/swap\s*\(\s*a\s*,\s*(.+?)\s*,\s*(.+?)\s*\)/g, '__swap($1, $2)');

  // Replace function headers: void/int func_name(int a[], size_t n, ...)
  code = code.replace(
    /\b(?:void|int|size_t)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g,
    (_, fnName, paramsStr: string) => {
      const cleanParams = paramsStr
        .split(',')
        .map((p) => {
          const cleaned = p
            .replace(/\b(?:const|unsigned|signed|int|size_t|long|bool)\b/g, '')
            .replace(/\[\s*\]/g, '')
            .replace(/\*/g, '')
            .trim();
          return cleaned;
        })
        .filter(Boolean)
        .join(', ');
      return `function ${fnName}(${cleanParams})`;
    }
  );

  // Replace variable declarations: size_t, int, bool
  code = code.replace(/\b(?:size_t|int|bool)\s+/g, 'let ');

  return code;
}

/**
 * Normalizes JS destructuring swap [a[X], a[Y]] = [a[Y], a[X]] into __swap(X, Y)
 */
function normalizeJSSwaps(jsCode: string): string {
  return jsCode.replace(
    /\[\s*a\s*\[\s*(.+?)\s*\]\s*,\s*a\s*\[\s*(.+?)\s*\]\s*\]\s*=\s*\[\s*a\s*\[\s*(.+?)\s*\]\s*,\s*a\s*\[\s*(.+?)\s*\]\s*\]/g,
    '__swap($1, $2)'
  );
}

/**
 * Runs the user's code on a virtual array and generates crane animation steps.
 */
export function runUserCodeOnCrane(
  userCode: string,
  lang: CodeLanguage,
  algorithm: AlgorithmType,
  initialValues: number[]
): CodeRunResult {
  const trimmed = userCode.trim();
  if (!trimmed) {
    return {
      outcome: 'syntax_error',
      errorMessage: 'Code is empty.',
      steps: [],
    };
  }

  // Anti-cheat check
  if (/\.sort\s*\(|sorted\s*\(/i.test(trimmed)) {
    return {
      outcome: 'cheat',
      steps: [],
    };
  }

  let executableJS = '';
  try {
    if (lang === 'python') {
      executableJS = transpilePythonToJS(trimmed);
    } else if (lang === 'c') {
      executableJS = transpileCToJS(trimmed);
    } else {
      executableJS = normalizeJSSwaps(trimmed);
    }
  } catch (err) {
    return {
      outcome: 'syntax_error',
      errorMessage: err instanceof Error ? err.message : 'Transpilation failed',
      steps: [],
    };
  }

  const n = initialValues.length;
  let currentArray: ArrayItem[] = initialValues.map((v, idx) => ({ id: idx, value: v }));
  const steps: VisualizerStep[] = [];
  let comparaCount = 0;
  let cambiaCount = 0;
  let opCounter = 0;
  const MAX_OPS = 500;

  // Initial step
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
    lockedIndices: [],
    tipKey: 'bubble_compare',
  });

  let lastReadIndex: number | null = null;
  let pendingTempSourceIndex: number | null = null;

  const checkBounds = (idx: number) => {
    if (typeof idx !== 'number' || Number.isNaN(idx) || idx < 0 || idx >= n) {
      throw new Error(`Array index out of bounds: a[${idx}] (valid range: 0..${n - 1})`);
    }
    if (++opCounter > MAX_OPS) {
      throw new Error('Infinite loop detected (exceeded 500 operations)');
    }
  };

  const recordCompare = (idxA: number, idxB: number) => {
    if (idxA === idxB) return;
    const leftIdx = Math.min(idxA, idxB);
    const rightIdx = Math.max(idxA, idxB);
    const valA = currentArray[idxA].value;
    const valB = currentArray[idxB].value;
    comparaCount++;

    steps.push({
      array: [...currentArray],
      i: leftIdx,
      j: rightIdx,
      n,
      swapped: false,
      comparaCount,
      cambiaCount,
      activeLine: 5,
      comparisonText: `a[${idxA}] (${valA}) vs a[${idxB}] (${valB})`,
      cranePosition: leftIdx,
      craneVisible: true,
      craneState: valA > valB ? 'comparing-swap' : 'comparing-noswap',
      liftOffset: 0,
      swappingPair: [leftIdx, rightIdx],
      lockedIndices: [],
      tipKey: 'bubble_compare',
    });
  };

  const performVisualSwap = (idx1: number, idx2: number) => {
    checkBounds(idx1);
    checkBounds(idx2);
    if (idx1 === idx2) return;

    const leftIdx = Math.min(idx1, idx2);
    const rightIdx = Math.max(idx1, idx2);
    const compStr = `${currentArray[leftIdx].value} <-> ${currentArray[rightIdx].value}`;

    steps.push({
      array: [...currentArray],
      i: leftIdx,
      j: rightIdx,
      n,
      swapped: true,
      comparaCount,
      cambiaCount,
      activeLine: 6,
      comparisonText: compStr,
      cranePosition: leftIdx,
      craneVisible: true,
      craneState: 'swap-lift',
      liftOffset: -70,
      swappingPair: [leftIdx, rightIdx],
      lockedIndices: [],
      tipKey: 'bubble_compare',
    });

    cambiaCount++;
    steps.push({
      array: [...currentArray],
      i: leftIdx,
      j: rightIdx,
      n,
      swapped: true,
      comparaCount,
      cambiaCount,
      activeLine: 8,
      comparisonText: compStr,
      cranePosition: leftIdx,
      craneVisible: true,
      craneState: 'swap-cross',
      liftOffset: -70,
      swappingPair: [leftIdx, rightIdx],
      lockedIndices: [],
      tipKey: 'bubble_compare',
    });

    const nextArr = [...currentArray];
    const tmp = nextArr[leftIdx];
    nextArr[leftIdx] = nextArr[rightIdx];
    nextArr[rightIdx] = tmp;
    currentArray = nextArr;

    steps.push({
      array: [...currentArray],
      i: leftIdx,
      j: rightIdx,
      n,
      swapped: true,
      comparaCount,
      cambiaCount,
      activeLine: 9,
      comparisonText: null,
      cranePosition: leftIdx,
      craneVisible: true,
      craneState: 'swap-lower',
      liftOffset: 0,
      swappingPair: [leftIdx, rightIdx],
      lockedIndices: [],
      tipKey: 'bubble_compare',
    });
  };

  // Create Proxy around array values
  const rawValues = [...initialValues];
  const proxyArray = new Proxy(rawValues, {
    get(target, prop) {
      if (prop === 'length') return target.length;
      if (typeof prop === 'string' && /^[0-9]+$/.test(prop)) {
        const idx = Number(prop);
        checkBounds(idx);
        if (lastReadIndex !== null && lastReadIndex !== idx) {
          recordCompare(lastReadIndex, idx);
          pendingTempSourceIndex = lastReadIndex;
          lastReadIndex = null;
        } else {
          lastReadIndex = idx;
          pendingTempSourceIndex = idx;
        }
        return currentArray[idx].value;
      }
      return Reflect.get(target, prop);
    },
    set(target, prop, newValue) {
      if (typeof prop === 'string' && /^[0-9]+$/.test(prop)) {
        const destIdx = Number(prop);
        checkBounds(destIdx);
        lastReadIndex = null;

        // Check if another slot currently holds newValue and is being swapped/shifted
        const sourceIdx = currentArray.findIndex(
          (item, idx) => idx !== destIdx && item.value === newValue
        );

        if (sourceIdx !== -1 && currentArray[destIdx].value !== newValue) {
          performVisualSwap(destIdx, sourceIdx);
        } else if (currentArray[destIdx].value !== newValue) {
          // Direct write fallback
          const nextArr = [...currentArray];
          nextArr[destIdx] = { ...nextArr[destIdx], value: Number(newValue) };
          currentArray = nextArr;
        }
        target[destIdx] = Number(newValue);
        return true;
      }
      return Reflect.set(target, prop, newValue);
    },
  });

  // Execute user function inside sandbox
  try {
    const runnerBody = `
      "use strict";
      ${executableJS}
      if (typeof bubble_sort === 'function') return bubble_sort(a, n);
      if (typeof bubbleSort === 'function') return bubbleSort(a, n);
      if (typeof selection_sort === 'function') return selection_sort(a, n);
      if (typeof selectionSort === 'function') return selectionSort(a, n);
      if (typeof insertion_sort === 'function') return insertion_sort(a, n);
      if (typeof insertionSort === 'function') return insertionSort(a, n);
      if (typeof quick_sort === 'function') return quick_sort(a, 0, n - 1);
      if (typeof quickSort === 'function') return quickSort(a, 0, n - 1);
    `;
    const fn = new Function('a', 'n', '__swap', runnerBody);
    fn(proxyArray, n, performVisualSwap);
  } catch (err) {
    return {
      outcome: 'syntax_error',
      errorMessage: err instanceof Error ? err.message : String(err),
      steps: steps.length > 1 ? steps : [],
    };
  }

  // Evaluate final array state
  const finalValues = currentArray.map((item) => item.value);
  const expectedAsc = [...initialValues].sort((a, b) => a - b);
  const expectedDesc = [...initialValues].sort((a, b) => b - a);

  const isAsc = finalValues.every((v, idx) => v === expectedAsc[idx]);
  const isDesc = finalValues.every((v, idx) => v === expectedDesc[idx]);

  const correctlyPlacedIndices = finalValues
    .map((v, idx) => (v === expectedAsc[idx] ? idx : -1))
    .filter((idx) => idx !== -1);

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
    craneState: isAsc ? 'complete' : 'idle',
    liftOffset: 0,
    swappingPair: null,
    lockedIndices: isAsc ? Array.from({ length: n }, (_, idx) => idx) : correctlyPlacedIndices,
    tipKey: isAsc ? 'complete' : 'bubble_compare',
  });

  return {
    outcome: isAsc ? 'success' : isDesc ? 'reverse' : 'unsorted',
    steps,
  };
}
