import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, BookOpenCheck, GraduationCap, ShieldCheck, Sparkles, Send, Trash2, AlertCircle, Plus, LayoutDashboard, History, LogOut, Settings, User, Compass, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { chatbotApi } from '../../services/api.js';

const rolePrompts = {
  student: [
    '✨ What can you do?',
    '💬 Teach me something',
    '💡 Play AI Riddle'
  ],
  instructor: [
    '✨ Outline a new course',
    '💬 Write a lecture summary',
    '💡 Plan active quiz ideas'
  ],
  admin: [
    '✨ Summarize weekly stats',
    '💬 Suggest support drafts',
    '💡 Inspect system alerts'
  ]
};

export function ChatbotPage() {
  const { user, logout } = useAuth();
  const role = user?.role === 'instructor' ? 'instructor' : user?.role === 'admin' ? 'admin' : 'student';
  const displayRole = role === 'instructor' ? 'Teacher' : role === 'admin' ? 'Admin' : 'Student';
  const prompts = rolePrompts[role];

  const dashboardPath =
    role === 'admin'
      ? '/dashboard/admin'
      : role === 'instructor'
        ? '/dashboard/teacher'
        : '/dashboard/student';

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await chatbotApi.getHistory();
        setMessages(data || []);
        
        const hasDemoMsg = data?.some(m => m.content.includes('GEMINI_API_KEY is not configured'));
        if (hasDemoMsg) {
          setDemoMode(true);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load conversation history. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Send message
  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    if (!textToSend) {
      setInputText('');
    }

    const tempUserMsg = {
      _id: 'temp-' + Date.now(),
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await chatbotApi.sendMessage(messageText);
      
      if (response && response.aiMessage) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => !m._id.toString().startsWith('temp-'));
          return [...filtered, response.userMessage, response.aiMessage];
        });
        setDemoMode(response.demoMode);
      } else {
        const data = await chatbotApi.getHistory();
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
      setMessages((prev) => prev.filter((m) => !m._id.toString().startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };

  // Clear chat logs
  const handleClearHistory = async () => {
    if (!window.confirm('Clear all your chat logs? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await chatbotApi.clearHistory();
      setMessages([]);
      setDemoMode(false);
      setError(null);
    } catch (err) {
      console.error('Failed to clear chat history:', err);
      setError('Failed to clear chat history.');
    } finally {
      setLoading(false);
    }
  };

  // Markdown inline formatting
  const parseInlineStyles = (text) => {
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);
    let key = 0;

    return parts.map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key++} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={key++} className="bg-gray-150 text-rose-600 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-250">{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-700 font-medium">
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Markdown block formatting
  const formatMessageContent = (text) => {
    if (!text) return '';

    const lines = text.split('\n');
    let insideCodeBlock = false;
    let codeBlockLines = [];
    let codeBlockLang = '';

    const renderedElements = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          renderedElements.push(
            <pre key={key++} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-3">
              <code className={codeBlockLang ? `language-${codeBlockLang}` : ''}>
                {codeBlockLines.join('\n')}
              </code>
            </pre>
          );
          codeBlockLines = [];
          insideCodeBlock = false;
        } else {
          insideCodeBlock = true;
          codeBlockLang = line.trim().substring(3);
        }
        continue;
      }

      if (insideCodeBlock) {
        codeBlockLines.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        renderedElements.push(<h4 key={key++} className="text-sm font-bold text-gray-900 mt-4 mb-2">{parseInlineStyles(line.substring(4))}</h4>);
        continue;
      } else if (line.startsWith('## ')) {
        renderedElements.push(<h3 key={key++} className="text-base font-extrabold text-gray-900 mt-5 mb-2 border-b border-gray-200 pb-1">{parseInlineStyles(line.substring(3))}</h3>);
        continue;
      } else if (line.startsWith('# ')) {
        renderedElements.push(<h2 key={key++} className="text-lg font-black text-gray-950 mt-6 mb-3">{parseInlineStyles(line.substring(2))}</h2>);
        continue;
      }

      // Unordered lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        renderedElements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 my-1.5 pl-2 text-gray-700">
            <li className="text-xs leading-relaxed">{parseInlineStyles(line.trim().substring(2))}</li>
          </ul>
        );
        continue;
      }

      // Ordered lists
      const numberedListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numberedListMatch) {
        renderedElements.push(
          <ol key={key++} className="list-decimal list-inside space-y-1 my-1.5 pl-2 text-gray-700">
            <li value={numberedListMatch[1]} className="text-xs leading-relaxed">{parseInlineStyles(numberedListMatch[2])}</li>
          </ol>
        );
        continue;
      }

      if (line.trim() === '') continue;

      renderedElements.push(
        <p key={key++} className="leading-relaxed text-xs text-gray-700 mb-2">
          {parseInlineStyles(line)}
        </p>
      );
    }

    if (insideCodeBlock && codeBlockLines.length > 0) {
      renderedElements.push(
        <pre key={key++} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-3">
          <code>{codeBlockLines.join('\n')}</code>
        </pre>
      );
    }

    return renderedElements;
  };

  return (
    <section className="bg-white border-t border-gray-150 h-[calc(100vh-65px)] flex items-stretch overflow-hidden">
      
      {/* Sidebar - Recreated matching layout with White/Gray Theme */}
      <div className="hidden md:flex w-64 bg-slate-50 border-r border-gray-200 flex-col shrink-0 text-gray-800 select-none">
        
        {/* Brand Name / Header */}
        <div className="p-5 border-b border-gray-200/60 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-teal-550 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-gray-900">SkillShare Chat</span>
        </div>

        {/* Navigation Items (similar to Alibble layout) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-50/70 text-blue-600 cursor-pointer">
            <Bot size={16} />
            AI Chat
          </button>
          
          <Link to={`${dashboardPath}/profile`} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <User size={16} />
            Profile
          </Link>
          
          <Link to={`${dashboardPath}`} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <Link to={`${dashboardPath}`} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Settings size={16} />
            Settings
          </Link>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer">
            <Compass size={16} />
            Explore Tools
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left cursor-pointer">
            <HelpCircle size={16} />
            Planner & FAQ
          </button>
        </div>

        {/* Log Out at bottom (matching Alibble layout) */}
        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/60 transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>

      {/* Main Workspace Pane */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Upper Header */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-800">
              AI SkillShare Chat
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMessages([]); setDemoMode(false); setError(null); }}
              disabled={loading || messages.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-600 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus size={13} />
              New chat
            </button>
            <button
              onClick={handleClearHistory}
              disabled={loading || messages.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-600 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={13} />
              Clear history
            </button>
          </div>
        </div>

        {/* Scrollable chat body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin bg-white">
          
          <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600 shrink-0 mb-4 animate-fade-in">
                <AlertCircle size={14} className="shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            )}

            {demoMode && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 shrink-0 mb-4 animate-fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p className="flex-1">
                  <strong>Demo Mode</strong>: No <code>GEMINI_API_KEY</code> set in .env. Running on mock replies.
                </p>
              </div>
            )}

            {messages.length === 0 && !loading ? (
              /* Center Welcome Workspace (Matching the image mock-up exactly) */
              <div className="my-auto py-6 flex flex-col items-center text-center select-none">
                
                {/* Recreated Cute Computer Character Avatar */}
                <div className="relative flex flex-col items-center justify-center mb-6">
                  {/* Outer Screen Chassis */}
                  <div className="relative h-20 w-24 bg-teal-400 rounded-3xl border-4 border-slate-900 shadow-md flex items-center justify-center shadow-teal-150">
                    
                    {/* Screen reflection highlights */}
                    <div className="absolute top-1 left-2 w-5 h-1 bg-white/35 rounded-full rotate-[-5deg]"></div>

                    {/* Cute Eyes */}
                    <div className="flex gap-4">
                      <span className="w-2.5 h-2.5 bg-slate-900 rounded-full"></span>
                      <span className="w-2.5 h-2.5 bg-slate-900 rounded-full"></span>
                    </div>
                    
                    {/* Cute smile */}
                    <div className="absolute bottom-4 w-4 h-2 border-b-2 border-slate-900 rounded-b-full"></div>
                    
                    {/* Monitor Neck & Base */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 -z-10"></div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-900 rounded-full -z-10"></div>

                    {/* Antenna with glowing ring */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-slate-900 rounded-full">
                      <div className="absolute -top-1.5 -left-1 w-3.5 h-3.5 bg-teal-300 rounded-full border-2 border-slate-900 animate-ping opacity-60"></div>
                      <div className="absolute -top-1.5 -left-1 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-slate-900"></div>
                    </div>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mt-2">
                  Your smart AI buddy for all things digital
                </h1>
                
                <p className="mt-2 text-xs font-semibold text-gray-400">
                  Ask AI anything with SkillShare
                </p>
                
                {/* Horizontal suggested action cards */}
                <div className="flex flex-wrap gap-2.5 justify-center mt-8 w-full max-w-xl text-left">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-150 border border-gray-200/80 rounded-xl px-4 py-2.5 text-[11px] font-bold text-gray-800 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Dialog list */
              <div className="space-y-6 flex-1">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg._id || msg.createdAt}
                      className={`flex gap-4 items-start ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}
                    >
                      {/* Avatar */}
                      <div className={`h-8 w-8 grid place-items-center rounded-xl text-xs font-bold shrink-0 shadow-sm border ${
                        isUser
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-white text-blue-600 border-gray-200'
                      }`}>
                        {isUser ? user?.name?.[0]?.toUpperCase() || 'U' : <Bot size={16} />}
                      </div>

                      {/* Bubble */}
                      <div className="flex flex-col max-w-[80%]">
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="space-y-1.5">
                              {formatMessageContent(msg.content)}
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] text-gray-400 mt-1.5 px-1 ${isUser ? 'text-right' : ''}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loader animation */}
                {loading && (
                  <div className="flex gap-4 items-start animate-pulse">
                    <div className="h-8 w-8 grid place-items-center rounded-xl bg-white text-blue-600 border border-gray-200 shrink-0 shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="flex gap-1 items-center h-4 py-1">
                        <span className="w-1.5 h-1.5 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input box footer */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 select-none">
          <div className="max-w-2xl mx-auto w-full flex flex-col items-center gap-2">
            
            {/* Quick suggestion pills (visible when history is active) */}
            {messages.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 w-full scrollbar-none justify-start">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="text-[10px] bg-white hover:bg-gray-50 border border-gray-250 text-gray-600 rounded-full px-3 py-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Recreated Input Bar (decorations + teal submit button matching Alibble) */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="w-full flex items-center border border-gray-250 rounded-2xl pl-3.5 pr-2 py-1.5 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
              
              {/* Decorative actions (plus and mic icons on the left, matching Alibble layout) */}
              <div className="flex items-center gap-1.5 text-gray-400 shrink-0 mr-1.5">
                <button type="button" className="p-1 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <Plus size={16} />
                </button>
                <div className="w-[1px] h-4 bg-gray-200"></div>
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                placeholder="Type a prompt... Write responsive pixel perfect code."
                className="flex-1 bg-transparent border-none text-sm text-gray-800 placeholder-gray-450 focus:outline-none py-2 disabled:opacity-50"
              />
              
              {/* Send Button: Recreated as solid teal rounded box */}
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="h-10 w-10 rounded-xl bg-teal-550 hover:bg-teal-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-teal-550 cursor-pointer shrink-0 shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>

            <span className="text-[10px] text-gray-400 mt-1">
              SkillShare AI buddy. Double-check important coding concepts.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
