import { AlgorithmType, BlankLine, CodeLanguage, CodeLine } from './types';

export interface MultiLangCodeInfo {
  filename: string;
  badge: string;
  lines: CodeLine[];
  starterRewrite: string;
  starterBlind: string;
  blanks: BlankLine[];
  assembleFromBlanks: (values: Record<string, string>) => string;
}

export const MULTI_LANG_CODE: Record<AlgorithmType, Record<CodeLanguage, MultiLangCodeInfo>> = {
  bubble: {
    c: {
      filename: 'bubble_sort.c',
      badge: 'C99',
      lines: [
        { num: 1, text: 'void bubble_sort(int a[], size_t n) {' },
        { num: 2, text: '    for (size_t i = 0; i < n - 1; i++) {' },
        { num: 3, text: '        bool swapped = false;' },
        { num: 4, text: '        for (size_t j = 0; j < n - 1 - i; j++) {' },
        { num: 5, text: '            if (a[j] > a[j + 1]) {' },
        { num: 6, text: '                int tmp = a[j];' },
        { num: 7, text: '                a[j] = a[j + 1];' },
        { num: 8, text: '                a[j + 1] = tmp;' },
        { num: 9, text: '                swapped = true;' },
        { num: 10, text: '            }' },
        { num: 11, text: '        }' },
        { num: 12, text: '        if (!swapped) break;' },
        { num: 13, text: '    }' },
        { num: 14, text: '}' },
      ],
      starterRewrite: `void bubble_sort(int a[], size_t n) {\n    \n}`,
      starterBlind: `void bubble_sort(int a[], size_t n) {\n    // Write Bubble Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['void bubble_sort(int a[], size_t n) {'] },
        { num: 2, segments: ['    for (size_t i = 0; i < ', { id: 'b1', answer: 'n - 1', placeholder: 'n - ?', hint: 'n - 1' }, '; i++) {'] },
        { num: 3, segments: ['        bool swapped = false;'] },
        { num: 4, segments: ['        for (size_t j = 0; j < ', { id: 'b2', answer: 'n - 1 - i', placeholder: 'n - 1 - ?', hint: 'n - 1 - i' }, '; j++) {'] },
        { num: 5, segments: ['            if (a[j] ', { id: 'b3', answer: '>', placeholder: '?', hint: '>' }, ' a[j + 1]) {'] },
        { num: 6, segments: ['                int tmp = a[j];'] },
        { num: 7, segments: ['                a[j] = ', { id: 'b4', answer: 'a[j + 1]', placeholder: 'a[?]', hint: 'a[j + 1]' }, ';'] },
        { num: 8, segments: ['                a[j + 1] = tmp;'] },
        { num: 9, segments: ['                swapped = true;'] },
        { num: 10, segments: ['            }'] },
        { num: 11, segments: ['        }'] },
        { num: 12, segments: ['        if (!swapped) break;'] },
        { num: 13, segments: ['    }'] },
        { num: 14, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `void bubble_sort(int a[], size_t n) {
    for (size_t i = 0; i < ${v.b1 || 'n - 1'}; i++) {
        bool swapped = false;
        for (size_t j = 0; j < ${v.b2 || 'n - 1 - i'}; j++) {
            if (a[j] ${v.b3 || '>'} a[j + 1]) {
                int tmp = a[j];
                a[j] = ${v.b4 || 'a[j + 1]'};
                a[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    python: {
      filename: 'bubble_sort.py',
      badge: 'Python 3',
      lines: [
        { num: 1, text: 'def bubble_sort(a, n):' },
        { num: 2, text: '    for i in range(n - 1):' },
        { num: 3, text: '        swapped = False' },
        { num: 4, text: '        for j in range(n - 1 - i):' },
        { num: 5, text: '            if a[j] > a[j + 1]:' },
        { num: 6, text: '                a[j], a[j + 1] = a[j + 1], a[j]' },
        { num: 7, text: '                swapped = True' },
        { num: 8, text: '        if not swapped:' },
        { num: 9, text: '            break' },
      ],
      starterRewrite: `def bubble_sort(a, n):\n    `,
      starterBlind: `def bubble_sort(a, n):\n    # Write Bubble Sort from memory\n    `,
      blanks: [
        { num: 1, segments: ['def bubble_sort(a, n):'] },
        { num: 2, segments: ['    for i in range(', { id: 'b1', answer: 'n - 1', placeholder: 'n - ?', hint: 'n - 1' }, '):'] },
        { num: 3, segments: ['        swapped = False'] },
        { num: 4, segments: ['        for j in range(', { id: 'b2', answer: 'n - 1 - i', placeholder: 'n - 1 - ?', hint: 'n - 1 - i' }, '):'] },
        { num: 5, segments: ['            if a[j] ', { id: 'b3', answer: '>', placeholder: '?', hint: '>' }, ' a[j + 1]:'] },
        { num: 6, segments: ['                a[j], a[j + 1] = ', { id: 'b4', answer: 'a[j + 1], a[j]', placeholder: 'a[?], a[?]', hint: 'a[j + 1], a[j]' }] },
        { num: 7, segments: ['                swapped = True'] },
        { num: 8, segments: ['        if not swapped: break'] },
      ],
      assembleFromBlanks: (v) => `def bubble_sort(a, n):
    for i in range(${v.b1 || 'n - 1'}):
        swapped = False
        for j in range(${v.b2 || 'n - 1 - i'}):
            if a[j] ${v.b3 || '>'} a[j + 1]:
                a[j], a[j + 1] = ${v.b4 || 'a[j + 1], a[j]'}
                swapped = True
        if not swapped:
            break`,
    },
    javascript: {
      filename: 'bubbleSort.js',
      badge: 'ES2024',
      lines: [
        { num: 1, text: 'function bubbleSort(a, n) {' },
        { num: 2, text: '    for (let i = 0; i < n - 1; i++) {' },
        { num: 3, text: '        let swapped = false;' },
        { num: 4, text: '        for (let j = 0; j < n - 1 - i; j++) {' },
        { num: 5, text: '            if (a[j] > a[j + 1]) {' },
        { num: 6, text: '                let tmp = a[j];' },
        { num: 7, text: '                a[j] = a[j + 1];' },
        { num: 8, text: '                a[j + 1] = tmp;' },
        { num: 9, text: '                swapped = true;' },
        { num: 10, text: '            }' },
        { num: 11, text: '        }' },
        { num: 12, text: '        if (!swapped) break;' },
        { num: 13, text: '    }' },
        { num: 14, text: '}' },
      ],
      starterRewrite: `function bubbleSort(a, n) {\n    \n}`,
      starterBlind: `function bubbleSort(a, n) {\n    // Write Bubble Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['function bubbleSort(a, n) {'] },
        { num: 2, segments: ['    for (let i = 0; i < ', { id: 'b1', answer: 'n - 1', placeholder: 'n - ?', hint: 'n - 1' }, '; i++) {'] },
        { num: 3, segments: ['        let swapped = false;'] },
        { num: 4, segments: ['        for (let j = 0; j < ', { id: 'b2', answer: 'n - 1 - i', placeholder: 'n - 1 - ?', hint: 'n - 1 - i' }, '; j++) {'] },
        { num: 5, segments: ['            if (a[j] ', { id: 'b3', answer: '>', placeholder: '?', hint: '>' }, ' a[j + 1]) {'] },
        { num: 6, segments: ['                let tmp = a[j];'] },
        { num: 7, segments: ['                a[j] = ', { id: 'b4', answer: 'a[j + 1]', placeholder: 'a[?]', hint: 'a[j + 1]' }, ';'] },
        { num: 8, segments: ['                a[j + 1] = tmp;'] },
        { num: 9, segments: ['                swapped = true;'] },
        { num: 10, segments: ['            }'] },
        { num: 11, segments: ['        }'] },
        { num: 12, segments: ['        if (!swapped) break;'] },
        { num: 13, segments: ['    }'] },
        { num: 14, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `function bubbleSort(a, n) {
    for (let i = 0; i < ${v.b1 || 'n - 1'}; i++) {
        let swapped = false;
        for (let j = 0; j < ${v.b2 || 'n - 1 - i'}; j++) {
            if (a[j] ${v.b3 || '>'} a[j + 1]) {
                let tmp = a[j];
                a[j] = ${v.b4 || 'a[j + 1]'};
                a[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
  },

  selection: {
    c: {
      filename: 'selection_sort.c',
      badge: 'C99',
      lines: [
        { num: 1, text: 'void selection_sort(int a[], size_t n) {' },
        { num: 2, text: '    for (size_t i = 0; i < n - 1; i++) {' },
        { num: 3, text: '        size_t min_idx = i;' },
        { num: 4, text: '        for (size_t j = i + 1; j < n; j++) {' },
        { num: 5, text: '            if (a[j] < a[min_idx]) {' },
        { num: 6, text: '                min_idx = j;' },
        { num: 7, text: '            }' },
        { num: 8, text: '        }' },
        { num: 9, text: '        if (min_idx != i) {' },
        { num: 10, text: '            int tmp = a[i];' },
        { num: 11, text: '            a[i] = a[min_idx]; a[min_idx] = tmp;' },
        { num: 12, text: '        }' },
        { num: 13, text: '    }' },
        { num: 14, text: '}' },
      ],
      starterRewrite: `void selection_sort(int a[], size_t n) {\n    \n}`,
      starterBlind: `void selection_sort(int a[], size_t n) {\n    // Write Selection Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['void selection_sort(int a[], size_t n) {'] },
        { num: 2, segments: ['    for (size_t i = 0; i < n - 1; i++) {'] },
        { num: 3, segments: ['        size_t min_idx = ', { id: 's1', answer: 'i', placeholder: '?', hint: 'i' }, ';'] },
        { num: 4, segments: ['        for (size_t j = ', { id: 's2', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, '; j < n; j++) {'] },
        { num: 5, segments: ['            if (a[j] ', { id: 's3', answer: '<', placeholder: '?', hint: '<' }, ' a[min_idx]) {'] },
        { num: 6, segments: ['                min_idx = ', { id: 's4', answer: 'j', placeholder: '?', hint: 'j' }, ';'] },
        { num: 7, segments: ['            }'] },
        { num: 8, segments: ['        }'] },
        { num: 9, segments: ['        int tmp = a[i]; a[i] = a[min_idx]; a[min_idx] = tmp;'] },
        { num: 10, segments: ['    }'] },
        { num: 11, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `void selection_sort(int a[], size_t n) {
    for (size_t i = 0; i < n - 1; i++) {
        size_t min_idx = ${v.s1 || 'i'};
        for (size_t j = ${v.s2 || 'i + 1'}; j < n; j++) {
            if (a[j] ${v.s3 || '<'} a[min_idx]) {
                min_idx = ${v.s4 || 'j'};
            }
        }
        if (min_idx != i) {
            int tmp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = tmp;
        }
    }
}`,
    },
    python: {
      filename: 'selection_sort.py',
      badge: 'Python 3',
      lines: [
        { num: 1, text: 'def selection_sort(a, n):' },
        { num: 2, text: '    for i in range(n - 1):' },
        { num: 3, text: '        min_idx = i' },
        { num: 4, text: '        for j in range(i + 1, n):' },
        { num: 5, text: '            if a[j] < a[min_idx]:' },
        { num: 6, text: '                min_idx = j' },
        { num: 7, text: '        if min_idx != i:' },
        { num: 8, text: '            a[i], a[min_idx] = a[min_idx], a[i]' },
      ],
      starterRewrite: `def selection_sort(a, n):\n    `,
      starterBlind: `def selection_sort(a, n):\n    # Write Selection Sort from memory\n    `,
      blanks: [
        { num: 1, segments: ['def selection_sort(a, n):'] },
        { num: 2, segments: ['    for i in range(n - 1):'] },
        { num: 3, segments: ['        min_idx = ', { id: 's1', answer: 'i', placeholder: '?', hint: 'i' }] },
        { num: 4, segments: ['        for j in range(', { id: 's2', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, ', n):'] },
        { num: 5, segments: ['            if a[j] ', { id: 's3', answer: '<', placeholder: '?', hint: '<' }, ' a[min_idx]:'] },
        { num: 6, segments: ['                min_idx = ', { id: 's4', answer: 'j', placeholder: '?', hint: 'j' }] },
        { num: 7, segments: ['        if min_idx != i:'] },
        { num: 8, segments: ['            a[i], a[min_idx] = a[min_idx], a[i]'] },
      ],
      assembleFromBlanks: (v) => `def selection_sort(a, n):
    for i in range(n - 1):
        min_idx = ${v.s1 || 'i'}
        for j in range(${v.s2 || 'i + 1'}, n):
            if a[j] ${v.s3 || '<'} a[min_idx]:
                min_idx = ${v.s4 || 'j'}
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]`,
    },
    javascript: {
      filename: 'selectionSort.js',
      badge: 'ES2024',
      lines: [
        { num: 1, text: 'function selectionSort(a, n) {' },
        { num: 2, text: '    for (let i = 0; i < n - 1; i++) {' },
        { num: 3, text: '        let min_idx = i;' },
        { num: 4, text: '        for (let j = i + 1; j < n; j++) {' },
        { num: 5, text: '            if (a[j] < a[min_idx]) {' },
        { num: 6, text: '                min_idx = j;' },
        { num: 7, text: '            }' },
        { num: 8, text: '        }' },
        { num: 9, text: '        if (min_idx !== i) {' },
        { num: 10, text: '            let tmp = a[i];' },
        { num: 11, text: '            a[i] = a[min_idx]; a[min_idx] = tmp;' },
        { num: 12, text: '        }' },
        { num: 13, text: '    }' },
        { num: 14, text: '}' },
      ],
      starterRewrite: `function selectionSort(a, n) {\n    \n}`,
      starterBlind: `function selectionSort(a, n) {\n    // Write Selection Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['function selectionSort(a, n) {'] },
        { num: 2, segments: ['    for (let i = 0; i < n - 1; i++) {'] },
        { num: 3, segments: ['        let min_idx = ', { id: 's1', answer: 'i', placeholder: '?', hint: 'i' }, ';'] },
        { num: 4, segments: ['        for (let j = ', { id: 's2', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, '; j < n; j++) {'] },
        { num: 5, segments: ['            if (a[j] ', { id: 's3', answer: '<', placeholder: '?', hint: '<' }, ' a[min_idx]) {'] },
        { num: 6, segments: ['                min_idx = ', { id: 's4', answer: 'j', placeholder: '?', hint: 'j' }, ';'] },
        { num: 7, segments: ['            }'] },
        { num: 8, segments: ['        }'] },
        { num: 9, segments: ['        let tmp = a[i]; a[i] = a[min_idx]; a[min_idx] = tmp;'] },
        { num: 10, segments: ['    }'] },
        { num: 11, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `function selectionSort(a, n) {
    for (let i = 0; i < n - 1; i++) {
        let min_idx = ${v.s1 || 'i'};
        for (let j = ${v.s2 || 'i + 1'}; j < n; j++) {
            if (a[j] ${v.s3 || '<'} a[min_idx]) {
                min_idx = ${v.s4 || 'j'};
            }
        }
        if (min_idx !== i) {
            let tmp = a[i];
            a[i] = a[min_idx];
            a[min_idx] = tmp;
        }
    }
}`,
    },
  },

  insertion: {
    c: {
      filename: 'insertion_sort.c',
      badge: 'C99',
      lines: [
        { num: 1, text: 'void insertion_sort(int a[], size_t n) {' },
        { num: 2, text: '    for (size_t i = 1; i < n; i++) {' },
        { num: 3, text: '        int key = a[i];' },
        { num: 4, text: '        int j = i - 1;' },
        { num: 5, text: '        while (j >= 0 && a[j] > key) {' },
        { num: 6, text: '            a[j + 1] = a[j];' },
        { num: 7, text: '            j--;' },
        { num: 8, text: '        }' },
        { num: 9, text: '        a[j + 1] = key;' },
        { num: 10, text: '    }' },
        { num: 11, text: '}' },
      ],
      starterRewrite: `void insertion_sort(int a[], size_t n) {\n    \n}`,
      starterBlind: `void insertion_sort(int a[], size_t n) {\n    // Write Insertion Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['void insertion_sort(int a[], size_t n) {'] },
        { num: 2, segments: ['    for (size_t i = ', { id: 'in1', answer: '1', placeholder: '?', hint: '1' }, '; i < n; i++) {'] },
        { num: 3, segments: ['        int key = a[i];'] },
        { num: 4, segments: ['        int j = ', { id: 'in2', answer: 'i - 1', placeholder: 'i - ?', hint: 'i - 1' }, ';'] },
        { num: 5, segments: ['        while (j >= 0 && a[j] ', { id: 'in3', answer: '>', placeholder: '?', hint: '>' }, ' key) {'] },
        { num: 6, segments: ['            a[j + 1] = a[j];'] },
        { num: 7, segments: ['            j--;'] },
        { num: 8, segments: ['        }'] },
        { num: 9, segments: ['        a[', { id: 'in4', answer: 'j + 1', placeholder: 'j + ?', hint: 'j + 1' }, '] = key;'] },
        { num: 10, segments: ['    }'] },
        { num: 11, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `void insertion_sort(int a[], size_t n) {
    for (size_t i = ${v.in1 || '1'}; i < n; i++) {
        int key = a[i];
        int j = ${v.in2 || 'i - 1'};
        while (j >= 0 && a[j] ${v.in3 || '>'} key) {
            a[j + 1] = a[j];
            j--;
        }
        a[${v.in4 || 'j + 1'}] = key;
    }
}`,
    },
    python: {
      filename: 'insertion_sort.py',
      badge: 'Python 3',
      lines: [
        { num: 1, text: 'def insertion_sort(a, n):' },
        { num: 2, text: '    for i in range(1, n):' },
        { num: 3, text: '        key = a[i]' },
        { num: 4, text: '        j = i - 1' },
        { num: 5, text: '        while j >= 0 and a[j] > key:' },
        { num: 6, text: '            a[j + 1] = a[j]' },
        { num: 7, text: '            j -= 1' },
        { num: 8, text: '        a[j + 1] = key' },
      ],
      starterRewrite: `def insertion_sort(a, n):\n    `,
      starterBlind: `def insertion_sort(a, n):\n    # Write Insertion Sort from memory\n    `,
      blanks: [
        { num: 1, segments: ['def insertion_sort(a, n):'] },
        { num: 2, segments: ['    for i in range(', { id: 'in1', answer: '1', placeholder: '?', hint: '1' }, ', n):'] },
        { num: 3, segments: ['        key = a[i]'] },
        { num: 4, segments: ['        j = ', { id: 'in2', answer: 'i - 1', placeholder: 'i - ?', hint: 'i - 1' }] },
        { num: 5, segments: ['        while j >= 0 and a[j] ', { id: 'in3', answer: '>', placeholder: '?', hint: '>' }, ' key:'] },
        { num: 6, segments: ['            a[j + 1] = a[j]'] },
        { num: 7, segments: ['            j -= 1'] },
        { num: 8, segments: ['        a[', { id: 'in4', answer: 'j + 1', placeholder: 'j + ?', hint: 'j + 1' }, '] = key'] },
      ],
      assembleFromBlanks: (v) => `def insertion_sort(a, n):
    for i in range(${v.in1 || '1'}, n):
        key = a[i]
        j = ${v.in2 || 'i - 1'}
        while j >= 0 and a[j] ${v.in3 || '>'} key:
            a[j + 1] = a[j]
            j -= 1
        a[${v.in4 || 'j + 1'}] = key`,
    },
    javascript: {
      filename: 'insertionSort.js',
      badge: 'ES2024',
      lines: [
        { num: 1, text: 'function insertionSort(a, n) {' },
        { num: 2, text: '    for (let i = 1; i < n; i++) {' },
        { num: 3, text: '        let key = a[i];' },
        { num: 4, text: '        let j = i - 1;' },
        { num: 5, text: '        while (j >= 0 && a[j] > key) {' },
        { num: 6, text: '            a[j + 1] = a[j];' },
        { num: 7, text: '            j--;' },
        { num: 8, text: '        }' },
        { num: 9, text: '        a[j + 1] = key;' },
        { num: 10, text: '    }' },
        { num: 11, text: '}' },
      ],
      starterRewrite: `function insertionSort(a, n) {\n    \n}`,
      starterBlind: `function insertionSort(a, n) {\n    // Write Insertion Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['function insertionSort(a, n) {'] },
        { num: 2, segments: ['    for (let i = ', { id: 'in1', answer: '1', placeholder: '?', hint: '1' }, '; i < n; i++) {'] },
        { num: 3, segments: ['        let key = a[i];'] },
        { num: 4, segments: ['        let j = ', { id: 'in2', answer: 'i - 1', placeholder: 'i - ?', hint: 'i - 1' }, ';'] },
        { num: 5, segments: ['        while (j >= 0 && a[j] ', { id: 'in3', answer: '>', placeholder: '?', hint: '>' }, ' key) {'] },
        { num: 6, segments: ['            a[j + 1] = a[j];'] },
        { num: 7, segments: ['            j--;'] },
        { num: 8, segments: ['        }'] },
        { num: 9, segments: ['        a[', { id: 'in4', answer: 'j + 1', placeholder: 'j + ?', hint: 'j + 1' }, '] = key;'] },
        { num: 10, segments: ['    }'] },
        { num: 11, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `function insertionSort(a, n) {
    for (let i = ${v.in1 || '1'}; i < n; i++) {
        let key = a[i];
        let j = ${v.in2 || 'i - 1'};
        while (j >= 0 && a[j] ${v.in3 || '>'} key) {
            a[j + 1] = a[j];
            j--;
        }
        a[${v.in4 || 'j + 1'}] = key;
    }
}`,
    },
  },

  quick: {
    c: {
      filename: 'quick_sort.c',
      badge: 'C99',
      lines: [
        { num: 1, text: 'int partition(int a[], int low, int high) {' },
        { num: 2, text: '    int pivot = a[high]; int i = low - 1;' },
        { num: 3, text: '    for (int j = low; j < high; j++) {' },
        { num: 4, text: '        if (a[j] < pivot) {' },
        { num: 5, text: '            i++; swap(&a[i], &a[j]);' },
        { num: 6, text: '        }' },
        { num: 7, text: '    }' },
        { num: 8, text: '    swap(&a[i + 1], &a[high]);' },
        { num: 9, text: '    return i + 1;' },
        { num: 10, text: '}' },
        { num: 11, text: 'void quick_sort(int a[], int low, int high) {' },
        { num: 12, text: '    if (low < high) {' },
        { num: 13, text: '        int pi = partition(a, low, high);' },
        { num: 14, text: '        quick_sort(a, low, pi - 1);' },
        { num: 15, text: '        quick_sort(a, pi + 1, high);' },
        { num: 16, text: '    }' },
        { num: 17, text: '}' },
      ],
      starterRewrite: `int partition(int a[], int low, int high) {\n    \n}\nvoid quick_sort(int a[], int low, int high) {\n    \n}`,
      starterBlind: `// Write Quick Sort partition & recursive function\nvoid quick_sort(int a[], int low, int high) {\n    \n}`,
      blanks: [
        { num: 1, segments: ['int partition(int a[], int low, int high) {'] },
        { num: 2, segments: ['    int pivot = a[', { id: 'q1', answer: 'high', placeholder: '?', hint: 'high' }, ']; int i = low - 1;'] },
        { num: 3, segments: ['    for (int j = low; j < high; j++) {'] },
        { num: 4, segments: ['        if (a[j] ', { id: 'q2', answer: '<', placeholder: '?', hint: '<' }, ' pivot) {'] },
        { num: 5, segments: ['            i++; swap(a, i, j);'] },
        { num: 6, segments: ['        }'] },
        { num: 7, segments: ['    }'] },
        { num: 8, segments: ['    swap(a, ', { id: 'q3', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, ', high);'] },
        { num: 9, segments: ['    return i + 1;'] },
        { num: 10, segments: ['}'] },
        { num: 11, segments: ['void quick_sort(int a[], int low, int high) {'] },
        { num: 12, segments: ['    if (low < high) {'] },
        { num: 13, segments: ['        int pi = partition(a, low, high);'] },
        { num: 14, segments: ['        quick_sort(a, low, ', { id: 'q4', answer: 'pi - 1', placeholder: 'pi - ?', hint: 'pi - 1' }, ');'] },
        { num: 15, segments: ['        quick_sort(a, pi + 1, high);'] },
        { num: 16, segments: ['    }'] },
        { num: 17, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `int partition(int a[], int low, int high) {
    int pivot = a[${v.q1 || 'high'}];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (a[j] ${v.q2 || '<'} pivot) {
            i++;
            int tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
    }
    int tmp = a[${v.q3 || 'i + 1'}]; a[${v.q3 || 'i + 1'}] = a[high]; a[high] = tmp;
    return i + 1;
}
void quick_sort(int a[], int low, int high) {
    if (low < high) {
        int pi = partition(a, low, high);
        quick_sort(a, low, ${v.q4 || 'pi - 1'});
        quick_sort(a, pi + 1, high);
    }
}`,
    },
    python: {
      filename: 'quick_sort.py',
      badge: 'Python 3',
      lines: [
        { num: 1, text: 'def partition(a, low, high):' },
        { num: 2, text: '    pivot = a[high]; i = low - 1' },
        { num: 3, text: '    for j in range(low, high):' },
        { num: 4, text: '        if a[j] < pivot:' },
        { num: 5, text: '            i += 1' },
        { num: 6, text: '            a[i], a[j] = a[j], a[i]' },
        { num: 7, text: '    a[i + 1], a[high] = a[high], a[i + 1]' },
        { num: 8, text: '    return i + 1' },
        { num: 9, text: 'def quick_sort(a, low, high):' },
        { num: 10, text: '    if low < high:' },
        { num: 11, text: '        pi = partition(a, low, high)' },
        { num: 12, text: '        quick_sort(a, low, pi - 1)' },
        { num: 13, text: '        quick_sort(a, pi + 1, high)' },
      ],
      starterRewrite: `def partition(a, low, high):\n    \ndef quick_sort(a, low, high):\n    `,
      starterBlind: `def quick_sort(a, low, high):\n    # Write Quick Sort from memory\n    `,
      blanks: [
        { num: 1, segments: ['def partition(a, low, high):'] },
        { num: 2, segments: ['    pivot = a[', { id: 'q1', answer: 'high', placeholder: '?', hint: 'high' }, ']; i = low - 1'] },
        { num: 3, segments: ['    for j in range(low, high):'] },
        { num: 4, segments: ['        if a[j] ', { id: 'q2', answer: '<', placeholder: '?', hint: '<' }, ' pivot:'] },
        { num: 5, segments: ['            i += 1; a[i], a[j] = a[j], a[i]'] },
        { num: 6, segments: ['    a[', { id: 'q3', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, '], a[high] = a[high], a[i + 1]'] },
        { num: 7, segments: ['    return i + 1'] },
        { num: 8, segments: ['def quick_sort(a, low, high):'] },
        { num: 9, segments: ['    if low < high:'] },
        { num: 10, segments: ['        pi = partition(a, low, high)'] },
        { num: 11, segments: ['        quick_sort(a, low, ', { id: 'q4', answer: 'pi - 1', placeholder: 'pi - ?', hint: 'pi - 1' }, ')'] },
        { num: 12, segments: ['        quick_sort(a, pi + 1, high)'] },
      ],
      assembleFromBlanks: (v) => `def partition(a, low, high):
    pivot = a[${v.q1 || 'high'}]
    i = low - 1
    for j in range(low, high):
        if a[j] ${v.q2 || '<'} pivot:
            i += 1
            a[i], a[j] = a[j], a[i]
    a[${v.q3 || 'i + 1'}], a[high] = a[high], a[${v.q3 || 'i + 1'}]
    return i + 1
def quick_sort(a, low, high):
    if low < high:
        pi = partition(a, low, high)
        quick_sort(a, low, ${v.q4 || 'pi - 1'})
        quick_sort(a, pi + 1, high)`,
    },
    javascript: {
      filename: 'quickSort.js',
      badge: 'ES2024',
      lines: [
        { num: 1, text: 'function partition(a, low, high) {' },
        { num: 2, text: '    let pivot = a[high], i = low - 1;' },
        { num: 3, text: '    for (let j = low; j < high; j++) {' },
        { num: 4, text: '        if (a[j] < pivot) {' },
        { num: 5, text: '            i++; [a[i], a[j]] = [a[j], a[i]];' },
        { num: 6, text: '        }' },
        { num: 7, text: '    }' },
        { num: 8, text: '    [a[i + 1], a[high]] = [a[high], a[i + 1]];' },
        { num: 9, text: '    return i + 1;' },
        { num: 10, text: '}' },
        { num: 11, text: 'function quickSort(a, low, high) {' },
        { num: 12, text: '    if (low < high) {' },
        { num: 13, text: '        let pi = partition(a, low, high);' },
        { num: 14, text: '        quickSort(a, low, pi - 1);' },
        { num: 15, text: '        quickSort(a, pi + 1, high);' },
        { num: 16, text: '    }' },
        { num: 17, text: '}' },
      ],
      starterRewrite: `function partition(a, low, high) {\n    \n}\nfunction quickSort(a, low, high) {\n    \n}`,
      starterBlind: `function quickSort(a, low, high) {\n    // Write Quick Sort from memory\n    \n}`,
      blanks: [
        { num: 1, segments: ['function partition(a, low, high) {'] },
        { num: 2, segments: ['    let pivot = a[', { id: 'q1', answer: 'high', placeholder: '?', hint: 'high' }, '], i = low - 1;'] },
        { num: 3, segments: ['    for (let j = low; j < high; j++) {'] },
        { num: 4, segments: ['        if (a[j] ', { id: 'q2', answer: '<', placeholder: '?', hint: '<' }, ' pivot) {'] },
        { num: 5, segments: ['            i++; [a[i], a[j]] = [a[j], a[i]];'] },
        { num: 6, segments: ['        }'] },
        { num: 7, segments: ['    }'] },
        { num: 8, segments: ['    [a[', { id: 'q3', answer: 'i + 1', placeholder: 'i + ?', hint: 'i + 1' }, '], a[high]] = [a[high], a[i + 1]];'] },
        { num: 9, segments: ['    return i + 1;'] },
        { num: 10, segments: ['}'] },
        { num: 11, segments: ['function quickSort(a, low, high) {'] },
        { num: 12, segments: ['    if (low < high) {'] },
        { num: 13, segments: ['        let pi = partition(a, low, high);'] },
        { num: 14, segments: ['        quickSort(a, low, ', { id: 'q4', answer: 'pi - 1', placeholder: 'pi - ?', hint: 'pi - 1' }, ');'] },
        { num: 15, segments: ['        quickSort(a, pi + 1, high);'] },
        { num: 16, segments: ['    }'] },
        { num: 17, segments: ['}'] },
      ],
      assembleFromBlanks: (v) => `function partition(a, low, high) {
    let pivot = a[${v.q1 || 'high'}], i = low - 1;
    for (let j = low; j < high; j++) {
        if (a[j] ${v.q2 || '<'} pivot) {
            i++;
            let tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
    }
    let tmp = a[${v.q3 || 'i + 1'}]; a[${v.q3 || 'i + 1'}] = a[high]; a[high] = tmp;
    return i + 1;
}
function quickSort(a, low, high) {
    if (low < high) {
        let pi = partition(a, low, high);
        quickSort(a, low, ${v.q4 || 'pi - 1'});
        quickSort(a, pi + 1, high);
    }
}`,
    },
  },
};

/**
 * Maps the canonical C line number from the default step generator to the
 * corresponding line number in Python or JavaScript.
 */
export function mapActiveLine(
  algorithm: AlgorithmType,
  lang: CodeLanguage,
  cLine: number
): number {
  if (lang === 'c' || lang === 'javascript') {
    return cLine;
  }
  // Python line mapping
  if (algorithm === 'bubble') {
    const map: Record<number, number> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 6,
      8: 6,
      9: 7,
      12: 8,
      14: 9,
    };
    return map[cLine] || 1;
  }
  if (algorithm === 'selection') {
    const map: Record<number, number> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      9: 7,
      10: 8,
      11: 8,
      12: 8,
      14: 8,
    };
    return map[cLine] || 1;
  }
  if (algorithm === 'insertion') {
    const map: Record<number, number> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      9: 8,
      11: 8,
    };
    return map[cLine] || 1;
  }
  if (algorithm === 'quick') {
    const map: Record<number, number> = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 6,
      8: 7,
      9: 8,
      11: 9,
      12: 10,
      13: 11,
      14: 12,
      15: 13,
      17: 13,
    };
    return map[cLine] || 1;
  }
  return cLine;
}
