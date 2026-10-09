'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Volume2,
  VolumeX,
  Sparkles,
  Code2,
  Sun,
  Moon,
  Globe,
  Cpu,
  GraduationCap,
  Eye,
} from 'lucide-react';
import {
  AlgorithmType,
  AppMode,
  CodeLanguage,
  Language,
  ThemeMode,
  VisualizerStep,
} from './types';
import { I18N } from './i18n';
import { generateAlgorithmSteps } from './algorithms';
import { MULTI_LANG_CODE, mapActiveLine } from './codeTemplates';
import { runUserCodeOnCrane, ValidationOutcome } from './codeRunner';
import PracticeTrainerPanel from './PracticeTrainerPanel';
import { sfx } from './sound';

const PRESETS: Record<string, number[]> = {
  default: [5, 1, 8, 7, 6, 3, 2, 4],
  reversed: [8, 7, 6, 5, 4, 3, 2, 1],
  nearlySorted: [1, 2, 4, 3, 5, 6, 7, 8],
};

function highlightCodeTokens(text: string, isDark: boolean) {
  const commentIndex =
    text.indexOf('//') !== -1 ? text.indexOf('//') : text.indexOf('#');
  let codePart = text;
  let commentPart = '';
  if (commentIndex !== -1) {
    codePart = text.substring(0, commentIndex);
    commentPart = text.substring(commentIndex);
  }

  const regex =
    /\b(void|int|size_t|bool|def|function|let|const|for|while|in|range|if|elif|else|break|return|and|or|not|swapped|true|false|True|False|tmp|key|pivot|low|high|pi|min_idx|swap|a|n|i|j)\b|[0-9]+|[^\s\w]+|\s+/g;
  const tokens = codePart.match(regex) || [codePart];

  return (
    <>
      {tokens.map((token, i) => {
        if (/^(void|int|size_t|bool|def|function|let|const)$/.test(token)) {
          return (
            <span
              key={i}
              className={
                isDark ? 'text-cyan-400 font-semibold' : 'text-sky-600 font-semibold'
              }
            >
              {token}
            </span>
          );
        }
        if (/^(for|while|in|range|if|elif|else|break|return|and|or|not)$/.test(token)) {
          return (
            <span
              key={i}
              className={
                isDark
                  ? 'text-purple-400 font-semibold'
                  : 'text-purple-600 font-semibold'
              }
            >
              {token}
            </span>
          );
        }
        if (/^(swapped|key|pivot|min_idx)$/.test(token)) {
          return (
            <span
              key={i}
              className={
                isDark ? 'text-amber-300 font-medium' : 'text-amber-600 font-medium'
              }
            >
              {token}
            </span>
          );
        }
        if (/^(true|false|True|False)$/.test(token)) {
          return (
            <span
              key={i}
              className={
                isDark
                  ? 'text-emerald-400 font-semibold'
                  : 'text-emerald-600 font-semibold'
              }
            >
              {token}
            </span>
          );
        }
        if (/^(tmp|swap)$/.test(token)) {
          return (
            <span key={i} className={isDark ? 'text-sky-300' : 'text-blue-700'}>
              {token}
            </span>
          );
        }
        if (/^[0-9]+$/.test(token)) {
          return (
            <span
              key={i}
              className={
                isDark ? 'text-amber-400 font-mono' : 'text-orange-600 font-mono'
              }
            >
              {token}
            </span>
          );
        }
        if (/^[a-z_][a-z0-9_]*$/i.test(token)) {
          return (
            <span key={i} className={isDark ? 'text-slate-100' : 'text-slate-800'}>
              {token}
            </span>
          );
        }
        return (
          <span key={i} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            {token}
          </span>
        );
      })}
      {commentPart && (
        <span
          className={
            isDark ? 'text-slate-500 italic ml-2' : 'text-slate-400 italic ml-2'
          }
        >
          {commentPart}
        </span>
      )}
    </>
  );
}

