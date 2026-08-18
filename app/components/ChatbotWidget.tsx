'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.response }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Lo siento, hubo un error. Por favor intenta de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante con ícono personalizado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-[#50AE31] to-[#0B4227] p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-50 leaf-shadow"
          aria-label="Abrir chat de Frutatza"
        >
          <div className="relative w-12 h-12">
            <Image
              src="/images/logo-circular.png"
              alt="Chat Frutatza"
              fill
              className="object-contain"
            />
          </div>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-[#F5F1E8] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border-2 border-[#50AE31]">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#0B4227] to-[#50AE31] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/logo-circular.png"
                  alt="Frutatza"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Asistente Frutatza</h3>
                <p className="text-xs text-[#F5F1E8]">En línea 🟢</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-3xl hover:text-[#F8AC1C] transition-colors"
              aria-label="Cerrar chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 selva-pattern">
            {messages.length === 0 && (
              <div className="text-[#0B4227] text-center text-sm mt-10 bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-2xl mb-2">🍯</div>
                <p className="font-semibold">¡Hola! Soy el asistente de Frutatza</p>
                <p className="text-xs mt-2">¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#50AE31] to-[#0B4227] text-white rounded-br-sm'
                      : 'bg-white text-[#0B4227] rounded-bl-sm border border-[#50AE31]/20'
                  }`}
                  style={{ wordWrap: 'break-word' }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-[#0B4227] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm shadow-md border border-[#50AE31]/20">
                  <span className="flex items-center gap-1">
                    Escribiendo
                    <span className="animate-pulse">...</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-2 border-[#50AE31]/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2.5 border-2 border-[#50AE31]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#50AE31] focus:border-transparent text-[#0B4227] placeholder-[#0B4227]/50"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-gradient-to-br from-[#50AE31] to-[#0B4227] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
