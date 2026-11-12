import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { QuizQuestion, Experience } from '../../types';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Share2, Compass, Check } from 'lucide-react';

interface InteractiveQuizProps {
  quizQuestions: QuizQuestion[];
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quizQuestions,
  experiences,
  onSelectExperience,
}) => {
  const { language, t, isRtl } = useLanguage();
  const isArabic = language === 'ar';

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

  // Matcher Questions
  const matcherSteps = [
    {
      id: 'atmosphere',
      question: 'What landscape or setting calls to you most?',
      questionAr: 'ما هي الطبيعة أو البيئة التي تجذبك أكثر؟',
      options: [
        { label: 'Dramatic sandstone canyons & star-filled desert', labelAr: 'مضائق صخرية شاهقة وسماء صحراوية مرصعة بالنجوم', category: 'Desert Adventure' },
        { label: 'Ancient mudbrick palaces & timeless heritage', labelAr: 'قصور طينية عريقة وحضارات تاريخية أصيلة', category: 'Cultural Experiences' },
        { label: 'Turquoise coastal coral reefs & ocean islands', labelAr: 'شعاب مرجانية فيروزية وجزر بحرية بكر', category: 'Nature & Outdoor' },
        { label: 'Historic merchant souks & vibrant coastal city walks', labelAr: 'أسواق قديمة وحياة حضرية دافئة على البحر', category: 'City Tours' },
      ],
    },
    {
      id: 'travelers',
      question: 'Who will be sharing this journey with you?',
      questionAr: 'مع من تخطط لمشاركة هذه التجربة؟',
      options: [
        { label: 'Solo exploration & authentic cultural immersion', labelAr: 'استكشاف فردي وانغماس ثقافي هادئ', category: 'Cultural Experiences' },
        { label: 'Romantic escape / celebrating an anniversary', labelAr: 'رحلة رومانسية / احتفال بذكرى خاصة', category: 'Luxury Experiences' },
        { label: 'Family with children & loved ones', labelAr: 'عائلة بصحبة أطفال وأحباء', category: 'Family Activities' },
        { label: 'Group of friends seeking thrills and exploration', labelAr: 'مجموعة أصدقاء تبحث عن الإثارة والمغامرة', category: 'Desert Adventure' },
      ],
    },
    {
      id: 'pace',
      question: 'What is your preferred rhythm for the day?',
      questionAr: 'ما هو النمط المفضل لبرنامج يومك؟',
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
      // Complete matching
      setMatchCompleted(true);
      // Find matching published experience
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
  const currentQuestion = activeQuestions[gameStep];

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
    const text = `I just scored ${score}/${activeQuestions.length} on the TourFlow Saudi Tourism Knowledge Discovery Game! Explore Saudi Arabia: https://tourflow.sa`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <section id="quiz" className="py-20 bg-[#FAF8F5] border-t border-[#D9C29A]/30" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#C6A46B] mb-2">
            <Sparkles className="w-4 h-4 text-[#123B32]" />
            <span>{t('quiz.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B32] tracking-tight">
            {t('quiz.title')}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#777D75] max-w-xl mx-auto">
            {t('quiz.sub')}
          </p>

          {/* Mode Switcher Tabs (Zero-pill segmented buttons) */}
          <div className="inline-flex p-1 bg-[#F6F4EF] border border-[#D9C29A]/50 rounded-xl mt-6">
            <button
              onClick={() => setActiveTab('match')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-[#123B32] text-white shadow-sm'
                  : 'text-[#777D75] hover:text-[#123B32]'
              }`}
            >
              Experience Matcher
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-[#123B32] text-white shadow-sm'
                  : 'text-[#777D75] hover:text-[#123B32]'
              }`}
            >
              Saudi Knowledge Game
            </button>
          </div>
        </div>

        {/* CONTAINER 1: EXPERIENCE MATCHER */}
        {activeTab === 'match' && (
          <div className="bg-white border border-[#D9C29A]/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            {!matchCompleted ? (
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between text-xs text-[#777D75] mb-6">
                  <span className="font-semibold text-[#123B32]">
                    Step {matchStep + 1} of {matcherSteps.length}
                  </span>
                  <div className="flex gap-1.5">
                    {matcherSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === matchStep ? 'w-6 bg-[#123B32]' : 'w-2 bg-[#D9C29A]/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32] mb-6">
                  {isArabic ? matcherSteps[matchStep].questionAr : matcherSteps[matchStep].question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {matcherSteps[matchStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMatchSelect(opt.category)}
                      className="p-4 text-start border border-[#D9C29A]/50 rounded-xl hover:border-[#123B32] hover:bg-[#D9C29A]/10 transition-all text-sm font-medium text-[#202923] flex items-center justify-between group cursor-pointer"
                    >
                      <span>{isArabic ? opt.labelAr : opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-[#C6A46B] opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180 shrink-0 ml-2 rtl:ml-0 rtl:mr-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#123B32] text-[#D9C29A] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#123B32] mb-2">
                  {t('quiz.congrats')}
                </h3>
                <p className="text-xs sm:text-sm text-[#777D75] max-w-md mx-auto mb-6">
                  Based on your preferences, our platform recommends this tailor-made Saudi experience:
                </p>

                {recommendedExperience ? (
                  <div className="max-w-lg mx-auto bg-[#F6F4EF] border border-[#D9C29A]/60 rounded-2xl overflow-hidden shadow-sm text-start mb-6">
                    <img
                      src={recommendedExperience.coverImage}
                      alt={recommendedExperience.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-[#777D75] mb-1">
                        <span>{recommendedExperience.destinationName}</span>
                        <span className="font-mono font-bold text-[#123B32] text-sm">
                          {recommendedExperience.price} SAR
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#123B32] mb-2">
                        {isArabic ? recommendedExperience.titleAr : recommendedExperience.title}
                      </h4>
                      <p className="text-xs text-[#777D75] line-clamp-2 mb-4">
                        {isArabic ? recommendedExperience.descriptionAr : recommendedExperience.description}
                      </p>
                      <button
                        onClick={() => onSelectExperience(recommendedExperience)}
                        className="w-full py-2.5 px-4 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <span>{t('section.experiences.viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={resetMatcher}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777D75] hover:text-[#123B32] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('quiz.retake')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONTAINER 2: CULTURAL KNOWLEDGE MINI-GAME */}
        {activeTab === 'knowledge' && (
          <div className="bg-white border border-[#D9C29A]/60 rounded-2xl p-6 sm:p-8 shadow-sm">
            {!gameCompleted && currentQuestion ? (
              <div>
                {/* Game Progress */}
                <div className="flex items-center justify-between text-xs text-[#777D75] mb-6">
                  <span className="font-semibold text-[#123B32]">
                    {t('quiz.question')} {gameStep + 1} / {activeQuestions.length}
                  </span>
                  <div className="flex items-center gap-1 text-[#C6A46B] font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Score: {score}</span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32] mb-6">
                  {isArabic ? currentQuestion.questionAr : currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {(isArabic ? currentQuestion.optionsAr : currentQuestion.options).map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctIndex;
                    let style = 'border-[#D9C29A]/50 bg-white hover:bg-[#D9C29A]/10';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        style = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        style = 'border-red-500 bg-red-50 text-red-900';
                      } else {
                        style = 'border-neutral-200 opacity-60';
                      }
                    } else if (isSelected) {
                      style = 'border-[#123B32] bg-[#123B32]/10 text-[#123B32] font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-4 text-start border rounded-xl text-sm transition-all flex items-center justify-between cursor-pointer ${style}`}
                      >
                        <span>{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswerSubmitted && (
                  <div className="p-4 bg-[#D9C29A]/15 border border-[#D9C29A]/40 rounded-xl text-xs sm:text-sm text-[#123B32] mb-6">
                    <span className="font-bold">Historical Fact: </span>
                    <span>{isArabic ? currentQuestion.explanationAr : currentQuestion.explanation}</span>
                  </div>
                )}

                {/* Control Action */}
                <div className="flex justify-end">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="py-2.5 px-6 bg-[#123B32] hover:bg-[#1D5546] disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Confirm Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="py-2.5 px-6 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>{gameStep < activeQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#123B32] text-[#C6A46B] flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#123B32] mb-1">
                  Knowledge Quest Complete!
                </h3>
                <p className="text-sm text-[#777D75] mb-4">
                  You scored <span className="font-bold text-[#123B32] text-base">{score}</span> out of{' '}
                  <span className="font-bold text-[#123B32] text-base">{activeQuestions.length}</span> correct
                </p>

                <div className="max-w-md mx-auto p-4 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl text-xs text-[#202923] mb-6">
                  {score >= 4 ? (
                    <p className="text-emerald-800 font-medium">
                      🌟 Outstanding! You possess deep appreciation for Saudi Arabia’s Nabataean, Najdi, and Hejazi heritage.
                    </p>
                  ) : (
                    <p className="text-[#123B32]">
                      Great exploration! Saudi Arabia holds thousands of years of living history waiting to be discovered firsthand.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleShareResult}
                    className="py-2.5 px-4 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'Copied to Clipboard!' : t('quiz.share')}</span>
                  </button>
                  <button
                    onClick={resetGame}
                    className="py-2.5 px-4 bg-white border border-[#D9C29A]/60 text-[#123B32] hover:bg-[#D9C29A]/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('quiz.retake')}</span>
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
