import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { courseApi } from '../../services/api.js';

const newQuestion = () => ({
  questionText: '',
  questionType: 'multiple-choice',
  options: ['', ''],
  correctAnswerIndex: 0,
  marks: 1
});

const newQuiz = () => ({
  title: '',
  questions: [newQuestion()],
  passMark: 50,
  timeLimitMinutes: '',
  attemptLimit: '',
  startsAt: '',
  endsAt: '',
  isPublished: true
});

const asLocalDateTime = (value) => value ? new Date(value).toISOString().slice(0, 16) : '';

const fromQuiz = (quiz) => ({
  title: quiz.title,
  questions: quiz.questions.map((question) => ({
    questionText: question.questionText,
    questionType: question.questionType || 'multiple-choice',
    options: question.questionType === 'true-false' ? ['True', 'False'] : [...question.options],
    correctAnswerIndex: question.correctAnswerIndex,
    marks: question.marks || 1
  })),
  passMark: quiz.passMark ?? 50,
  timeLimitMinutes: quiz.timeLimitMinutes ?? '',
  attemptLimit: quiz.attemptLimit ?? '',
  startsAt: asLocalDateTime(quiz.startsAt),
  endsAt: asLocalDateTime(quiz.endsAt),
  isPublished: quiz.isPublished !== false
});

