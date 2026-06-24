import { Link } from 'react-router-dom';
import { Bot, BookOpenCheck, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';

const rolePrompts = {
  student: [
    'Find courses that match my learning goals.',
    'Help me plan my weekly study schedule.',
    'Recommend a beginner-friendly course.'
  ],
  instructor: [
    'Suggest a lesson structure for a new course.',
    'Help me review student engagement insights.',
    'Draft a course announcement for my class.'
  ],
  admin: [
    'Summarize enrollment trends for this month.',
    'Help me review platform activity reports.',
    'Suggest improvements for student support.'
  ]
};

const roleHighlights = {
  student: [
    { title: 'Learn faster', text: 'Get guidance for courses, progress, and next steps.' },
    { title: 'Stay organized', text: 'Ask for practice plans, reminders, and study tips.' }
  ],
  instructor: [
    { title: 'Teach smarter', text: 'Get course ideas, presentation structure, and feedback prompts.' },
    { title: 'Grow your class', text: 'Plan announcements, engagement ideas, and student outreach.' }
  ],
  admin: [
    { title: 'Run smoothly', text: 'Monitor activity and respond to operational questions quickly.' },
    { title: 'Support better', text: 'Use insights to improve student and teacher experience.' }
  ]
};

export function ChatbotPage() {
  const { user } = useAuth();
  const role = user?.role === 'instructor' ? 'instructor' : user?.role === 'admin' ? 'admin' : 'student';
  const displayRole = role === 'instructor' ? 'Teacher' : role === 'admin' ? 'Admin' : 'Student';
  const prompts = rolePrompts[role];
  const highlights = roleHighlights[role];

  const dashboardPath =
    role === 'admin'
      ? '/dashboard/admin'
      : role === 'instructor'
        ? '/dashboard/teacher'
        : '/dashboard/student';

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              SkillShare Assistant
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Ask your AI assistant anything for your learning journey.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              This chatbot is built for {displayRole.toLowerCase()}s to get support, ideas, and quick guidance without leaving the platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={dashboardPath} className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
                Go to dashboard
              </Link>
              <a href="#quick-ideas" className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50">
                Explore ideas
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <article key={item.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="font-black text-gray-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                <Bot size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-200">Live assistant</p>
                <h2 className="text-xl font-black">Ask anything</h2>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-4">
              <div className="rounded-2xl bg-white/90 p-3 text-sm text-gray-700">
                Hi {displayRole.toLowerCase()}! I can help you with learning, teaching, or platform tasks.
              </div>
              <div className="rounded-2xl border border-white/15 p-3 text-sm text-gray-200">
                Try asking: “Help me find the best next step for my goals.”
              </div>
            </div>

            <div id="quick-ideas" className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                {role === 'admin' ? <ShieldCheck size={16} /> : role === 'instructor' ? <GraduationCap size={16} /> : <BookOpenCheck size={16} />}
                Suggested prompts
              </div>
              <div className="mt-3 space-y-2">
                {prompts.map((prompt) => (
                  <button key={prompt} className="block w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-sm text-gray-100 hover:bg-white/20">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
