import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { QuizQuestion } from '../../../types';
import { DataService } from '../../../services/dataService';
import { GlassContainer } from '../../glass/GlassContainer';
import { localizeCategory } from '../../../utils/localization';
import { Edit2, Plus, CheckCircle, X, Trash2 } from 'lucide-react';

interface InteractiveTabProps {
  quizzes: QuizQuestion[];
}

export const InteractiveTab: React.FC<InteractiveTabProps> = ({ quizzes }) => {
  const { language, isRtl } = useLanguage();
  const isArabic = language === 'ar';
  const { currentAccentHex, currentAccentBtnTextHex } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [question, setQuestion] = useState('');
  const [questionAr, setQuestionAr] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [option1Ar, setOption1Ar] = useState('');
  const [option2Ar, setOption2Ar] = useState('');
  const [option3Ar, setOption3Ar] = useState('');
  const [option4Ar, setOption4Ar] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [explanationAr, setExplanationAr] = useState('');
  const [category, setCategory] = useState('Heritage & History');
  const [active, setActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingId(null);
    setQuestion('');
    setQuestionAr('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setOption1Ar('');
    setOption2Ar('');
    setOption3Ar('');
    setOption4Ar('');
    setCorrectIndex(0);
    setExplanation('');
    setExplanationAr('');
    setCategory('Heritage & History');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setQuestion(q.question);
    setQuestionAr(q.questionAr);
    setOption1(q.options[0] || '');
    setOption2(q.options[1] || '');
    setOption3(q.options[2] || '');
    setOption4(q.options[3] || '');
    setOption1Ar(q.optionsAr?.[0] || '');
    setOption2Ar(q.optionsAr?.[1] || '');
    setOption3Ar(q.optionsAr?.[2] || '');
    setOption4Ar(q.optionsAr?.[3] || '');
    setCorrectIndex(q.correctIndex);
    setExplanation(q.explanation);
    setExplanationAr(q.explanationAr);
    setCategory(q.category);
    setActive(q.active);
    setIsModalOpen(true);
  };

  const handleToggleActive = (q: QuizQuestion) => {
    DataService.updateQuizQuestion(q.id, { active: !q.active });
  };

  const handleDelete = (id: string) => {
    DataService.deleteQuizQuestion(id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const rawOptions = [option1.trim(), option2.trim(), option3.trim(), option4.trim()];
    const rawOptionsAr = [option1Ar.trim(), option2Ar.trim(), option3Ar.trim(), option4Ar.trim()];
    const paired = rawOptions
      .map((opt, i) => ({ en: opt, ar: rawOptionsAr[i] || opt }))
      .filter((item) => Boolean(item.en));

    if (paired.length < 2) return;

    const options = paired.map((p) => p.en);
    const optionsAr = paired.map((p) => p.ar);
    const safeCorrectIndex = Math.min(correctIndex, options.length - 1);

    const payload = {
      question: question.trim(),
      questionAr: questionAr.trim() || question.trim(),
      options,
      optionsAr,
      correctIndex: safeCorrectIndex,
      explanation: explanation.trim(),
      explanationAr: explanationAr.trim() || explanation.trim(),
      category: category.trim() || 'Heritage & History',
      active,
    };

    if (editingId) {
      DataService.updateQuizQuestion(editingId, payload);
    } else {
      DataService.createQuizQuestion(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--tf-heading)]">
            {isArabic
              ? 'الاختبار التفاعلي وأسئلة اللعبة المصغّرة'
              : 'Interactive Quiz & Mini-Game Questions'}
          </h2>
          <p className="text-xs text-[var(--tf-muted)]">
            {isArabic
              ? 'إدارة أسئلة الوجهات التفاعلية ومعايير المطابقة المعروضة على بوابة الزوار.'
              : 'Manage gamified destination questions and matcher heuristics shown on the visitor portal.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-opacity hover:opacity-90 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إضافة سؤال اختبار' : 'Add Quiz Question'}</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {quizzes.map((q, idx) => (
          <GlassContainer
            key={q.id}
            delay={idx * 0.04}
            className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[var(--tf-heading)]">
                  {isArabic ? `س${idx + 1}.` : `Q${idx + 1}.`}
                </span>
                <span className="px-2 py-0.5 rounded bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] text-[var(--tf-muted)] text-[11px]">
                  {localizeCategory(q.category, language)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    q.active
                      ? 'bg-[var(--tf-success-bg)] text-[var(--tf-success-text)] border-[var(--tf-success-border)]'
                      : 'bg-[var(--tf-surface-subtle)] text-[var(--tf-muted)] border-[var(--tf-border)]'
                  }`}
                >
                  {q.active ? (isArabic ? 'نشط' : 'ACTIVE') : isArabic ? 'غير نشط' : 'INACTIVE'}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[var(--tf-heading)]">
                {isArabic ? q.questionAr || q.question : q.question}
              </h3>
              <p className="text-xs text-[var(--tf-muted)]" dir={isArabic ? 'ltr' : 'rtl'}>
                {isArabic ? q.question : q.questionAr}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      i === q.correctIndex
                        ? 'border-[var(--tf-success-border)] bg-[var(--tf-success-bg)] text-[var(--tf-success-text)] font-bold'
                        : 'border-[var(--tf-border)] bg-[var(--tf-surface-subtle)] text-[var(--tf-text)]'
                    }`}
                  >
                    <span>{isArabic ? q.optionsAr?.[i] || opt : opt}</span>
                    {i === q.correctIndex && (
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--tf-success-text)] shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="p-3 bg-[var(--tf-surface-subtle)] border border-[var(--tf-border)] rounded-xl text-xs text-[var(--tf-text)] mt-2">
                <span className="font-bold text-[var(--tf-heading)]">
                  {isArabic ? 'معلومة تاريخية: ' : 'Explanation: '}
                </span>
                <span>{isArabic ? q.explanationAr || q.explanation : q.explanation}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleActive(q)}
                className="py-1.5 px-3 bg-[var(--tf-surface-subtle)] hover:bg-[var(--tf-surface-hover)] border border-[var(--tf-border)] rounded-xl text-xs font-semibold text-[var(--tf-heading)] cursor-pointer"
              >
                {q.active
                  ? isArabic
                    ? 'تعطيل'
                    : 'Deactivate'
                  : isArabic
                  ? 'تفعيل'
                  : 'Activate'}
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="p-2 text-[var(--tf-heading)] hover:bg-[var(--tf-surface-hover)] rounded-xl border border-[var(--tf-border)] cursor-pointer"
                  title={isArabic ? 'تعديل السؤال' : 'Edit Question'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 text-[var(--tf-danger-text)] hover:bg-[var(--tf-danger-bg)] rounded-xl border border-[var(--tf-danger-border)] cursor-pointer"
                  title={isArabic ? 'حذف السؤال' : 'Delete Question'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassContainer>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-[var(--tf-modal-bg)] border border-[var(--tf-border)] rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[var(--tf-text)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--tf-border)] mb-6">
              <h3 className="font-serif text-xl font-bold text-[var(--tf-heading)]">
                {editingId
                  ? isArabic
                    ? 'تعديل سؤال الاختبار'
                    : 'Edit Quiz Question'
                  : isArabic
                  ? 'إنشاء سؤال اختبار جديد'
                  : 'Create Quiz Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[var(--tf-muted)] hover:text-[var(--tf-heading)] rounded-lg hover:bg-[var(--tf-surface-hover)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'التصنيف' : 'Category'}
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder={isArabic ? 'مثال: التراث والتاريخ' : 'e.g. Heritage & History'}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--tf-heading)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      style={{ accentColor: currentAccentHex }}
                      className="rounded"
                    />
                    <span>
                      {isArabic ? 'نشط في اختبار بوابة الزوار' : 'Active on Visitor Portal Quiz'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                  {isArabic ? 'السؤال (بالإنجليزية) *' : 'Question (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                  {isArabic ? 'السؤال (بالعربية)' : 'Question (Arabic)'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={questionAr}
                  onChange={(e) => setQuestionAr(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[var(--tf-heading)]">
                  {isArabic
                    ? 'خيارات الإجابة (اختر الدائرة للإجابة الصحيحة):'
                    : 'Multiple Choice Options (Select radio for correct answer):'}
                </label>
                {[
                  { val: option1, set: setOption1, valAr: option1Ar, setAr: setOption1Ar, idx: 0 },
                  { val: option2, set: setOption2, valAr: option2Ar, setAr: setOption2Ar, idx: 1 },
                  { val: option3, set: setOption3, valAr: option3Ar, setAr: setOption3Ar, idx: 2 },
                  { val: option4, set: setOption4, valAr: option4Ar, setAr: setOption4Ar, idx: 3 },
                ].map((item) => (
                  <div key={item.idx} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                    <div className="sm:col-span-6 flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctIdxRadio"
                        checked={correctIndex === item.idx}
                        onChange={() => setCorrectIndex(item.idx)}
                        style={{ accentColor: currentAccentHex }}
                      />
                      <input
                        type="text"
                        required={item.idx < 2}
                        placeholder={
                          isArabic ? `الخيار ${item.idx + 1} (EN)` : `Option ${item.idx + 1} (EN)`
                        }
                        value={item.val}
                        onChange={(e) => item.set(e.target.value)}
                        className="flex-1 text-xs p-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-lg focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        dir="rtl"
                        placeholder={`الخيار ${item.idx + 1} (عربي)`}
                        value={item.valAr}
                        onChange={(e) => item.setAr(e.target.value)}
                        className="w-full text-xs p-2 bg-[var(--tf-input-bg)] text-[var(--tf-text)] placeholder:text-[var(--tf-muted)] border border-[var(--tf-border)] rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'التوضيح / المعلومة التاريخية (EN)' : 'Explanation / Historical Fact (EN)'}
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--tf-heading)] mb-1">
                    {isArabic ? 'التوضيح / المعلومة التاريخية (عربي)' : 'Explanation (AR)'}
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={explanationAr}
                    onChange={(e) => setExplanationAr(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[var(--tf-input-bg)] text-[var(--tf-text)] border border-[var(--tf-border)] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--tf-border)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-[var(--tf-text)] bg-[var(--tf-modal-subtle)] border border-[var(--tf-border)] hover:bg-[var(--tf-surface-hover)] rounded-xl cursor-pointer"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentAccentHex, color: currentAccentBtnTextHex }}
                  className="py-2 px-5 rounded-xl text-xs font-bold cursor-pointer transition-opacity hover:opacity-90"
                >
                  {editingId
                    ? isArabic
                      ? 'حفظ السؤال'
                      : 'Save Question'
                    : isArabic
                    ? 'إنشاء السؤال'
                    : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