export function QuizManager({ courseId, quizzes = [], onChange }) {
  const [form, setForm] = useState(newQuiz);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const updateQuestion = (index, updates) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) => (
        questionIndex === index ? { ...question, ...updates } : question
      ))
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const question = form.questions[questionIndex];
    updateQuestion(questionIndex, {
      options: question.options.map((option, index) => index === optionIndex ? value : option)
    });
  };

  const resetForm = () => {
    setForm(newQuiz());
    setEditingId(null);
    setShowForm(false);
  };

  const saveQuiz = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const payload = {
        ...form,
        passMark: Number(form.passMark),
        timeLimitMinutes: form.timeLimitMinutes === '' ? null : Number(form.timeLimitMinutes),
        attemptLimit: form.attemptLimit === '' ? null : Number(form.attemptLimit),
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null
      };
      if (editingId) {
        const updated = await courseApi.updateQuiz(courseId, editingId, payload);
        onChange(quizzes.map((quiz) => quiz._id === editingId ? updated : quiz));
        setNotice('Quiz updated.');
      } else {
        const created = await courseApi.addQuiz(courseId, payload);
        onChange([...quizzes, created]);
        setNotice('Quiz created.');
      }
      resetForm();
    } catch (apiError) {
      setError(apiError.message || 'Unable to save quiz.');
    } finally {
      setSaving(false);
    }
  };

  const editQuiz = (quiz) => {
    setForm(fromQuiz(quiz));
    setEditingId(quiz._id);
    setShowForm(true);
    setError('');
    setNotice('');
  };

  const togglePublished = async (quiz) => {
    setError('');
    setNotice('');
    try {
      const updated = await courseApi.updateQuiz(courseId, quiz._id, { isPublished: quiz.isPublished === false });
      onChange(quizzes.map((current) => current._id === quiz._id ? updated : current));
      setNotice(`Quiz ${updated.isPublished ? 'published' : 'unpublished'}.`);
    } catch (apiError) {
      setError(apiError.message || 'Unable to update quiz publication.');
    }
  };

  const removeQuiz = async (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"? Existing attempt history will be retained.`)) return;
    setError('');
    try {
      await courseApi.removeQuiz(courseId, quiz._id);
      onChange(quizzes.filter((current) => current._id !== quiz._id));
      setNotice('Quiz deleted. Existing attempt records are retained.');
    } catch (apiError) {
      setError(apiError.message || 'Unable to delete quiz.');
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-950">Quizzes</h3>
          <p className="mt-1 text-sm text-gray-500">Create and review course evaluations.</p>
        </div>
        {!showForm && (
          <button type="button" onClick={() => { setForm(newQuiz()); setEditingId(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-md bg-teal-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-900">
            <Plus size={16} /> Add Quiz
          </button>
        )}
      </div>

      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{notice}</p>}

      {showForm && (
        <form onSubmit={saveQuiz} className="space-y-5 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-black text-gray-950">{editingId ? 'Edit quiz' : 'New quiz'}</h4>
            <button type="button" onClick={resetForm} aria-label="Close quiz editor" className="rounded-md p-2 text-gray-600 hover:bg-gray-100"><X size={18} /></button>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-gray-700">Quiz title</span>
            <input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2.5" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block space-y-1.5 text-sm font-bold text-gray-700">Pass mark (%)
              <input required type="number" min="0" max="100" step="0.01" value={form.passMark} onChange={(event) => setForm({ ...form, passMark: event.target.value })} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
            </label>
            <label className="block space-y-1.5 text-sm font-bold text-gray-700">Time limit (minutes)
              <input type="number" min="1" step="1" placeholder="No limit" value={form.timeLimitMinutes} onChange={(event) => setForm({ ...form, timeLimitMinutes: event.target.value })} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
            </label>
            <label className="block space-y-1.5 text-sm font-bold text-gray-700">Attempt limit
              <input type="number" min="1" step="1" placeholder="Unlimited" value={form.attemptLimit} onChange={(event) => setForm({ ...form, attemptLimit: event.target.value })} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
            </label>
            <label className="block space-y-1.5 text-sm font-bold text-gray-700">Opens at
              <input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
            </label>
            <label className="block space-y-1.5 text-sm font-bold text-gray-700">Closes at
              <input type="datetime-local" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal" />
            </label>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-bold text-gray-700">
              <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} /> Published
            </label>
          </div>

          <div className="space-y-4">
            {form.questions.map((question, questionIndex) => (
              <fieldset key={questionIndex} className="space-y-3 rounded-md border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <legend className="font-bold text-gray-900">Question {questionIndex + 1}</legend>
                  {form.questions.length > 1 && <button type="button" onClick={() => setForm({ ...form, questions: form.questions.filter((_, index) => index !== questionIndex) })} className="inline-flex items-center gap-1 text-xs font-bold text-red-700"><Trash2 size={14} /> Remove</button>}
                </div>
                <input required maxLength={1000} value={question.questionText} onChange={(event) => updateQuestion(questionIndex, { questionText: event.target.value })} placeholder="Question text" className="w-full rounded-md border border-gray-300 px-3 py-2" />
                <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
                  <label className="text-xs font-bold text-gray-600">Question type
                    <select value={question.questionType} onChange={(event) => updateQuestion(questionIndex, { questionType: event.target.value, options: event.target.value === 'true-false' ? ['True', 'False'] : ['', ''], correctAnswerIndex: 0 })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900">
                      <option value="multiple-choice">Multiple choice</option>
                      <option value="true-false">True / False</option>
                    </select>
                  </label>
                  <label className="text-xs font-bold text-gray-600">Marks
                    <input required type="number" min="0.01" step="0.01" value={question.marks} onChange={(event) => updateQuestion(questionIndex, { marks: event.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900" />
                  </label>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600">Options and correct answer</p>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${questionIndex}`} aria-label={`Mark option ${optionIndex + 1} correct`} checked={question.correctAnswerIndex === optionIndex} onChange={() => updateQuestion(questionIndex, { correctAnswerIndex: optionIndex })} />
                      <input required readOnly={question.questionType === 'true-false'} value={option} onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)} className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm read-only:bg-gray-100" />
                      {question.questionType === 'multiple-choice' && question.options.length > 2 && <button type="button" aria-label="Remove option" onClick={() => updateQuestion(questionIndex, { options: question.options.filter((_, index) => index !== optionIndex), correctAnswerIndex: question.correctAnswerIndex === optionIndex ? 0 : question.correctAnswerIndex > optionIndex ? question.correctAnswerIndex - 1 : question.correctAnswerIndex })} className="rounded p-2 text-red-700 hover:bg-red-50"><X size={16} /></button>}
                    </div>
                  ))}
                  {question.questionType === 'multiple-choice' && <button type="button" onClick={() => updateQuestion(questionIndex, { options: [...question.options, ''] })} className="text-sm font-bold text-teal-800 hover:underline">Add option</button>}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setForm({ ...form, questions: [...form.questions, newQuestion()] })} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"><Plus size={15} /> Add question</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-teal-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"><Save size={15} /> {saving ? 'Saving...' : 'Save quiz'}</button>
            <button type="button" onClick={resetForm} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700">Cancel</button>
          </div>
        </form>
      )}

      {!quizzes.length && <p className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">No quizzes have been added to this course.</p>}
      <div className="space-y-3">
        {quizzes.map((quiz) => (
          <article key={quiz._id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-black text-gray-950">{quiz.title}</h4>
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${quiz.isPublished === false ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>{quiz.isPublished === false ? 'Draft' : 'Published'}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{quiz.questions.length} questions · {quiz.questions.reduce((sum, question) => sum + Number(question.marks || 1), 0)} marks · Pass {quiz.passMark ?? 50}%</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <button type="button" onClick={() => editQuiz(quiz)} title="Edit quiz" className="rounded p-2 text-gray-700 hover:bg-gray-100"><Pencil size={16} /></button>
                <button type="button" onClick={() => togglePublished(quiz)} title={quiz.isPublished === false ? 'Publish quiz' : 'Unpublish quiz'} className="rounded p-2 text-gray-700 hover:bg-gray-100">{quiz.isPublished === false ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <button type="button" onClick={() => removeQuiz(quiz)} title="Delete quiz" className="rounded p-2 text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
            <QuizResults courseId={courseId} quizId={quiz._id} />
          </article>
        ))}
      </div>
    </section>
  );
}

function QuizResults({ courseId, quizId }) {
  const [open, setOpen] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleResults = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen || attempts.length) return;
    setLoading(true);
    setError('');
    try {
      setAttempts(await courseApi.quizAttempts(courseId, quizId));
    } catch (apiError) {
      setError(apiError.message || 'Unable to load quiz attempts.');
    } finally {
      setLoading(false);
    }
  };

  const showAttempt = async (attemptId) => {
    setError('');
    try {
      setSelectedAttempt(await courseApi.quizAttempt(courseId, quizId, attemptId));
    } catch (apiError) {
      setError(apiError.message || 'Unable to load this attempt.');
    }
  };

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <button type="button" onClick={toggleResults} className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:underline">
        Results {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading attempts...</p>}
          {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
          {!loading && !attempts.length && !error && <p className="text-sm text-gray-500">No attempts recorded yet.</p>}
          {attempts.map((attempt) => (
            <button key={attempt._id} type="button" onClick={() => showAttempt(attempt._id)} className="flex w-full flex-wrap items-center justify-between gap-2 rounded-md border border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50">
              <span className="font-bold text-gray-900">{attempt.student?.name || 'Student'} · Attempt {attempt.attemptNumber}</span>
              <span className="text-gray-600">{attempt.status === 'in-progress' ? 'In progress' : `${attempt.score}/${attempt.totalMarks} (${attempt.percentage}%) · ${attempt.passed ? 'Passed' : 'Failed'}`}</span>
            </button>
          ))}
          {selectedAttempt && (
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="font-black text-gray-900">{selectedAttempt.student?.name} · Attempt {selectedAttempt.attemptNumber}</h5>
                <button type="button" onClick={() => setSelectedAttempt(null)} aria-label="Close attempt details" className="rounded p-1 text-gray-600 hover:bg-gray-200"><X size={16} /></button>
              </div>
              <p className="mt-1 text-sm text-gray-600">{selectedAttempt.score}/{selectedAttempt.totalMarks} · {selectedAttempt.percentage}% · {selectedAttempt.passed ? 'Passed' : 'Failed'}</p>
              <div className="mt-3 space-y-3">
                {selectedAttempt.questions?.map((question, index) => (
                  <div key={question._id || question.questionId || index} className="border-t border-gray-200 pt-3 text-sm">
                    <p className="font-bold text-gray-900">{index + 1}. {question.questionText} ({question.marks} marks)</p>
                    <p className="mt-1 text-gray-700">Student answer: {question.selectedAnswerIndex === null ? 'No answer' : question.options[question.selectedAnswerIndex]}</p>
                    <p className="text-emerald-800">Correct answer: {question.options[question.correctAnswerIndex]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
