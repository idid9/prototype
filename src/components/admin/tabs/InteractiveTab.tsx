import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { QuizQuestion } from '../../../types';
import { DataService } from '../../../services/dataService';
import { Sparkles, Edit2, Plus, CheckCircle, X, Trophy } from 'lucide-react';

interface InteractiveTabProps {
  quizzes: QuizQuestion[];
}

export const InteractiveTab: React.FC<InteractiveTabProps> = ({ quizzes }) => {
  const { isRtl } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [question, setQuestion] = useState('');
  const [questionAr, setQuestionAr] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [explanationAr, setExplanationAr] = useState('');
  const [category, setCategory] = useState('Heritage & History');
  const [active, setActive] = useState(true);

  const handleOpenEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setQuestion(q.question);
    setQuestionAr(q.questionAr);
    setOption1(q.options[0] || '');
    setOption2(q.options[1] || '');
    setOption3(q.options[2] || '');
    setOption4(q.options[3] || '');
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const options = [option1.trim(), option2.trim(), option3.trim(), option4.trim()].filter(Boolean);

    if (editingId) {
      DataService.updateQuizQuestion(editingId, {
        question: question.trim(),
        questionAr: questionAr.trim() || question.trim(),
        options,
        optionsAr: options, // fallback to same choices if unstated
        correctIndex,
        explanation: explanation.trim(),
        explanationAr: explanationAr.trim() || explanation.trim(),
        category,
        active,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#123B32]">
            Interactive Quiz & Mini-Game Questions
          </h2>
          <p className="text-xs text-[#777D75]">
            Manage gamified destination questions and matcher heuristics shown on the visitor portal.
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {quizzes.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white border border-[#D9C29A]/50 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#123B32]">Q{idx + 1}.</span>
                <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#D9C29A]/40 text-[#777D75] text-[11px]">
                  {q.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    q.active ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {q.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[#123B32]">{q.question}</h3>
              <p className="text-xs text-[#777D75]" dir="rtl">
                {q.questionAr}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {q.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      i === q.correctIndex
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold'
                        : 'border-[#D9C29A]/30 bg-[#FAF8F5] text-[#202923]'
                    }`}
                  >
                    <span>{opt}</span>
                    {i === q.correctIndex && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="p-3 bg-[#D9C29A]/15 border border-[#D9C29A]/30 rounded-xl text-xs text-[#123B32] mt-2">
                <span className="font-bold">Explanation: </span>
                <span>{q.explanation}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleActive(q)}
                className="py-1.5 px-3 bg-[#FAF8F5] hover:bg-[#D9C29A]/20 border border-[#D9C29A]/40 rounded-xl text-xs font-semibold text-[#123B32] cursor-pointer"
              >
                {q.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleOpenEdit(q)}
                className="p-2 text-[#123B32] hover:bg-[#D9C29A]/20 rounded-xl border border-[#D9C29A]/40 cursor-pointer"
                title="Edit Question"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#D9C29A]/50 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D9C29A]/40 mb-6">
              <h3 className="font-serif text-xl font-bold text-[#123B32]">
                Edit Quiz Question
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#777D75]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Question (English) *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Question (Arabic)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={questionAr}
                  onChange={(e) => setQuestionAr(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#123B32]">
                  Multiple Choice Options (Select radio for correct answer):
                </label>
                {[
                  { val: option1, set: setOption1, idx: 0 },
                  { val: option2, set: setOption2, idx: 1 },
                  { val: option3, set: setOption3, idx: 2 },
                  { val: option4, set: setOption4, idx: 3 },
                ].map((item) => (
                  <div key={item.idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIdxRadio"
                      checked={correctIndex === item.idx}
                      onChange={() => setCorrectIndex(item.idx)}
                      className="text-[#123B32]"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${item.idx + 1}`}
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      className="flex-1 text-xs p-2 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#123B32] mb-1">
                  Explanation / Historical Fact
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D9C29A]/50 rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-[#D9C29A]/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 text-xs font-semibold text-[#777D75]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#123B32] hover:bg-[#1D5546] text-white rounded-xl text-xs font-semibold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
