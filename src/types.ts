export type AlgorithmType = 'bubble' | 'selection' | 'insertion' | 'quick';

export type CodeLanguage = 'c' | 'python' | 'javascript';

export type AppMode = 'watch' | 'practice';

export type PracticeDifficulty = 'blanks' | 'rewrite' | 'blind';

export type Language = 'en' | 'ru' | 'uz';

export type ThemeMode = 'dark' | 'light';

export type CraneState = 
  | 'idle' 
  | 'positioning' 
  | 'comparing-noswap' 
  | 'comparing-swap' 
  | 'swap-lift' 
  | 'swap-cross' 
  | 'swap-lower' 
  | 'complete';

export interface ArrayItem {
  id: number;
  value: number;
}

export interface VisualizerStep {
  array: ArrayItem[];
  i: number;
  j: number;
  n: number;
  swapped: boolean;
  comparaCount: number;
  cambiaCount: number;
  activeLine: number;
  activeLines?: Record<CodeLanguage, number>;
  comparisonText: string | null;
  cranePosition: number;
  craneVisible: boolean;
  craneState: CraneState;
  liftOffset: number;
  swappingPair: [number, number] | null;
  lockedIndices: number[];
  tipKey: string;
}

export interface CodeLine {
  num: number;
  text: string;
}

export interface BlankSlot {
  id: string;
  answer: string;
  placeholder: string;
  hint: string;
}

export interface BlankLine {
  num: number;
  segments: Array<string | BlankSlot>;
}
