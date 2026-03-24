import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, X, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingChunks?: any[];
}

export default function TutorChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Selam! I am your Tibeb AI Tutor. How can I help you study today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const transcript = messages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n') + `\nStudent: ${userMessage.text}\nTutor:`;
      
      const model = useWebSearch ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview';
      const config: any = {
        systemInstruction: 'You are a helpful, encouraging tutor for a flashcard app called Tibeb.ai. You help students understand concepts deeply using the Wax & Gold method (surface fact vs deep meaning). Keep responses concise and educational.',
      };

      if (useWebSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model,
        contents: transcript,
        config
      });

      if (response.text) {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: response.text as string,
          groundingChunks: chunks
        }]);
      }
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Sorry, I encountered an error connecting to my knowledge base.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-earth flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-coffee text-parchment p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-gold" size={20} />
          <h3 className="font-display font-bold text-lg">Tibeb AI Tutor</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setUseWebSearch(!useWebSearch)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${useWebSearch ? 'bg-gold text-coffee border-gold' : 'border-parchment/30 text-parchment/70 hover:text-parchment'}`}
            title="Toggle Web Search"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">{useWebSearch ? 'Web Search On' : 'Web Search Off'}</span>
          </button>
          <button onClick={onClose} className="text-parchment/70 hover:text-parchment transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchment/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-highland text-white' : 'bg-gold text-coffee'}`}>
              {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-highland text-white rounded-tr-none' : 'bg-white border border-earth text-coffee rounded-tl-none shadow-sm'}`}>
              <div className="text-sm prose prose-sm max-w-none">
                <Markdown>{msg.text}</Markdown>
              </div>
              {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-earth/20">
                  <p className="text-xs font-semibold mb-1 text-coffee/70">Sources:</p>
                  <ul className="text-xs space-y-1">
                    {msg.groundingChunks.map((chunk, idx) => chunk.web?.uri ? (
                      <li key={idx} className="truncate">
                        <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-highland hover:underline">
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      </li>
                    ) : null)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gold text-coffee flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-earth rounded-2xl p-4 rounded-tl-none shadow-sm flex gap-1">
              <div className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-coffee/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-earth">
        <div className="flex items-center gap-2 bg-parchment rounded-full px-4 py-2 border border-earth focus-within:border-gold transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-coffee placeholder-coffee/40"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-coffee text-gold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coffee/90 transition-colors"
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
