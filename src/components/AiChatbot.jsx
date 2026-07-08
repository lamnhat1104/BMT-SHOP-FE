import React, { useState, useRef, useEffect } from 'react';
import { aiApi } from '../api/ai';
import { Link } from 'react-router-dom';

function AiChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Xin chào! Tôi là trợ lý AI của BMT-SHOP. Bạn cần tư vấn vợt cầu lông hay kiểm tra đơn hàng?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await aiApi.chat(userMessage);
      if (res && res.response) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: res.response,
          relatedProducts: res.related_products || []
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Xin lỗi, tôi không thể trả lời lúc này.' }]);
      }
    } catch (error) {
      console.error("Lỗi khi chat AI:", error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chatbot-window">
      <div className="ai-chatbot-header">
        <div className="ai-chatbot-title">
          <span className="ai-icon">🤖</span> Trợ lý AI BMT-SHOP
        </div>
        <button className="ai-chatbot-close" onClick={onClose}>Đóng</button>
      </div>
      
      <div className="ai-chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-message-wrapper ${msg.role}`}>
            <div className={`ai-message ${msg.role}`}>
              {msg.content}
              {msg.relatedProducts && msg.relatedProducts.length > 0 && (
                <div className="ai-related-products">
                  {msg.relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      className="ai-related-product"
                      to={product.link}
                    >
                      {product.image_url && (
                        <img src={product.image_url} alt={product.title} />
                      )}
                      <div className="ai-related-product-info">
                        <strong>{product.title}</strong>
                        <span>{product.brand || 'BMT Shop'}</span>
                        {product.price != null && (
                          <b>{Number(product.price).toLocaleString('vi-VN')} đ</b>
                        )}
                        {product.stock != null && (
                          <small>Kho: {product.stock}</small>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message-wrapper ai">
            <div className="ai-message ai loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="ai-chatbot-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi của bạn..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Gửi
        </button>
      </form>

      <style>{`
        .ai-chatbot-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 350px;
          height: 500px;
          max-height: calc(100vh - 120px); /* Đảm bảo không bị che khuất trên màn hình thấp */
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          z-index: 10000;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        .ai-chatbot-header {
          flex-shrink: 0;
          background: #0068FF;
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }

        .ai-chatbot-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 15px;
          transition: background 0.2s ease;
        }
        
        .ai-chatbot-close:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .ai-chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #f8f9fa;
        }

        .ai-message-wrapper {
          display: flex;
        }

        .ai-message-wrapper.user {
          justify-content: flex-end;
        }

        .ai-message {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 15px;
          font-size: 14px;
          line-height: 1.4;
          white-space: pre-wrap;
        }

        .ai-message.user {
          background: #0068FF;
          color: white;
          border-bottom-right-radius: 5px;
        }

        .ai-message.ai {
          background: #e9ecef;
          color: #333;
          border-bottom-left-radius: 5px;
        }

        .ai-related-products {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-related-product {
          display: flex;
          gap: 8px;
          padding: 8px;
          color: inherit;
          text-decoration: none;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .ai-related-product img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
          flex: 0 0 auto;
        }

        .ai-related-product-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ai-related-product-info strong,
        .ai-related-product-info span,
        .ai-related-product-info b,
        .ai-related-product-info small {
          overflow-wrap: anywhere;
        }

        .ai-related-product-info span,
        .ai-related-product-info small {
          color: #666;
        }

        .ai-chatbot-input-area {
          flex-shrink: 0;
          display: flex;
          padding: 15px;
          border-top: 1px solid #ddd;
          background: white;
        }

        .ai-chatbot-input-area input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }

        .ai-chatbot-input-area button {
          background: #0068FF;
          color: white;
          border: none;
          padding: 0 15px;
          margin-left: 10px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .ai-chatbot-input-area button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .loading-dots span {
          animation: blink 1s infinite;
          font-size: 20px;
          line-height: 10px;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AiChatbot;
