'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import {
  AlgorithmType,
  BlankSlot,
  CodeLanguage,
  Language,
  PracticeDifficulty,
} from './types';
import { I18N } from './i18n';
import { MULTI_LANG_CODE } from './codeTemplates';
import { ValidationOutcome } from './codeRunner';

interface PracticeTrainerPanelProps {
  algorithm: AlgorithmType;
  codeLang: CodeLanguage;
  onCodeLangChange: (lang: CodeLanguage) => void;
  uiLang: Language;
  isDark: boolean;
  onRunCustomCode: (code: string) => void;
  validationOutcome: ValidationOutcome;
  validationError?: string;
}

export default function PracticeTrainerPanel({
  algorithm,
  codeLang,
  onCodeLangChange,
  uiLang,
  isDark,
  onRunCustomCode,
  validationOutcome,
  validationError,
}: PracticeTrainerPanelProps) {
  const t = I18N[uiLang];
  const langInfo = MULTI_LANG_CODE[algorithm][codeLang];

  const [difficulty, setDifficulty] = useState<PracticeDifficulty>('blanks');
  const [blankValues, setBlankValues] = useState<Record<string, string>>({});
  const [editorCode, setEditorCode] = useState<string>(langInfo.starterRewrite);
  const [antiCheatNotice, setAntiCheatNotice] = useState<string | null>(null);
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [peeksUsed, setPeeksUsed] = useState<number>(0);
  const [localBlankMissing, setLocalBlankMissing] = useState<boolean>(false);

  // Reset editor state when algorithm, language, or difficulty changes
  useEffect(() => {
    const info = MULTI_LANG_CODE[algorithm][codeLang];
    setBlankValues({});
    setLocalBlankMissing(false);
    setIsPeeking(false);
    if (difficulty === 'rewrite') {
      setEditorCode(info.starterRewrite);
    } else if (difficulty === 'blind') {
      setEditorCode(info.starterBlind);
    }
  }, [algorithm, codeLang, difficulty]);

  const triggerNotice = (msg: string) => {
    setAntiCheatNotice(msg);
    setTimeout(() => {
      setAntiCheatNotice((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleBlockCopy = (e: React.SyntheticEvent) => {
    e.preventDefault();
    triggerNotice(t.practice.copyBlockedWarning);
  };

  const handleBlockPaste = (e: React.SyntheticEvent) => {
    e.preventDefault();
    triggerNotice(t.practice.pasteBlockedWarning);
  };

  const handlePeek = () => {
    if (isPeeking) return;
    setIsPeeking(true);
    setPeeksUsed((p) => p + 1);
    setTimeout(() => {
      setIsPeeking(false);
    }, 3000);
  };

  const handleResetEditor = () => {
    setBlankValues({});
    setLocalBlankMissing(false);
    if (difficulty === 'rewrite') {
      setEditorCode(langInfo.starterRewrite);
    } else if (difficulty === 'blind') {
      setEditorCode(langInfo.starterBlind);
    }
  };

  const handleRunClick = () => {
    setLocalBlankMissing(false);
    if (difficulty === 'blanks') {
      // Verify all blanks are filled
      const allSlots: BlankSlot[] = [];
      langInfo.blanks.forEach((line) => {
        line.segments.forEach((seg) => {
          if (typeof seg !== 'string') allSlots.push(seg);
        });
      });
      const anyEmpty = allSlots.some((slot) => !(blankValues[slot.id] || '').trim());
      if (anyEmpty) {
        setLocalBlankMissing(true);
        return;
      }
      const assembled = langInfo.assembleFromBlanks(blankValues);
      onRunCustomCode(assembled);
    } else {
      onRunCustomCode(editorCode);
    }
  };

  const handleKeyDownTextarea = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextVal = editorCode.substring(0, start) + '    ' + editorCode.substring(end);
      setEditorCode(nextVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const editorLinesCount = Math.max(12, editorCode.split('\n').length);

  // Calculate line-by-line match stats in Rewrite mode
  const refNormalizedLines = langInfo.lines.map((l) => l.text.trim()).filter(Boolean);
  const userNormalizedLines = editorCode
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('#'));
  const matchingLinesCount = userNormalizedLines.filter((ul) =>
    refNormalizedLines.includes(ul)
  ).length;

  return (
    <div
      className={`w-full rounded-xl border p-3.5 sm:p-4 flex flex-col gap-3.5 transition-colors ${
        isDark
          ? 'bg-[#081224]/90 border-cyan-900/70 shadow-2xl'
          : 'bg-white border-slate-200 shadow-md'
      }`}
    >
      {/* 1. Difficulty Tabs & Programming Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-950/60 dark:border-cyan-950/60">
        {/* Difficulty Selector */}
        <div
          className={`flex items-center gap-1 p-1 rounded-lg border ${
            isDark ? 'bg-[#050B16] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(['blanks', 'rewrite', 'blind'] as PracticeDifficulty[]).map((diff) => {
            const active = difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                  active
                    ? isDark
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-sky-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.difficulties[diff].label}
              </button>
            );
          })}
        </div>

        {/* Programming Language Tabs (C / Python / JS) */}
        <div
          className={`flex items-center gap-1 p-1 rounded-lg border ${
            isDark ? 'bg-[#050B16] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {(
            [
              { id: 'c', label: 'C99' },
              { id: 'python', label: 'Python' },
              { id: 'javascript', label: 'JS' },
            ] as { id: CodeLanguage; label: string }[]
          ).map((l) => {
            const active = codeLang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onCodeLangChange(l.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                  active
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                      : 'bg-amber-500 text-slate-950'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtitle instruction */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          {difficulty === 'blanks'
            ? t.practice.blanksInstruction
            : difficulty === 'rewrite'
            ? t.practice.rewriteInstruction
            : t.practice.blindInstruction}
        </p>
        {difficulty === 'rewrite' && (
          <span
            className={`text-[11px] font-mono shrink-0 px-2 py-0.5 rounded border ${
              isDark
                ? 'bg-cyan-950/50 border-cyan-800/60 text-cyan-300'
                : 'bg-sky-50 border-sky-200 text-sky-700'
            }`}
          >
            {matchingLinesCount} / {refNormalizedLines.length} lines
          </span>
        )}
      </div>

      {/* Anti-Copy / Anti-Paste Warning Toast */}
      <AnimatePresence>
        {antiCheatNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono ${
              isDark
                ? 'bg-amber-950/80 border-amber-500/70 text-amber-200'
                : 'bg-amber-50 border-amber-400 text-amber-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{antiCheatNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Reference Sheet (Copy-Protected) — Shown in 'rewrite' and 'blind' modes */}
      {difficulty !== 'blanks' && (
        <div
          onCopy={handleBlockCopy}
          onCut={handleBlockCopy}
          onContextMenu={handleBlockCopy}
          onDragStart={handleBlockCopy}
          className={`rounded-lg border overflow-hidden select-none relative ${
            isDark ? 'bg-[#060D1A] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          {/* Reference Header */}
          <div
            className={`flex items-center justify-between px-3 py-1.5 border-b text-[11px] font-mono ${
              isDark ? 'bg-[#040912] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{t.practice.referenceTitle}:</span>
              <span className={isDark ? 'text-cyan-400' : 'text-sky-600'}>{langInfo.filename}</span>
            </div>

            <div className="flex items-center gap-2">
              {difficulty === 'blind' && (
                <button
                  type="button"
                  onClick={handlePeek}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 border transition-colors ${
                    isPeeking
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : isDark
                      ? 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/70'
                      : 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100'
                  }`}
                >
                  {isPeeking ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{isPeeking ? '3s...' : t.actions.peekHint}</span>
                </button>
              )}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {t.practice.noCopyBadge}
              </span>
            </div>
          </div>

          {/* Reference Code Content */}
          <div className="relative py-2 px-3 font-mono text-[11px] leading-[1.55] overflow-x-auto max-h-[165px]">
            <div
              className={`transition-all duration-300 ${
                difficulty === 'blind' && !isPeeking ? 'blur-md opacity-25 pointer-events-none' : ''
              }`}
            >
              {langInfo.lines.map((line) => (
                <div key={line.num} className="flex items-center">
                  <span className="w-5 text-right pr-2.5 text-slate-500 text-[10px] select-none">
                    {line.num}
                  </span>
                  <span className="whitespace-pre text-slate-300 dark:text-slate-300">
                    {line.text}
                  </span>
                </div>
              ))}
            </div>

            {difficulty === 'blind' && !isPeeking && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                <EyeOff className="w-5 h-5 text-cyan-400/80" />
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {t.actions.hideHint} ({t.practice.peekRemaining}: {peeksUsed})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Interactive Code Workspace (Blanks Mode OR Full Textarea Editor) */}
      <div
        className={`rounded-lg border overflow-hidden ${
          isDark ? 'bg-[#050B14] border-cyan-900/60' : 'bg-slate-900 border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#040810] border-b border-slate-800 text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.practice.editorTitle}</span>
            <span className="text-slate-500">({langInfo.filename})</span>
          </div>
          <button
            type="button"
            onClick={handleResetEditor}
            className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.actions.resetCode}</span>
          </button>
        </div>

        {difficulty === 'blanks' ? (
          /* Mode 1: Interactive Fill-in-the-Blanks Editor */
          <div
            onCopy={handleBlockCopy}
            className="p-3 font-mono text-xs leading-[1.9] overflow-x-auto text-slate-200 select-none"
          >
            {langInfo.blanks.map((line) => (
              <div key={line.num} className="flex items-center whitespace-pre">
                <span className="w-6 text-right pr-3 text-slate-600 text-[10px] select-none">
                  {line.num}
                </span>
                <div className="flex items-center flex-wrap">
                  {line.segments.map((seg, idx) => {
                    if (typeof seg === 'string') {
                      return <span key={idx}>{seg}</span>;
                    }
                    const val = blankValues[seg.id] || '';
                    const isExactMatch =
                      val.replace(/\s+/g, '') === seg.answer.replace(/\s+/g, '');
                    return (
                      <input
                        key={seg.id}
                        type="text"
                        value={val}
                        onPaste={handleBlockPaste}
                        onChange={(e) => {
                          setLocalBlankMissing(false);
                          setBlankValues((prev) => ({
                            ...prev,
                            [seg.id]: e.target.value,
                          }));
                        }}
                        placeholder={seg.placeholder}
                        style={{
                          width: `${Math.max(seg.answer.length + 3, 6)}ch`,
                        }}
                        className={`mx-1 px-1.5 py-0.5 rounded font-mono text-xs font-bold border outline-none transition-all text-center ${
                          isExactMatch
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                            : val.trim()
                            ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                            : 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 focus:border-cyan-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mode 2 & 3: Full Code Editor with Anti-Paste */
          <div className="relative flex font-mono text-xs leading-[1.65] max-h-[230px] overflow-y-auto">
            {/* Line Numbers Gutter */}
            <div className="py-2.5 px-2 bg-[#03070E] text-slate-600 text-right select-none border-r border-slate-800/80">
              {Array.from({ length: editorLinesCount }).map((_, idx) => (
                <div key={idx} className="text-[10px] leading-[1.65]">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              onKeyDown={handleKeyDownTextarea}
              onPaste={handleBlockPaste}
              onDrop={handleBlockPaste}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              rows={Math.min(14, editorLinesCount)}
              className="w-full p-2.5 bg-transparent text-cyan-100 font-mono text-xs leading-[1.65] outline-none resize-none whitespace-pre overflow-x-auto"
            />
          </div>
        )}
      </div>

      {/* 4. Run on Crane Button & Validation Feedback */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleRunClick}
          className={`w-full py-2.5 px-4 rounded-lg font-mono font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all border cursor-pointer ${
            isDark
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.25)]'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{t.actions.runCode}</span>
          <Sparkles className="w-4 h-4 ml-1" />
        </button>

        {/* Validation Status Message */}
        {localBlankMissing && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-amber-950/60 border-amber-500/60 text-amber-200 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.practice.statusBlankEmpty}</span>
          </div>
        )}

        {!localBlankMissing && validationOutcome !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs font-mono ${
              validationOutcome === 'success'
                ? isDark
                  ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : validationOutcome === 'reverse' || validationOutcome === 'unsorted'
                ? isDark
                  ? 'bg-amber-950/70 border-amber-500/70 text-amber-200'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
                : isDark
                ? 'bg-rose-950/70 border-rose-500/70 text-rose-200'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {validationOutcome === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : validationOutcome === 'reverse' || validationOutcome === 'unsorted' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              {validationOutcome === 'success' && <p>{t.practice.statusSuccess}</p>}
              {validationOutcome === 'reverse' && <p>{t.practice.statusReverse}</p>}
              {validationOutcome === 'unsorted' && <p>{t.practice.statusUnsorted}</p>}
              {validationOutcome === 'cheat' && <p>{t.practice.statusCheat}</p>}
              {validationOutcome === 'syntax_error' && (
                <p>
                  {t.practice.statusSyntaxError} <span className="font-bold">{validationError}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