export default function AlgorithmVisualizer() {
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [appMode, setAppMode] = useState<AppMode>('watch');
  const [codeLang, setCodeLang] = useState<CodeLanguage>('c');
  const [language, setLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [initialArray, setInitialArray] = useState<number[]>(PRESETS.default);
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom steps generated when the user runs their own code in Practice Mode
  const [customSteps, setCustomSteps] = useState<VisualizerStep[] | null>(null);
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>('idle');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  const t = I18N[language];
  const isDark = theme === 'dark';

  const defaultSteps = useMemo(() => {
    return generateAlgorithmSteps(algorithm, initialArray);
  }, [algorithm, initialArray]);

  const steps = customSteps && customSteps.length > 0 ? customSteps : defaultSteps;
  const currentStep: VisualizerStep = steps[currentStepIndex] || steps[0];
  const codeInfo = MULTI_LANG_CODE[algorithm][codeLang];

  // Mapped active line for current programming language
  const mappedActiveLine = mapActiveLine(algorithm, codeLang, currentStep.activeLine);

  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  const prevStepRef = useRef<VisualizerStep | null>(null);
  useEffect(() => {
    if (prevStepRef.current) {
      if (
        currentStep.activeLine !== prevStepRef.current.activeLine &&
        currentStep.comparisonText
      ) {
        sfx.playCompare();
      }
      if (
        currentStep.craneState === 'swap-cross' &&
        prevStepRef.current.craneState !== 'swap-cross'
      ) {
        sfx.playSwap();
      }
      if (
        currentStep.craneState === 'complete' &&
        prevStepRef.current.craneState !== 'complete'
      ) {
        sfx.playSuccess();
      }
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const baseInterval = 700;
  const activeInterval = Math.max(110, Math.round(baseInterval / speedMultiplier));

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, activeInterval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, activeInterval]);

  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleAlgorithmChange = (algo: AlgorithmType) => {
    setIsPlaying(false);
    setAlgorithm(algo);
    setCustomSteps(null);
    setValidationOutcome('idle');
    setCurrentStepIndex(0);
  };

  const handlePresetChange = (presetKey: string) => {
    setIsPlaying(false);
    setSelectedPreset(presetKey);
    setInitialArray(PRESETS[presetKey]);
    setCustomSteps(null);
    setValidationOutcome('idle');
    setCurrentStepIndex(0);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    setSelectedPreset('custom');
    const shuffled = [1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    setInitialArray(shuffled);
    setCustomSteps(null);
    setValidationOutcome('idle');
    setCurrentStepIndex(0);
  };

  const handleRunCustomCode = (userCode: string) => {
    setIsPlaying(false);
    const res = runUserCodeOnCrane(userCode, codeLang, algorithm, initialArray);
    setValidationOutcome(res.outcome);
    setValidationError(res.errorMessage);
    if (res.steps.length > 0) {
      setCustomSteps(res.steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBack();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStepForward, handleStepBack, handleReset]);

  // Coordinate calculations for Crane & Array Blocks
  const SLOT_WIDTH = 42;
  const SLOT_GAP = 8;
  const SLOT_PITCH = SLOT_WIDTH + SLOT_GAP;
  const STAGE_WIDTH = currentStep.n * SLOT_PITCH - SLOT_GAP;
  const BASELINE_Y = 224;

  const activePair = currentStep.swappingPair;
  const isCraneActive = currentStep.craneVisible;
  const isSwapping = [
    'comparing-swap',
    'swap-lift',
    'swap-cross',
    'swap-lower',
  ].includes(currentStep.craneState);
  const isLifted = ['swap-lift', 'swap-cross'].includes(currentStep.craneState);
  const isCrossing = currentStep.craneState === 'swap-cross';

  const pairLeft = activePair
    ? Math.min(activePair[0], activePair[1])
    : currentStep.cranePosition;
  const pairRight = activePair
    ? Math.max(activePair[0], activePair[1])
    : Math.min(currentStep.n - 1, currentStep.cranePosition + 1);

  const trolleyX = ((pairLeft + pairRight) / 2) * SLOT_PITCH + SLOT_WIDTH / 2;

  const leftItem = activePair ? currentStep.array[pairLeft] : null;
  const rightItem = activePair ? currentStep.array[pairRight] : null;

  const leftVal = leftItem ? leftItem.value : 1;
  const rightVal = rightItem ? rightItem.value : 1;

  const getBlockHeight = (val: number) => 36 + val * 13;
  const leftBlockHeight = getBlockHeight(leftVal);
  const rightBlockHeight = getBlockHeight(rightVal);

  const leftClawTargetX = isCrossing
    ? pairRight * SLOT_PITCH + SLOT_WIDTH / 2
    : pairLeft * SLOT_PITCH + SLOT_WIDTH / 2;

  const rightClawTargetX = isCrossing
    ? pairLeft * SLOT_PITCH + SLOT_WIDTH / 2
    : pairRight * SLOT_PITCH + SLOT_WIDTH / 2;

  const liftY = isLifted ? -68 : 0;
  const leftClawY = BASELINE_Y - leftBlockHeight + liftY;
  const rightClawY = BASELINE_Y - rightBlockHeight + liftY;
  const spreaderY = Math.min(leftClawY, rightClawY) - 28;

  const craneStroke = isSwapping
    ? '#f43f5e'
    : currentStep.craneState === 'complete'
    ? isDark
      ? '#00ffa3'
      : '#059669'
    : isDark
    ? '#38bdf8'
    : '#0284c7';

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#060D1A] text-slate-100' : 'bg-slate-50 text-slate-900'
      } flex flex-col items-center select-none font-sans transition-colors duration-300`}
    >
      {/* Blueprint Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.38 : 0.45,
          backgroundColor: isDark ? '#060D1A' : '#F8FAFC',
          backgroundImage: isDark
            ? `linear-gradient(rgba(14, 165, 233, 0.18) 1px, transparent 1px),
               linear-gradient(90deg, rgba(14, 165, 233, 0.18) 1px, transparent 1px),
               linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px)`
            : `linear-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px),
               linear-gradient(90deg, rgba(148, 163, 184, 0.25) 1px, transparent 1px),
               linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
               linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px, 48px 48px, 12px 12px, 12px 12px',
        }}
      />

      {/* ===================================================================
          1. TOP NAVIGATION BAR
          =================================================================== */}
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md border-b px-4 py-2.5 transition-colors duration-200 ${
          isDark
            ? 'bg-[#060D1A]/90 border-cyan-950/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            : 'bg-white/90 border-slate-200 shadow-sm'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Zone 1: Brand & Algorithm Selector */}
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded-lg border ${
                isDark
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400'
                  : 'bg-sky-50 border-sky-200 text-sky-600'
              }`}
            >
              <Cpu className="w-5 h-5" />
            </div>

            <div>
              <span className="font-mono font-bold tracking-wider text-xs sm:text-sm block">
                {t.appName}
              </span>
              <span
                className={`text-[10px] font-mono tracking-widest block uppercase ${
                  isDark ? 'text-cyan-400/80' : 'text-sky-600'
                }`}
              >
                {t.algorithms[algorithm].name}
              </span>
            </div>

            {/* Algorithm Tabs (Desktop) */}
            <div
              className={`hidden md:flex items-center gap-1 ml-2 p-1 rounded-lg border ${
                isDark
                  ? 'border-slate-800/80 bg-[#040914]'
                  : 'border-slate-200 bg-slate-100'
              }`}
            >
              {(['bubble', 'selection', 'insertion', 'quick'] as AlgorithmType[]).map(
                (algoKey) => (
                  <button
                    key={algoKey}
                    onClick={() => handleAlgorithmChange(algoKey)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                      algorithm === algoKey
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-sky-600 text-white font-bold'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {algoKey.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Zone 2 & 3: Mode Switcher (Demo / Trainer), Language & Theme */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher: Demo vs Trainer */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${
                isDark
                  ? 'bg-[#040914] border-cyan-900/70'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => {
                  setAppMode('watch');
                  setCustomSteps(null);
                  setValidationOutcome('idle');
                  setCurrentStepIndex(0);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  appMode === 'watch'
                    ? isDark
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.modes.watch}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setAppMode('practice');
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  appMode === 'practice'
                    ? isDark
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{t.modes.practice}</span>
              </button>
            </div>

            {/* Mobile Algorithm Selector */}
            <select
              value={algorithm}
              onChange={(e) => handleAlgorithmChange(e.target.value as AlgorithmType)}
              className={`md:hidden px-2 py-1 text-xs font-mono rounded border ${
                isDark
                  ? 'bg-[#09152A] border-cyan-800 text-cyan-200'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="bubble">Bubble</option>
              <option value="selection">Selection</option>
              <option value="insertion">Insertion</option>
              <option value="quick">Quick</option>
            </select>

            {/* UI Language Switcher */}
            <div className="flex items-center gap-1">
              <Globe
                className={`w-3.5 h-3.5 hidden sm:inline ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Language"
                className={`px-2 py-1 text-xs font-mono font-medium rounded border cursor-pointer ${
                  isDark
                    ? 'bg-[#09152A] border-cyan-900 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="uz">UZ</option>
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              title={isDark ? t.actions.themeLight : t.actions.themeDark}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-[#09152A] border-cyan-900/80 text-amber-400 hover:bg-[#0E2040]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN WORKSPACE (Centered in Demo Mode, 2-Column Split in Trainer Mode)
          =================================================================== */}
      <main
        className={`relative z-10 w-full ${
          appMode === 'practice'
            ? 'max-w-6xl px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4 pb-10'
            : 'max-w-[490px] flex flex-col items-center pt-3 pb-8 px-2 sm:px-0'
        }`}
      >
        {/* LEFT COLUMN IN PRACTICE MODE: Interactive Code Trainer */}
        {appMode === 'practice' && (
          <div className="lg:col-span-7 w-full">
            <PracticeTrainerPanel
              algorithm={algorithm}
              codeLang={codeLang}
              onCodeLangChange={setCodeLang}
              uiLang={language}
              isDark={isDark}
              onRunCustomCode={handleRunCustomCode}
              validationOutcome={validationOutcome}
              validationError={validationError}
            />
          </div>
        )}

        {/* RIGHT COLUMN (OR CENTERED IN DEMO MODE): Crane Visualizer & Controls */}
        <div
          className={
            appMode === 'practice'
              ? 'lg:col-span-5 w-full flex flex-col items-center'
              : 'w-full flex flex-col items-center'
          }
        >
          {/* Header & Counters */}
          <header className="w-full flex flex-col items-center text-center mb-2">
            <h1
              className={`text-xl sm:text-2xl font-black tracking-[0.22em] ${
                isDark
                  ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                  : 'text-slate-900'
              }`}
            >
              {t.algorithms[algorithm].name}
            </h1>
            <p
              className={`text-[11px] sm:text-xs font-semibold tracking-[0.2em] mt-0.5 uppercase ${
                isDark ? 'text-cyan-400/90' : 'text-sky-600'
              }`}
            >
              {customSteps ? t.practice.customCodeRunning : t.algorithms[algorithm].subtitle}
            </p>

            {/* Metric Counters: COMPARA & CAMBIA */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono tracking-widest font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {t.compares}
                </span>
                <div
                  className={`min-w-[34px] px-2 py-0.5 border rounded flex items-center justify-center ${
                    isDark
                      ? 'bg-[#0A162B] border-cyan-800/80 shadow-[inset_0_0_8px_rgba(6,182,212,0.15)]'
                      : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <span
                    className={`text-sm font-mono font-bold tabular-nums ${
                      isDark ? 'text-amber-400' : 'text-orange-600'
                    }`}
                  >
                    {currentStep.comparaCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono tracking-widest font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {t.swaps}
                </span>
                <div
                  className={`min-w-[34px] px-2 py-0.5 border rounded flex items-center justify-center ${
                    isDark
                      ? 'bg-[#0A162B] border-cyan-800/80 shadow-[inset_0_0_8px_rgba(6,182,212,0.15)]'
                      : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <span
                    className={`text-sm font-mono font-bold tabular-nums ${
                      isDark ? 'text-amber-400' : 'text-orange-600'
                    }`}
                  >
                    {currentStep.cambiaCount}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Animated Crane & Array Bars Stage */}
          <section
            aria-label="Interactive Array Crane Stage"
            className={`w-full relative h-[255px] sm:h-[265px] my-1 flex items-end justify-center overflow-hidden rounded-lg border backdrop-blur-xs ${
              isDark
                ? 'border-cyan-950/60 bg-[#081224]/50'
                : 'border-slate-200 bg-white/70 shadow-sm'
            }`}
          >
            {/* Overhead Horizontal Crane Rail */}
            <div
              className={`absolute top-[22px] left-3 right-3 h-[3px] flex items-center justify-between ${
                isDark ? 'bg-cyan-900/60' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-1.5 h-3 rounded-xs -translate-y-[0.5px] ${
                  isDark ? 'bg-cyan-500/80' : 'bg-slate-600'
                }`}
              />
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-[1px] h-2 ${
                    isDark ? 'bg-cyan-500/30' : 'bg-slate-400/40'
                  }`}
                />
              ))}
              <div
                className={`w-1.5 h-3 rounded-xs -translate-y-[0.5px] ${
                  isDark ? 'bg-cyan-500/80' : 'bg-slate-600'
                }`}
              />
            </div>

            {/* SVG Canvas for Crane Trolley, Cables & Claws */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox={`0 0 ${STAGE_WIDTH + 60} 265`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="craneGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g transform="translate(30, 0)">
                <AnimatePresence>
                  {isCraneActive && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Top Trolley Carriage */}
                      <motion.g
                        animate={{ x: trolleyX }}
                        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                      >
                        <circle
                          cx="-10"
                          cy="22"
                          r="3.5"
                          fill={isDark ? '#0A162B' : '#FFFFFF'}
                          stroke={craneStroke}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="10"
                          cy="22"
                          r="3.5"
                          fill={isDark ? '#0A162B' : '#FFFFFF'}
                          stroke={craneStroke}
                          strokeWidth="1.5"
                        />
                        <rect
                          x="-14"
                          y="22"
                          width="28"
                          height="6"
                          rx="2"
                          fill={isDark ? '#0A162B' : '#FFFFFF'}
                          stroke={craneStroke}
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="0"
                          cy="34"
                          r="8"
                          fill={isDark ? '#0A162B' : '#FFFFFF'}
                          stroke={craneStroke}
                          strokeWidth="2"
                          filter={isDark ? 'url(#craneGlow)' : undefined}
                        />
                        <circle cx="0" cy="34" r="3" fill={craneStroke} />
                      </motion.g>

                      {/* Suspension Cables & Horizontal Spreader Girder */}
                      <g>
                        <motion.line
                          animate={{
                            x1: trolleyX,
                            y1: 34,
                            x2: leftClawTargetX,
                            y2: spreaderY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                          stroke={craneStroke}
                          strokeWidth="1.8"
                          strokeDasharray="3 1"
                        />

                        <motion.line
                          animate={{
                            x1: trolleyX,
                            y1: 34,
                            x2: rightClawTargetX,
                            y2: spreaderY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                          stroke={craneStroke}
                          strokeWidth="1.8"
                          strokeDasharray="3 1"
                        />

                        <motion.line
                          animate={{
                            x1: leftClawTargetX,
                            y1: spreaderY,
                            x2: rightClawTargetX,
                            y2: spreaderY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                          stroke={craneStroke}
                          strokeWidth="2.5"
                          filter={isDark ? 'url(#craneGlow)' : undefined}
                        />

                        <motion.line
                          animate={{
                            x1: leftClawTargetX,
                            y1: spreaderY,
                            x2: leftClawTargetX,
                            y2: leftClawY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                          stroke={craneStroke}
                          strokeWidth="2"
                        />

                        <motion.line
                          animate={{
                            x1: rightClawTargetX,
                            y1: spreaderY,
                            x2: rightClawTargetX,
                            y2: rightClawY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                          stroke={craneStroke}
                          strokeWidth="2"
                        />

                        {/* Left Claw Gripper */}
                        <motion.g
                          animate={{
                            x: leftClawTargetX,
                            y: leftClawY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                        >
                          <path
                            d={`M -${SLOT_WIDTH / 2 + 2} 4 L -${SLOT_WIDTH / 2 + 2} 0 L ${
                              SLOT_WIDTH / 2 + 2
                            } 0 L ${SLOT_WIDTH / 2 + 2} 4`}
                            fill="none"
                            stroke={craneStroke}
                            strokeWidth="2.5"
                            filter={isDark ? 'url(#craneGlow)' : undefined}
                          />
                          <circle
                            cx={-(SLOT_WIDTH / 2 + 2)}
                            cy="3"
                            r="2.2"
                            fill={craneStroke}
                          />
                          <circle
                            cx={SLOT_WIDTH / 2 + 2}
                            cy="3"
                            r="2.2"
                            fill={craneStroke}
                          />
                        </motion.g>

                        {/* Right Claw Gripper */}
                        <motion.g
                          animate={{
                            x: rightClawTargetX,
                            y: rightClawY,
                          }}
                          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                        >
                          <path
                            d={`M -${SLOT_WIDTH / 2 + 2} 4 L -${SLOT_WIDTH / 2 + 2} 0 L ${
                              SLOT_WIDTH / 2 + 2
                            } 0 L ${SLOT_WIDTH / 2 + 2} 4`}
                            fill="none"
                            stroke={craneStroke}
                            strokeWidth="2.5"
                            filter={isDark ? 'url(#craneGlow)' : undefined}
                          />
                          <circle
                            cx={-(SLOT_WIDTH / 2 + 2)}
                            cy="3"
                            r="2.2"
                            fill={craneStroke}
                          />
                          <circle
                            cx={SLOT_WIDTH / 2 + 2}
                            cy="3"
                            r="2.2"
                            fill={craneStroke}
                          />
                        </motion.g>
                      </g>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            </svg>

            {/* Array Baseline Pedestal Track */}
            <div
              className="absolute bottom-3 flex items-center justify-between"
              style={{ width: `${STAGE_WIDTH + 16}px` }}
            >
              <div
                className={`w-full h-[2px] rounded-full ${
                  isDark ? 'bg-cyan-900/40' : 'bg-slate-300'
                }`}
              />
            </div>

            {/* The Array Columns / Blocks Container */}
            <div
              className="relative z-10 mb-3"
              style={{
                width: `${STAGE_WIDTH}px`,
                height: '210px',
              }}
            >
              {currentStep.array.map((item, index) => {
                const isLocked =
                  currentStep.lockedIndices.includes(index) ||
                  currentStep.craneState === 'complete';
                const isInActivePair =
                  activePair && (index === activePair[0] || index === activePair[1]);
                const isComparingThis = isInActivePair && isCraneActive;

                let targetSlotIndex = index;
                if (isCrossing && activePair) {
                  if (index === activePair[0]) targetSlotIndex = activePair[1];
                  if (index === activePair[1]) targetSlotIndex = activePair[0];
                }

                const targetX = targetSlotIndex * SLOT_PITCH;
                const targetY =
                  isInActivePair && isLifted ? currentStep.liftOffset : 0;
                const heightPx = getBlockHeight(item.value);

                let blockBorderColor = isDark
                  ? 'border-cyan-700/50'
                  : 'border-slate-300';
                let blockBgColor = isDark ? 'bg-[#0B1A30]/85' : 'bg-white';
                let blockTextColor = isDark ? 'text-cyan-100' : 'text-slate-800';
                let blockGlow = 'none';

                if (isLocked) {
                  blockBorderColor = isDark
                    ? 'border-[#00FFA3]'
                    : 'border-emerald-500';
                  blockBgColor = isDark ? 'bg-[#00FFA3]/14' : 'bg-emerald-50';
                  blockTextColor = isDark ? 'text-[#00FFA3]' : 'text-emerald-700';
                  blockGlow = isDark
                    ? '0 0 16px rgba(0, 255, 163, 0.45)'
                    : '0 2px 8px rgba(16, 185, 129, 0.25)';
                } else if (isComparingThis) {
                  if (isSwapping) {
                    blockBorderColor = 'border-rose-500';
                    blockBgColor = isDark ? 'bg-rose-950/50' : 'bg-rose-50';
                    blockTextColor = isDark ? 'text-rose-200' : 'text-rose-700';
                    blockGlow = isDark
                      ? '0 0 18px rgba(244, 63, 94, 0.55)'
                      : '0 2px 8px rgba(244, 63, 94, 0.25)';
                  } else {
                    blockBorderColor = isDark ? 'border-cyan-400' : 'border-sky-500';
                    blockBgColor = isDark ? 'bg-cyan-950/40' : 'bg-sky-50';
                    blockTextColor = isDark ? 'text-cyan-200' : 'text-sky-700';
                    blockGlow = isDark
                      ? '0 0 14px rgba(34, 211, 238, 0.45)'
                      : '0 2px 8px rgba(2, 132, 199, 0.25)';
                  }
                }

                return (
                  <motion.div
                    key={item.id}
                    animate={{
                      x: targetX,
                      y: targetY,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 26,
                    }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: `${SLOT_WIDTH}px`,
                      height: `${heightPx}px`,
                      boxShadow: blockGlow,
                    }}
                    className={`flex flex-col items-center justify-between rounded-sm border-2 ${blockBorderColor} ${blockBgColor} backdrop-blur-xs transition-colors duration-200`}
                  >
                    <div
                      className={`w-full h-[3px] ${
                        isLocked
                          ? isDark
                            ? 'bg-[#00FFA3]'
                            : 'bg-emerald-500'
                          : isComparingThis
                          ? isSwapping
                            ? 'bg-rose-400'
                            : isDark
                            ? 'bg-cyan-400'
                            : 'bg-sky-500'
                          : isDark
                          ? 'bg-cyan-800/40'
                          : 'bg-slate-200'
                      }`}
                    />

                    <div className="flex-1 flex items-center justify-center pb-1">
                      <span
                        className={`font-mono text-base sm:text-lg font-bold tracking-tight ${blockTextColor} tabular-nums`}
                      >
                        {item.value}
                      </span>
                    </div>

                    <div
                      className={`w-2 h-[2px] rounded-full mb-1 ${
                        isDark ? 'bg-cyan-900/60' : 'bg-slate-300'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. CODE VIEWER WINDOW (Shown in Demo Mode) */}
          {appMode === 'watch' && (
            <section
              aria-label="Source Code Window"
              onCopy={(e) => e.preventDefault()}
              className={`w-full mt-2 rounded-xl overflow-hidden border shadow-xl transition-colors duration-200 select-none ${
                isDark
                  ? 'border-slate-700/60 bg-[#091222]/90'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div
                className={`flex items-center justify-between px-3.5 py-2 border-b ${
                  isDark
                    ? 'bg-[#070E1B] border-slate-800/80'
                    : 'bg-slate-100/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/90" />
                </div>

                <div
                  className={`flex items-center gap-1.5 text-xs font-mono font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <Code2
                    className={`w-3.5 h-3.5 ${
                      isDark ? 'text-cyan-400' : 'text-sky-600'
                    }`}
                  />
                  <span>{codeInfo.filename}</span>
                </div>

                {/* Programming Language Switcher inside Code Window Header */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'c', label: 'C' },
                      { id: 'python', label: 'PY' },
                      { id: 'javascript', label: 'JS' },
                    ] as { id: CodeLanguage; label: string }[]
                  ).map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setCodeLang(l.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        codeLang === l.id
                          ? isDark
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-sky-600 text-white'
                          : isDark
                          ? 'text-slate-500 hover:text-slate-300'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2.5 font-mono text-[11px] sm:text-xs leading-[1.65] overflow-x-auto max-h-[200px]">
                {codeInfo.lines.map((line) => {
                  const isActive = mappedActiveLine === line.num;

                  return (
                    <div
                      key={line.num}
                      className={`flex items-center px-3 py-[1.5px] transition-colors duration-150 ${
                        isActive
                          ? isDark
                            ? 'bg-amber-500/22 border-l-4 border-amber-400 shadow-[inset_0_0_10px_rgba(245,158,11,0.15)] text-amber-50'
                            : 'bg-amber-100 border-l-4 border-amber-500 text-amber-950'
                          : isDark
                          ? 'border-l-4 border-transparent text-slate-300 hover:bg-slate-800/25'
                          : 'border-l-4 border-transparent text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-6 shrink-0 text-right pr-3 select-none text-[10px] font-mono ${
                          isActive
                            ? isDark
                              ? 'text-amber-300 font-bold'
                              : 'text-amber-700 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {line.num}
                      </span>

                      <span className="whitespace-pre flex-1">
                        {highlightCodeTokens(line.text, isDark)}
                      </span>

                      {isActive && currentStep.comparisonText && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="ml-auto shrink-0 pl-2"
                        >
                          <span
                            className={`font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border tracking-wider ${
                              isDark
                                ? 'text-rose-400 bg-rose-950/70 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.45)]'
                                : 'text-rose-700 bg-rose-100 border-rose-300'
                            }`}
                          >
                            {currentStep.comparisonText}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. DYNAMIC STATE FOOTER & TIPS */}
          <section className="w-full mt-2 flex flex-col items-center">
            <div
              className={`w-full flex items-center justify-around py-1.5 px-3 rounded-lg border font-mono text-xs sm:text-sm ${
                isDark
                  ? 'bg-[#070F1E]/80 border-cyan-900/50'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">n =</span>
                <span
                  className={`font-bold tabular-nums ${
                    isDark ? 'text-cyan-300' : 'text-sky-600'
                  }`}
                >
                  {currentStep.n}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">i =</span>
                <span
                  className={`font-bold tabular-nums ${
                    isDark ? 'text-cyan-300' : 'text-sky-600'
                  }`}
                >
                  {currentStep.i}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">j =</span>
                <span
                  className={`font-bold tabular-nums ${
                    isDark ? 'text-cyan-300' : 'text-sky-600'
                  }`}
                >
                  {currentStep.j}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">swapped =</span>
                <span
                  className={`font-bold tabular-nums ${
                    currentStep.swapped
                      ? isDark
                        ? 'text-amber-400'
                        : 'text-amber-600'
                      : 'text-slate-400'
                  }`}
                >
                  {currentStep.swapped ? 'true' : 'false'}
                </span>
              </div>
            </div>

            {/* Educational Tip Banner */}
            <div className="mt-2 text-center px-2 py-1 w-full min-h-[34px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${currentStep.tipKey}-${language}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className={`text-[11px] sm:text-xs font-mono font-medium tracking-[0.16em] uppercase ${
                    isDark
                      ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'text-sky-700'
                  }`}
                >
                  {t.tips[currentStep.tipKey] || t.tips.complete}
                </motion.p>
              </AnimatePresence>
            </div>
          </section>

          {/* 5. INTERACTIVE PLAYBACK CONTROLS */}
          <section
            aria-label="Controls Panel"
            className={`w-full mt-2 p-3 rounded-xl border flex flex-col gap-3 transition-colors ${
              isDark
                ? 'border-cyan-900/60 bg-[#081326]/75 backdrop-blur-md'
                : 'border-slate-200 bg-white/90 shadow-sm'
            }`}
          >
            {/* Main Action Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleStepBack}
                disabled={currentStepIndex === 0}
                title={t.actions.stepBack}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 disabled:pointer-events-none ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <StepBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                title={isPlaying ? t.actions.pause : t.actions.start}
                className={`flex-1 py-2 px-4 rounded-lg font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all border shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30'
                    : isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>{t.actions.pause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {currentStepIndex >= steps.length - 1
                        ? t.actions.reset
                        : t.actions.start}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIndex >= steps.length - 1}
                title={t.actions.stepForward}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-30 disabled:pointer-events-none ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <StepForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                title={t.actions.reset}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSoundEnabled((prev) => !prev)}
                title={soundEnabled ? t.actions.mute : t.actions.unmute}
                className={`p-2 rounded-lg border transition-colors ${
                  soundEnabled
                    ? isDark
                      ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                      : 'bg-sky-50 border-sky-300 text-sky-600'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700/60 text-slate-500'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Progress Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{t.progress}</span>
                <span>
                  {t.step} {currentStepIndex + 1} / {steps.length}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={steps.length - 1}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Number(e.target.value));
                }}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700/40 rounded-lg cursor-pointer"
              />
            </div>

            {/* Speed & Presets */}
            <div
              className={`flex flex-wrap items-center justify-between gap-2 pt-1 border-t text-xs ${
                isDark ? 'border-cyan-950/70' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 mr-1">
                  {t.speed}:
                </span>
                {[0.5, 1, 2, 3].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      speedMultiplier === spd
                        ? isDark
                          ? 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : 'bg-sky-600 text-white'
                        : isDark
                        ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => handlePresetChange('default')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    selectedPreset === 'default'
                      ? isDark
                        ? 'bg-cyan-900/60 border border-cyan-500/60 text-cyan-200'
                        : 'bg-sky-100 border border-sky-300 text-sky-800'
                      : isDark
                      ? 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.presets.default}
                </button>

                <button
                  onClick={() => handlePresetChange('reversed')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    selectedPreset === 'reversed'
                      ? isDark
                        ? 'bg-cyan-900/60 border border-cyan-500/60 text-cyan-200'
                        : 'bg-sky-100 border border-sky-300 text-sky-800'
                      : isDark
                      ? 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.presets.reversed}
                </button>

                <button
                  onClick={handleRandomize}
                  title="Random Array"
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1 ${
                    isDark
                      ? 'bg-slate-800/60 text-slate-300 hover:text-cyan-300 hover:bg-slate-700/60'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                  <span>{t.presets.random}</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
