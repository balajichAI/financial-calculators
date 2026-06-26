import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  X, 
  ArrowRight, 
  Globe, 
  ExternalLink, 
  Loader2, 
  TrendingUp, 
  Bookmark, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Source {
  title: string;
  uri: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  searchQueries?: string[];
  sources?: Source[];
}

interface WealthCalcCopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  "Latest SBI home loan interest rates",
  "Current inflation rate in India",
  "Nifty 50 10-year historical return CAGR",
  "Top rated equity mutual funds 2026",
];

export default function WealthCalcCopilot({ isOpen, onClose }: WealthCalcCopilotProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **WealthCalc Copilot**, powered by **Google Search Grounding**.

I can search the live web for real-time interest rates, current inflation statistics, or historical mutual fund returns so you can plug them directly into your calculators.

Try asking me one of the suggestions below!`,
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSearchSubmit = async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;

    const userMessageId = `msg-${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMessageId, role: 'user' as const, content: searchQuery }
    ];
    setMessages(newMessages);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve search results');
      }

      const data = await response.json();
      
      setMessages([
        ...newMessages,
        {
          id: `reply-${Date.now()}`,
          role: 'assistant' as const,
          content: data.answer || "I'm sorry, I couldn't find a direct answer. Please try a different query.",
          searchQueries: data.searchQueries || [],
          sources: data.sources || [],
        }
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          id: `error-${Date.now()}`,
          role: 'assistant' as const,
          content: `⚠️ **Error:** ${err?.message || "Could not connect to the server. Please ensure the backend is running."}`,
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Web Link';
    }
  };

  // Simple Markdown Parser for beautiful text rendering
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold handling: **text**
      let parsedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const matches = [...parsedLine.matchAll(boldRegex)];
      
      let elements: React.ReactNode[] = [];
      let lastIndex = 0;

      if (matches.length > 0) {
        matches.forEach((match, mIdx) => {
          const textBefore = parsedLine.substring(lastIndex, match.index);
          const boldText = match[1];
          if (textBefore) elements.push(textBefore);
          elements.push(<strong key={`bold-${mIdx}`} className="font-bold text-slate-900">{boldText}</strong>);
          lastIndex = (match.index || 0) + match[0].length;
        });
        const textAfter = parsedLine.substring(lastIndex);
        if (textAfter) elements.push(textAfter);
      } else {
        elements.push(parsedLine);
      }

      // Render headings
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-sans font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {elements}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-base font-display font-extrabold text-slate-900 mt-4 mb-2 border-b border-slate-100 pb-1">
            {elements}
          </h3>
        );
      }

      // Render bullet list
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleanContent = line.trim().substring(2);
        // Parse bold inside list item
        const bulletMatches = [...cleanContent.matchAll(boldRegex)];
        let bulletElements: React.ReactNode[] = [];
        let bLastIdx = 0;
        
        if (bulletMatches.length > 0) {
          bulletMatches.forEach((match, mIdx) => {
            const textBefore = cleanContent.substring(bLastIdx, match.index);
            const boldText = match[1];
            if (textBefore) bulletElements.push(textBefore);
            bulletElements.push(<strong key={`bold-li-${mIdx}`} className="font-bold text-slate-900">{boldText}</strong>);
            bLastIdx = (match.index || 0) + match[0].length;
          });
          const textAfter = cleanContent.substring(bLastIdx);
          if (textAfter) bulletElements.push(textAfter);
        } else {
          bulletElements.push(cleanContent);
        }

        return (
          <li key={idx} className="ml-5 list-disc text-slate-600 mb-1.5 leading-relaxed">
            {bulletElements}
          </li>
        );
      }

      // Render paragraph
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-slate-600 leading-relaxed mb-2">
          {elements}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Copilot Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
            id="wealthcalc-copilot-drawer"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-sans font-bold text-slate-900 flex items-center gap-1.5">
                    Live Web Co-pilot
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" /> GOOGLE SEARCH GROUNDED
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5" id="copilot-messages">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Speaker Label */}
                  <span className="text-[10px] font-mono text-slate-400 mb-1 select-none px-1 flex items-center gap-1">
                    {msg.role === 'user' ? (
                      <>You</>
                    ) : (
                      <>
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> WealthCalc AI
                      </>
                    )}
                  </span>

                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl max-w-[92%] shadow-2xs border text-xs font-sans ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-slate-50/80 text-slate-700 border-slate-100'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderMarkdown(msg.content)}
                      </div>
                    )}
                  </div>

                  {/* Google Search Grounds and Citations (Only for assistant replies with data) */}
                  {msg.role === 'assistant' && (msg.searchQueries?.length || 0) > 0 && (
                    <div className="w-full mt-2.5 px-2.5 py-2 bg-emerald-50/40 border border-emerald-100/40 rounded-xl space-y-2">
                      {/* Search Queries Used */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                          <Search className="w-2.5 h-2.5" /> Google Search:
                        </span>
                        {msg.searchQueries?.map((q, qIdx) => (
                          <span key={qIdx} className="text-[10px] text-slate-500 italic">
                            "{q}"{qIdx < (msg.searchQueries?.length || 1) - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>

                      {/* Cited Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="space-y-1.5 pt-1.5 border-t border-emerald-100/30">
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                            Verified Sources & Citations
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {msg.sources.slice(0, 4).map((source, sIdx) => (
                              <a
                                key={sIdx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white border border-slate-100 hover:border-emerald-200 transition-colors flex flex-col justify-between group cursor-pointer"
                              >
                                <span className="text-[10px] font-sans font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600">
                                  {source.title}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5 mt-1 truncate">
                                  <Globe className="w-2.5 h-2.5 shrink-0" />
                                  {getDomain(source.uri)}
                                  <ExternalLink className="w-2 h-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-emerald-600" />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Loader during query */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-500 animate-spin" /> WealthCalc AI is searching...
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>Scouting Google, validating financial data...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Block */}
            {messages.length === 1 && !isLoading && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/40">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Popular Searches
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_SUGGESTIONS.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSearchSubmit(suggestion)}
                      className="w-full text-left p-2.5 rounded-xl bg-white border border-slate-150 hover:border-emerald-200 hover:bg-emerald-50/20 text-xs font-medium text-slate-700 flex justify-between items-center transition-all cursor-pointer group"
                    >
                      <span>{suggestion}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Query Input Footer */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(query);
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask for home loan rates, FD yields, returns..."
                  disabled={isLoading}
                  className="w-full text-xs font-sans rounded-xl pl-3.5 pr-10 py-3 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <div className="flex justify-between items-center mt-2 px-1 select-none">
                <span className="text-[9px] text-slate-400 flex items-center gap-1 leading-none">
                  <Globe className="w-2.5 h-2.5" /> Results verified via Live Search.
                </span>
                <span className="text-[9px] text-slate-400 leading-none">
                  AI responses can have errors.
                </span>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
