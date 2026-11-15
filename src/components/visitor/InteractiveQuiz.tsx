import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { QuizQuestion, Experience, WebsiteContent } from '../../types';
import { localizeCurrency, localizeDestinationName } from '../../utils/localization';
import { getSiteText } from '../../utils/siteTexts';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Share2, Check } from 'lucide-react';

interface InteractiveQuizProps {
  quizQuestions: QuizQuestion[];
  experiences: Experience[];
  content?: WebsiteContent;
  currency?: string;
  onSelectExperience: (exp: Experience) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quizQuestions,
  experiences,
  content,
  currency = 'SAR',
  onSelectExperience,
}) => {
  const { language, t, isRtl } = useLanguage();
  const {
    getVisitorGlassyStyle,
    currentAccentHex,
    currentAccentTextHex,
    currentAccentBtnTextHex,
  } = useTheme();
  const isArabic = language === 'ar';

  const quizGlassyStyle = getVisitorGlassyStyle('quizGlassy');

  const [activeTab, setActiveTab] = useState<'match' | 'knowledge'>('match');

  // Interactive Matcher State
  const [matchStep, setMatchStep] = useState(0);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [recommendedExperience, setRecommendedExperience] = useState<Experience | null>(null);

  // Knowledge Game State
  const [gameStep, setGameStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Filter active questions
  const activeQuestions = quizQuestions.filter((q) => q.active);
  const safeGameStep = activeQuestions.length > 0 ? Math.min(gameStep, activeQuestions.length - 1) : 0;

  // Matcher Questions
  const matcherSteps = [
    {
      id: 'atmosphere',
      question: getSiteText(content, 'quiz.matcherQ1', 'en'),
      questionAr: getSiteText(content, 'quiz.matcherQ1', 'ar'),
      options: [
        { label: 'Dramatic sandstone canyons & star-filled desert', labelAr: 'مضائق صخرية شاهقة وسماء صحراوية مرصعة بالنجوم', category: 'Desert Adventure' },
        { label: 'Ancient mudbrick palaces & timeless heritage', labelAr: 'قصور طينية عريقة وحضارات تاريخية أصيلة', category: 'Cultural Experiences' },
        { label: 'Turquoise coastal coral reefs & ocean islands', labelAr: 'شعاب مرجانية فيروزية وجزر بحرية بكر', category: 'Nature & Outdoor' },
        { label: 'Historic merchant souks & vibrant coastal city walks', labelAr: 'أسواق قديمة وحياة حضرية دافئة على البحر', category: 'City Tours' },
      ],
    },
    {
      id: 'travelers',
      question: getSiteText(content, 'quiz.matcherQ2', 'en'),
      questionAr: getSiteText(content, 'quiz.matcherQ2', 'ar'),
      options: [
        { label: 'Solo exploration & authentic cultural immersion', labelAr: 'استكشاف فردي وانغماس ثقافي هادئ', category: 'Cultural Experiences' },
        { label: 'Romantic escape / celebrating an anniversary', labelAr: 'رحلة رومانسية / احتفال بذكرى خاصة', category: 'Luxury Experiences' },
        { label: 'Family with children & loved ones', labelAr: 'عائلة بصحبة أطفال وأحباء', category: 'Family Activities' },
        { label: 'Group of friends seeking thrills and exploration', labelAr: 'مجموعة أصدقاء تبحث عن الإثارة والمغامرة', category: 'Desert Adventure' },
      ],
    },
    {
      id: 'pace',
      question: getSiteText(content, 'quiz.matcherQ3', 'en'),
      questionAr: getSiteText(content, 'quiz.matcherQ3', 'ar'),
      options: [
        { label: 'Thrilling action with off-road drives & open dunes', labelAr: 'إثارة وتشويق مع دفع رباعي وكثبان مفتوحة', category: 'Desert Adventure' },
        { label: 'In-depth storytelling with certified local historians', labelAr: 'سرد تاريخي عميق مع رواة ومرشدين محليين', category: 'Cultural Experiences' },
        { label: 'Regenerative relaxation, culinary feasts, and tea in the Majlis', labelAr: 'استرخاء ووليمة طهي تقليدية في المجلس', category: 'Cultural Experiences' },
        { label: 'Marine sailing, snorkeling, and pristine ocean breeze', labelAr: 'إبحار وغوص سطحي مع نسيم البحر المنعش', category: 'Nature & Outdoor' },
      ],
    },
  ];

  const handleMatchSelect = (category: string) => {
    const nextAnswers = { ...matchAnswers, [matcherSteps[matchStep].id]: category };
    setMatchAnswers(nextAnswers);

    if (matchStep < matcherSteps.length - 1) {
      setMatchStep(matchStep + 1);
    } else {
      setMatchCompleted(true);
      const published = experiences.filter((e) => e.status === 'PUBLISHED');
      const match =
        published.find((e) => e.category === category) ||
        published.find((e) => e.featured) ||
        published[0];
      setRecommendedExperience(match || null);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const resetMatcher = () => {
    setMatchStep(0);
    setMatchAnswers({});
    setMatchCompleted(false);
    setRecommendedExperience(null);
  };

  // Knowledge Game logic
  const currentQuestion = activeQuestions[safeGameStep];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (gameStep < activeQuestions.length - 1) {
      setGameStep(gameStep + 1);
    } else {
      setGameCompleted(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const resetGame = () => {
    setGameStep(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setGameCompleted(false);
  };

  const handleShareResult = () => {
    const text = isArabic
      ? `حصلت على ${score}/${activeQuestions.length} في تحدي المعرفة السياحية السعودية على منصة تورفلو! استكشف المملكة: https://tourflow.sa`
      : `I just scored ${score}/${activeQuestions.length} on the TourFlow Saudi Tourism Knowledge Discovery Game! Explore Saudi Arabia: https://tourflow.sa`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <section
      id="quiz"
      className="py-20 bg-transparent border-t border-[var(--tf-border)] transition-colors duration-300"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: currentAccentTextHex }}
          >
            <Sparkles className="w-4 h-4" style={{ color: currentAccentTextHex }} />
            <span>{getSiteText(content, 'quiz.badge', language)}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--tf-heading)] tracking-tight">
            {getSiteText(content, 'quiz.title', language)}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--tf-muted)] max-w-xl mx-auto">
            {getSiteText(content, 'quiz.sub', language)}
          </p>

          {/* Mode Switcher Tabs (Zero-pill segmented buttons) */}
          <div
            style={quizGlassyStyle}
            className="inline-flex p-1 rounded-xl mt-6 transition-all"
          >
            <button
              onClick={() => setActiveTab('match')}
              style={
                activeTab === 'match'
                  ? { backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }
                  : undefined
              }
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'match'
                  ? 'shadow-sm'
                  : 'text-[var(--tf-muted)] hover:text-[var(--tf-heading)]'
              }`}
            >
              {getSiteText(content, 'quiz.tabMatcher', language)}
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              style={
                activeTab === 'knowledge'
                  ? { backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }
                  : undefined
              }
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'shadow-sm'
                  : 'text-[var(--tf-muted)] hover:text-[var(--tf-heading)]'
              }`}
            >
              {getSiteText(content, 'quiz.tabKnowledge', language)}
            </button>
          </div>
        </div>

        {/* CONTAINER 1: EXPERIENCE MATCHER */}
        {activeTab === 'match' && (
          <div
            style={quizGlassyStyle}
            className="rounded-2xl p-6 sm:p-8 transition-all duration-300"
          >
            {!matchCompleted ? (
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between text-xs text-[var(--tf-muted)] mb-6">
                  <span className="font-semibold text-[var(--tf-heading)] tabular-nums">
                    {isArabic
                      ? `الخطوة ${matchStep + 1} من ${matcherSteps.length}`
                      : `Step ${matchStep + 1} of ${matcherSteps.length}`}
                  </span>
                  <div className="flex gap-1.5">
                    {matcherSteps.map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: i === matchStep ? '24px' : '8px',
                          backgroundColor:
                            i === matchStep ? currentAccentHex : 'var(--tf-border)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)] mb-6">
                  {isArabic ? matcherSteps[matchStep].questionAr : matcherSteps[matchStep].question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {matcherSteps[matchStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMatchSelect(opt.category)}
                      className="p-4 text-start bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl hover:bg-[var(--tf-surface-hover)] transition-all text-sm font-medium text-[var(--tf-heading)] flex items-center justify-between group cursor-pointer"
                    >
                      <span>{isArabic ? opt.labelAr : opt.label}</span>
                      <ArrowRight
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180 shrink-0 ml-2 rtl:ml-0 rtl:mr-2"
                        style={{ color: currentAccentTextHex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--tf-heading)] mb-2">
                  {getSiteText(content, 'quiz.congrats', language)}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--tf-muted)] max-w-md mx-auto mb-6">
                  {getSiteText(content, 'quiz.matchSub', language)}
                </p>

                {recommendedExperience ? (
                  <div className="max-w-lg mx-auto bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-2xl overflow-hidden shadow-sm text-start mb-6">
                    <img
                      src={recommendedExperience.coverImage}
                      alt={isArabic ? recommendedExperience.titleAr : recommendedExperience.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-[var(--tf-muted)] mb-1">
                        <span>
                          {localizeDestinationName(
                            recommendedExperience.destinationName,
                            language,
                            undefined,
                            recommendedExperience.destinationId
                          )}
                        </span>
                        <span
                          className="font-mono font-bold text-sm tabular-nums"
                          style={{ color: currentAccentTextHex }}
                        >
                          {recommendedExperience.price} {localizeCurrency(currency, language)}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[var(--tf-heading)] mb-2">
                        {isArabic ? recommendedExperience.titleAr : recommendedExperience.title}
                      </h4>
                      <p className="text-xs text-[var(--tf-muted)] line-clamp-2 mb-4">
                        {isArabic ? recommendedExperience.descriptionAr : recommendedExperience.description}
                      </p>
                      <button
                        onClick={() => onSelectExperience(recommendedExperience)}
                        style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 transition-all"
                      >
                        <span>{getSiteText(content, 'experiences.viewDetails', language)}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={resetMatcher}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--tf-muted)] hover:text-[var(--tf-heading)] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{getSiteText(content, 'quiz.retake', language)}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTAINER 2: CULTURAL KNOWLEDGE MINI-GAME */}
        {activeTab === 'knowledge' && (
          <div
            style={quizGlassyStyle}
            className="rounded-2xl p-6 sm:p-8 transition-all duration-300"
          >
            {!gameCompleted && currentQuestion ? (
              <div>
                {/* Game Progress */}
                <div className="flex items-center justify-between text-xs text-[var(--tf-muted)] mb-6">
                  <span className="font-semibold text-[var(--tf-heading)] tabular-nums">
                    {t('quiz.question')} {gameStep + 1} / {activeQuestions.length}
                  </span>
                  <div
                    className="flex items-center gap-1 font-bold tabular-nums"
                    style={{ color: currentAccentTextHex }}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>
                      {t('quiz.score')}: {score}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)] mb-6">
                  {isArabic ? currentQuestion.questionAr : currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {(isArabic ? currentQuestion.optionsAr : currentQuestion.options).map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;

                    let optionClasses =
                      'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)]';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionClasses =
                          'border-[var(--tf-success-border)] bg-[var(--tf-success-bg)] text-[var(--tf-success-text)] font-semibold';
                      } else if (isSelected && !isCorrect) {
                        optionClasses =
                          'border-[var(--tf-danger-border)] bg-[var(--tf-danger-bg)] text-[var(--tf-danger-text)] font-medium';
                      } else {
                        optionClasses = 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] opacity-60';
                      }
                    } else if (isSelected) {
                      optionClasses = 'bg-[var(--tf-surface-hover)] text-[var(--tf-heading)] font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        style={
                          !isAnswerSubmitted && isSelected
                            ? { borderColor: currentAccentHex }
                            : undefined
                        }
                        className={`w-full p-4 text-start border rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer ${optionClasses}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--tf-success-text)] shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-[var(--tf-danger-text)] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswerSubmitted && (
                  <div className="p-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs sm:text-sm text-[var(--tf-text)] mb-6">
                    <span className="font-bold text-[var(--tf-heading)]">
                      {isArabic ? 'حقيقة تاريخية: ' : 'Historical Fact: '}
                    </span>
                    <span>{isArabic ? currentQuestion.explanationAr : currentQuestion.explanation}</span>
                  </div>
                )}

                {/* Control Action */}
                <div className="flex justify-end">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
                      className="py-2.5 px-6 disabled:opacity-45 rounded-xl text-xs font-bold cursor-pointer hover:brightness-105 transition-all"
                    >
                      {getSiteText(content, 'quiz.confirmAnswer', language)}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
                      className="py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:brightness-105 transition-all"
                    >
                      <span>
                        {gameStep < activeQuestions.length - 1
                          ? getSiteText(content, 'quiz.nextQuestion', language)
                          : getSiteText(content, 'quiz.viewResults', language)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                >
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--tf-heading)] mb-1">
                  {getSiteText(content, 'quiz.completeTitle', language)}
                </h3>
                <p className="text-sm text-[var(--tf-muted)] mb-4">
                  {isArabic ? (
                    <>
                      حصلت على{' '}
                      <span className="font-bold text-[var(--tf-heading)] text-base tabular-nums">
                        {score}
                      </span>{' '}
                      من أصل{' '}
                      <span className="font-bold text-[var(--tf-heading)] text-base tabular-nums">
                        {activeQuestions.length}
                      </span>{' '}
                      إجابات صحيحة
                    </>
                  ) : (
                    <>
                      You scored{' '}
                      <span className="font-bold text-[var(--tf-heading)] text-base tabular-nums">
                        {score}
                      </span>{' '}
                      out of{' '}
                      <span className="font-bold text-[var(--tf-heading)] text-base tabular-nums">
                        {activeQuestions.length}
                      </span>{' '}
                      correct
                    </>
                  )}
                </p>

                <div className="max-w-md mx-auto p-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs text-[var(--tf-text)] mb-6">
                  {score >= 4 ? (
                    <p className="font-medium">
                      {isArabic
                        ? 'رائع! لديك معرفة عميقة وتقدير أصيل للتراث النبطي والنجدي والحجازي في المملكة.'
                        : 'Outstanding! You possess deep appreciation for Saudi Arabia’s Nabataean, Najdi, and Hejazi heritage.'}
                    </p>
                  ) : (
                    <p>
                      {isArabic
                        ? 'استكشاف موفق! تزخر المملكة العربية السعودية بآلاف السنين من التاريخ الحي الذي ينتظر زيارتك.'
                        : 'Great exploration! Saudi Arabia holds thousands of years of living history waiting to be discovered firsthand.'}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleShareResult}
                    style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex, textShadow: 'none' }}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer hover:brightness-105 transition-all"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>
                      {copiedShare
                        ? isArabic
                          ? 'تم النسخ للحافظة!'
                          : 'Copied to Clipboard!'
                        : getSiteText(content, 'quiz.share', language)}
                    </span>
                  </button>
                  <button
                    onClick={resetGame}
                    className="py-2.5 px-4 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{getSiteText(content, 'quiz.retake', language)}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
