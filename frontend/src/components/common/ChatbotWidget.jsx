import { useEffect, useRef, useState } from 'react';
import { Bot, BookOpenCheck, GraduationCap, ShieldCheck, Sparkles, Send, Trash2, AlertCircle, MessageCircle, X, Minus } from 'lucide-react';
import { useAuth } from '../../context/useAuth.js';
import { chatbotApi } from '../../services/api.js';

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

export function ChatbotWidget() {
  const { user, isAuthenticated } = useAuth();
  
  // Only render for logged-in users
  if (!isAuthenticated || !user) return null;

  const role = user?.role === 'instructor' ? 'instructor' : user?.role === 'admin' ? 'admin' : 'student';
  const displayRole = role === 'instructor' ? 'Teacher' : role === 'admin' ? 'Admin' : 'Student';
  const prompts = rolePrompts[role];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history when the widget is opened
  useEffect(() => {
    if (!isOpen) return;

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
        console.error('Failed to load chat history in widget:', err);
        setError('Failed to load conversation history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen]);

  // Scroll to bottom on new messages or loading
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

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
      console.error('Failed to send message in widget:', err);
      setError(err.message || 'Failed to send message.');
      setMessages((prev) => prev.filter((m) => !m._id.toString().startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
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
      console.error('Failed to clear chat history in widget:', err);
      setError('Failed to clear chat logs.');
    } finally {
      setLoading(false);
    }
  };

  // Inline markdown rendering
  const parseInlineStyles = (text) => {
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);
    let key = 0;

    return parts.map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={key++} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={key++} className="bg-gray-100 text-rose-600 px-1.5 py-0.5 rounded font-mono text-xs border border-gray-200">{part.slice(1, -1)}</code>;
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

  // Block markdown rendering
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

      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          renderedElements.push(
            <pre key={key++} className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-800 my-2">
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

      if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
        const textContent = line.replace(/^#+\s/, '');
        renderedElements.push(<h4 key={key++} className="text-sm font-bold text-gray-900 mt-3 mb-1">{parseInlineStyles(textContent)}</h4>);
        continue;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        renderedElements.push(
          <ul key={key++} className="list-disc list-inside space-y-0.5 my-1 pl-1 text-gray-700">
            <li className="text-xs leading-relaxed">{parseInlineStyles(line.trim().substring(2))}</li>
          </ul>
        );
        continue;
      }

      const numberedListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numberedListMatch) {
        renderedElements.push(
          <ol key={key++} className="list-decimal list-inside space-y-0.5 my-1 pl-1 text-gray-700">
            <li value={numberedListMatch[1]} className="text-xs leading-relaxed">{parseInlineStyles(numberedListMatch[2])}</li>
          </ol>
        );
        continue;
      }

      if (line.trim() === '') continue;

      renderedElements.push(
        <p key={key++} className="leading-relaxed text-xs text-gray-700 mb-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    }

    if (insideCodeBlock && codeBlockLines.length > 0) {
      renderedElements.push(
        <pre key={key++} className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-800 my-2">
          <code>{codeBlockLines.join('\n')}</code>
        </pre>
      );
    }

    return renderedElements;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all duration-300 focus:outline-none border border-white/10"
        title="Chat with AI Assistant"
      >
        {isOpen ? <X size={24} className="animate-spin-once" /> : <Bot size={24} />}
        
        {/* Pulsing indicator when chat is closed and empty */}
        {!isOpen && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[520px] z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/90 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Bot size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] font-semibold text-blue-600">Live assistant</p>
                </div>
                <h3 className="text-xs font-bold text-gray-900">SkillShare Assistant</h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-gray-100 rounded transition-all duration-200 disabled:opacity-50"
                  title="Clear Chat Logs"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-all duration-200"
                title="Minimize Chat"
              >
                <Minus size={14} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 scrollbar-thin flex flex-col bg-gray-50">
            
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-[10px] text-rose-600 shrink-0">
                <AlertCircle size={12} className="shrink-0" />
                <p className="flex-1">{error}</p>
              </div>
            )}

            {demoMode && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[10px] text-amber-700 shrink-0">
                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                <p className="flex-1">
                  <strong>Demo Mode</strong>: Backend lacks `GEMINI_API_KEY`. Running on mock responses.
                </p>
              </div>
            )}

            {messages.length === 0 && !loading ? (
              /* Welcome Screen */
              <div className="flex flex-col items-center justify-center h-full text-center p-3 my-auto">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900">How can I help you, {displayRole.toLowerCase()}?</h4>
                <p className="mt-1 text-[11px] text-gray-500 max-w-xs leading-normal">
                  I can review schedules, explain coding concepts, structure courses, or query outlines.
                </p>
                
                <div className="mt-6 w-full text-left">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 mb-2 pl-0.5">
                    {role === 'admin' ? <ShieldCheck size={12} /> : role === 'instructor' ? <GraduationCap size={12} /> : <BookOpenCheck size={12} />}
                    Suggested prompts
                  </div>
                  <div className="grid gap-1.5">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        className="block w-full text-left text-[11px] bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 text-gray-700 transition-all duration-200 hover:translate-x-0.5 cursor-pointer shadow-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Conversation Log */
              <div className="flex flex-col gap-3">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg._id || msg.createdAt}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[88%] px-3 py-2.5 rounded-xl text-xs shadow-md leading-relaxed selection:bg-blue-800 selection:text-white ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="space-y-1">
                            {formatMessageContent(msg.content)}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-start gap-2.5 animate-pulse">
                    <div className="grid h-6 w-6 place-items-center rounded bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                      <Bot size={12} />
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-xl rounded-tl-none shadow-md">
                      <div className="flex gap-0.5 items-center h-3">
                        <span className="w-1 h-1 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-1 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-1 bg-blue-450 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Quick suggestions scrollbar (visible only if messages exist) */}
          {messages.length > 0 && (
            <div className="flex gap-2 text-left px-3 pb-2 shrink-0 overflow-x-auto scrollbar-none bg-white">
              <div className="flex gap-1 whitespace-nowrap">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="text-[9px] bg-white hover:bg-gray-50 border border-gray-250 text-gray-600 rounded-full px-2.5 py-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
                  >
                    {prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative bg-gray-50 px-3 py-2.5 border-t border-gray-100 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder="Ask a question..."
              className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="absolute right-5 top-[23px] -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 disabled:hover:text-gray-400 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
