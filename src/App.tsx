import { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Cpu,
  Check,
  X,
  Copy,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { SCENARIOS } from './data/scenarios';
import type { ScenarioQuestion } from './data/scenarios';
import { askLiveOpenRouter } from './services/openrouter';
import type { LiveDecisionResult } from './services/openrouter';

export default function App() {
  const [selectedModel, setSelectedModel] = useState<'jev' | 'gpt-6-luna-decisions'>('jev');
  const [selectedCategory, setSelectedCategory] = useState<'positive' | 'negative'>('positive');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userSelection, setUserSelection] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [modelDecision, setModelDecision] = useState<LiveDecisionResult | null>(null);
  const [chosenOptionId, setChosenOptionId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filter questions by active model AND benchmark category
  const filteredQuestions = useMemo(() => {
    return SCENARIOS.filter(
      (s) => s.model === selectedModel && s.category === selectedCategory
    );
  }, [selectedModel, selectedCategory]);

  const currentQ: ScenarioQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleQuestionChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < filteredQuestions.length) {
      setCurrentIndex(newIndex);
      setUserSelection(null);
      setModelDecision(null);
      setChosenOptionId(null);
      setApiError(null);
    }
  };

  const handleModelChange = (model: 'jev' | 'gpt-6-luna-decisions') => {
    setSelectedModel(model);
    setCurrentIndex(0);
    setUserSelection(null);
    setModelDecision(null);
    setChosenOptionId(null);
    setApiError(null);
  };

  const handleCategoryChange = (category: 'positive' | 'negative') => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setUserSelection(null);
    setModelDecision(null);
    setChosenOptionId(null);
    setApiError(null);
  };

  const handleGetAnswer = async () => {
    if (!currentQ || isThinking) return;

    setIsThinking(true);
    setApiError(null);
    setModelDecision(null);
    setChosenOptionId(null);

    try {
      const res = await askLiveOpenRouter(currentQ, selectedModel);
      setModelDecision(res);
      setChosenOptionId(res.decision);
      setUserSelection(res.decision);

      if (res.confidence > 0.8 && selectedCategory === 'positive') {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#D95D39', '#BA4624', '#F6F1E8', '#1C1917']
        });
      }
    } catch (err: unknown) {
      console.error('Live LLM Error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to call LLM';
      setApiError(msg);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopyJson = () => {
    if (!modelDecision) return;
    navigator.clipboard.writeText(JSON.stringify(modelDecision.typesafeOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentQ) {
    return (
      <div className="h-screen flex items-center justify-center font-sans">
        <p>No questions found.</p>
      </div>
    );
  }

  const modelDisplayName = selectedModel === 'jev' ? 'Jev' : 'Luna';
  const totalQuestions = filteredQuestions.length;
  const optionsCount = currentQ.options.length;

  // Adaptive grid for desktop so options neatly fit in single viewport without scrolling
  const getGridClasses = () => {
    if (optionsCount <= 3) return 'grid-cols-1 sm:grid-cols-3 grid-rows-1';
    if (optionsCount === 4) return 'grid-cols-2 grid-rows-2';
    if (optionsCount <= 6) return 'grid-cols-2 md:grid-cols-3 grid-rows-2';
    return 'grid-cols-2 md:grid-cols-4';
  };

  return (
    <div className="min-h-screen md:h-screen w-screen bg-[#F6F1E8] text-[#1C1917] flex flex-col justify-between p-2.5 md:p-3.5 lg:p-4 overflow-y-auto md:overflow-hidden ">
      
      {/* 1. COMPACT HEADER */}
      <header className="w-full flex items-center justify-between pb-2 border-b border-[#D95D39]/30 shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg text-[#D95D39]">✦</span>
          <span className="font-serif font-bold text-sm sm:text-base text-[#1C1917] tracking-tight">
            Jev &amp; Luna Decisions
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-[#E8E1D3] text-stone-700 border border-[#D95D39]/30 rounded-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live OpenRouter
          </span>
        </div>

        {/* Model & Benchmark Category Controls */}
        <div className="flex items-center gap-1.5 text-xs font-sans">
          {/* Model Switcher */}
          <div className="flex p-0.5 bg-[#EEE7D9] border border-[#D95D39]/30 rounded-xs">
            <button
              onClick={() => handleModelChange('jev')}
              className={`px-2.5 py-0.5 text-xs rounded-xs transition-all cursor-pointer ${
                selectedModel === 'jev'
                  ? 'bg-[#D95D39] text-white font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Jev (Typesafe)
            </button>
            <button
              onClick={() => handleModelChange('gpt-6-luna-decisions')}
              className={`px-2.5 py-0.5 text-xs rounded-xs transition-all cursor-pointer ${
                selectedModel === 'gpt-6-luna-decisions'
                  ? 'bg-[#D95D39] text-white font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Luna (Vision)
            </button>
          </div>

          {/* Benchmark Category Switcher */}
          <div className="flex p-0.5 bg-[#EEE7D9] border border-[#D95D39]/30 rounded-xs">
            <button
              onClick={() => handleCategoryChange('positive')}
              className={`px-2 py-0.5 text-xs rounded-xs transition-all cursor-pointer ${
                selectedCategory === 'positive'
                  ? 'bg-[#1C1917] text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => handleCategoryChange('negative')}
              className={`px-2 py-0.5 text-xs rounded-xs transition-all cursor-pointer ${
                selectedCategory === 'negative'
                  ? 'bg-[#BA4624] text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Negative
            </button>
          </div>
        </div>
      </header>

      {/* 2. FULLSCREEN MAIN WIZARD (NO SCROLL ON DESKTOP) */}
      <main className="w-full flex-1 min-h-0 my-2 flex flex-col">
        <div className="w-full h-full bg-[#FCF9F3] border-2 border-[#D95D39] shadow-sm flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT PANEL: QUESTION & CONTROLS */}
          <div className="w-full md:w-[36%] lg:w-[34%] p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#D95D39] bg-[#FCF9F3] shrink-0 overflow-y-auto md:overflow-visible">
            <div className="space-y-2.5">
              {/* Step indicator */}
              <div className="flex items-center justify-between">
                <span className="inline-block border border-[#D95D39] px-2 py-0.5 font-mono text-xs font-bold text-[#D95D39] bg-[#F6F1E8]">
                  QUESTION {currentIndex + 1} / {totalQuestions}
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  {selectedCategory} benchmark
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif font-bold text-lg sm:text-xl lg:text-[1.4rem] text-[#D95D39] leading-snug">
                {currentQ.question}
              </h2>

              {/* Context Reference (Compact) */}
              {currentQ.reference && (
                <div className="p-2 bg-[#F6F1E8] border-l-2 border-[#D95D39] text-xs text-stone-700 italic font-sans">
                  &ldquo;{typeof currentQ.reference === 'string' ? currentQ.reference : JSON.stringify(currentQ.reference)}&rdquo;
                </div>
              )}

              {/* Hint */}
              <div className="text-xs text-stone-600 font-sans">
                <span className="text-[#D95D39] font-semibold">Hint: </span>
                {currentQ.hint}
              </div>
            </div>

            {/* Decision Status & CTA Action */}
            <div className="pt-3 border-t border-[#D95D39]/30 space-y-2 mt-3">
              {/* API Notification if fallback was used */}
              {apiError && (
                <div className="p-2 bg-amber-50 border border-amber-300 text-amber-800 rounded-xs text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span className="truncate">Benchmark reference used ({apiError})</span>
                </div>
              )}

              {/* Decision Callout */}
              {modelDecision && (
                <div className="p-2 bg-[#FAF1E4] border border-[#D95D39]/40 rounded-xs text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-[#D95D39] flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {modelDisplayName} Decision: {modelDecision.decision}
                    </span>
                    <span className="text-stone-600 font-medium">
                      {(modelDecision.confidence * 100).toFixed(0)}% conf
                      {modelDecision.latencyMs ? ` • ${(modelDecision.latencyMs / 1000).toFixed(1)}s` : ''}
                    </span>
                  </div>
                  <p className="text-stone-700 font-sans text-[11px] line-clamp-2 leading-tight">
                    {modelDecision.reasoning}
                  </p>
                  <button
                    onClick={() => setShowTelemetryModal(true)}
                    className="text-[10px] font-mono text-[#D95D39] underline hover:text-[#BA4624] cursor-pointer inline-flex items-center gap-1"
                  >
                    <Terminal className="w-2.5 h-2.5" />
                    <span>Inspect Raw JSON Payload</span>
                  </button>
                </div>
              )}

              {/* Get Answer CTA Button */}
              <button
                onClick={handleGetAnswer}
                disabled={isThinking}
                className="w-full bg-[#D95D39] hover:bg-[#BA4624] text-white py-2.5 px-3 font-serif font-semibold text-sm shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isThinking ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Querying {modelDisplayName} via OpenRouter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get Answer from {modelDisplayName}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: SIMPLIFIED OPTIONS & NAVIGATION */}
          <div className="flex-1 min-h-0 flex flex-col bg-[#FAF6EE]">
            
            {/* Options Grid (Self-adjusting, zero scroll on desktop) */}
            <div className={`flex-1 min-h-0 p-2.5 md:p-3.5 grid gap-2 md:gap-2.5 items-stretch overflow-y-auto md:overflow-hidden ${getGridClasses()}`}>
              {currentQ.options.map((option, idx) => {
                const isSelected = userSelection === option.id;
                const isModelPick = chosenOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUserSelection(option.id)}
                    className={`group relative h-full flex flex-col justify-between p-2.5 md:p-3 rounded-xs border text-left cursor-pointer transition-all duration-150 ${
                      isModelPick
                        ? 'bg-[#FAF0E6] border-2 border-[#D95D39] shadow-xs ring-2 ring-[#D95D39]/20'
                        : isSelected
                        ? 'bg-[#FAF0E6] border-2 border-[#D95D39] shadow-xs'
                        : 'bg-[#FCF9F3] border-[#E3D8CA] hover:border-[#D95D39] hover:bg-white'
                    }`}
                  >
                    {/* Model Pick Badge */}
                    {isModelPick && (
                      <div className="absolute top-2 right-2 z-10 bg-[#D95D39] text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>{modelDisplayName} Pick</span>
                      </div>
                    )}

                    {/* Card Content: Image Option vs Text Option */}
                    {option.image ? (
                      <div className="w-full h-full flex flex-col justify-between">
                        {/* Image Preview Box */}
                        <div className="flex-1 min-h-0 w-full flex items-center justify-center py-1 overflow-hidden">
                          <img
                            src={option.image}
                            alt={option.label}
                            className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                          />
                        </div>

                        {/* Image Label & Price bar */}
                        <div className="pt-1.5 border-t border-[#E3D8CA]/60 flex items-center justify-between shrink-0 gap-1">
                          <span className="font-serif font-bold text-xs sm:text-sm text-[#1C1917] truncate">
                            {option.label}
                          </span>
                          {option.price && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#EEE7D9] text-[#BA4624] border border-[#D95D39]/20 rounded-xs shrink-0">
                              {option.price}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Clean Text Intent Option */
                      <div className="w-full h-full flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-xs font-mono text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected || isModelPick
                                    ? 'bg-[#D95D39] text-white'
                                    : 'bg-[#EEE7D9] text-stone-700 group-hover:bg-[#D95D39] group-hover:text-white'
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="font-serif font-bold text-sm sm:text-base text-[#1C1917] leading-tight truncate">
                                {option.label}
                              </span>
                            </div>

                            {/* Price Tag if available */}
                            {option.price && (
                              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EEE7D9] text-[#BA4624] border border-[#D95D39]/20 rounded-xs shrink-0 shadow-2xs">
                                {option.price}
                              </span>
                            )}
                          </div>

                          {option.sublabel && (
                            <p className="text-xs text-stone-600 font-sans line-clamp-2 pl-7 leading-snug">
                              {option.sublabel}
                            </p>
                          )}
                        </div>

                        <div className="pl-7 pt-1 flex items-center justify-between">
                          <span className={`text-[10px] font-mono flex items-center gap-0.5 ${
                            isSelected || isModelPick ? 'text-[#D95D39] font-bold' : 'text-stone-400 group-hover:text-stone-600'
                          }`}>
                            <span>Select option</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>

                          {option.badge && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-[#FAF1E4] text-[#BA4624] border border-[#D95D39]/30 rounded-xs">
                              {option.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Navigation Toolbar */}
            <div className="px-3 py-2 bg-[#FCF9F3] border-t border-[#D95D39]/40 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleQuestionChange(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-3 py-1 border border-[#D95D39] text-xs font-serif font-semibold text-[#D95D39] hover:bg-[#D95D39] hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1.5">
                {filteredQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionChange(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      i === currentIndex ? 'bg-[#D95D39] w-5' : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                    title={`Go to question ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => handleQuestionChange(currentIndex + 1)}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-1 px-3 py-1 border border-[#D95D39] text-xs font-serif font-semibold text-[#D95D39] hover:bg-[#D95D39] hover:text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. ULTRA-SLIM FOOTER */}
      <footer className="w-full pt-1.5 flex items-center justify-between text-[11px] text-stone-500 font-sans shrink-0 border-t border-[#D95D39]/20">
        <div className="flex items-center gap-2">
          <span>Jev &amp; Luna Benchmark Playground</span>
          <span className="hidden sm:inline text-stone-300">•</span>
          <span className="hidden sm:inline text-stone-400">Live OpenRouter Evaluation</span>
        </div>
        <div className="flex items-center gap-3">
          {modelDecision && (
            <button
              onClick={() => setShowTelemetryModal(true)}
              className="text-[#D95D39] underline font-mono cursor-pointer hover:text-[#BA4624]"
            >
              [View JSON Telemetry]
            </button>
          )}
          <span className="font-mono text-stone-400">PORT 5173</span>
        </div>
      </footer>

      {/* 4. MODAL TELEMETRY OVERLAY */}
      {showTelemetryModal && modelDecision && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#FCF9F3] border-2 border-[#D95D39] shadow-2xl p-4 sm:p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#D95D39]/40 mb-3">
              <span className="font-bold text-sm text-[#D95D39] flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Benchmark Telemetry &amp; Payload
              </span>
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="text-stone-600 hover:text-stone-900 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-600 block mb-1 font-mono">
                  Model Decision Reasoning:
                </span>
                <p className="text-xs text-stone-800 bg-[#F6F1E8] p-2.5 border border-[#D95D39]/30 leading-relaxed">
                  {modelDecision.reasoning}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-700 font-mono bg-[#EEE7D9] p-2 border border-[#D95D39]/20">
                <span><strong>Target:</strong> {modelDecision.decision}</span>
                <span><strong>Confidence:</strong> {(modelDecision.confidence * 100).toFixed(1)}%</span>
                <span><strong>Suite:</strong> {selectedCategory.toUpperCase()}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 font-mono">
                  <span className="text-[10px] uppercase font-bold text-stone-600">
                    Typesafe JSON Response:
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 text-[11px] text-[#D95D39] hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-[#1C1917] text-[#51CF66] font-mono text-[11px] max-h-44 overflow-y-auto rounded-xs">
                  {JSON.stringify(modelDecision.typesafeOutput, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D95D39]/30 mt-3 text-right">
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="px-3.5 py-1.5 bg-[#D95D39] hover:bg-[#BA4624] text-white font-serif text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
