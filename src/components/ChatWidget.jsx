import React from 'react';

function ChatWidget() {
  const zaloPhone = '0977508430'; // Số hotline từ Header
  const zaloUrl = `https://zalo.me/${zaloPhone}`;
  const messengerUrl = 'https://m.me/bmtshop'; // Link Messenger fanpage mẫu

  return (
    <>
      <div className="floating-chat-container">
        {/* Messenger Button */}
        <a 
          href={messengerUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chat-btn messenger-btn"
          aria-label="Chat qua Messenger"
        >
          <svg viewBox="0 0 24 24" className="chat-icon" xmlns="http://www.w3.org/2000/svg">
            <path fill="url(#messenger-grad)" d="M12 2C6.36 2 2 6.13 2 11.7c0 3.1 1.7 5.86 4.35 7.42V22l2.72-1.49c.92.25 1.9.39 2.93.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.18 12.3l-2.2-2.35-4.3 2.35 4.72-5.01 2.22 2.35 4.28-2.35-4.72 5.06z"/>
            <defs>
              <linearGradient id="messenger-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#006cff" />
                <stop offset="50%" stopColor="#a62cff" />
                <stop offset="100%" stopColor="#ff527f" />
              </linearGradient>
            </defs>
          </svg>
          <span className="chat-tooltip">Chat qua Messenger</span>
        </a>

        {/* Zalo Button */}
        <a 
          href={zaloUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chat-btn zalo-btn"
          aria-label="Chat qua Zalo"
        >
          <svg viewBox="0 0 40 40" className="chat-icon" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#0068FF" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12">Zalo</text>
          </svg>
          <span className="chat-tooltip">Chat qua Zalo</span>
        </a>
      </div>

      <style>{`
        .floating-chat-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 9999;
          pointer-events: none; /* Let clicks pass through empty spaces */
        }

        .chat-btn {
          pointer-events: auto; /* Re-enable pointer events for buttons */
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: floatIn 0.8s ease-out both;
        }

        .messenger-btn {
          animation-delay: 0.2s;
        }

        .zalo-btn {
          animation-delay: 0.4s;
        }

        .chat-icon {
          width: 34px;
          height: 34px;
          transition: transform 0.3s ease;
        }

        /* Continuous subtle pulse animation on buttons */
        .chat-btn::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          top: 0;
          left: 0;
          z-index: -1;
          box-shadow: 0 0 0 0 rgba(0, 104, 255, 0.4);
          transition: opacity 0.3s ease;
        }

        .messenger-btn::after {
          box-shadow: 0 0 0 0 rgba(166, 44, 255, 0.4);
        }

        /* Set infinite pulse triggers */
        .zalo-btn {
          animation: floatIn 0.8s ease-out both, zaloPulse 2s infinite;
          animation-delay: 0.4s, 1s;
        }

        .messenger-btn {
          animation: floatIn 0.8s ease-out both, messengerPulse 2s infinite;
          animation-delay: 0.2s, 1.5s;
        }

        /* Hover effects */
        .chat-btn:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .chat-btn:hover .chat-icon {
          transform: scale(1.05);
        }

        /* Tooltips appearing on the left */
        .chat-tooltip {
          position: absolute;
          right: 70px;
          background-color: var(--secondary-color, #1a1a1a);
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transform: translateX(10px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Tooltip arrow */
        .chat-tooltip::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -5px;
          transform: translateY(-50%);
          border-width: 5px 0 5px 5px;
          border-style: solid;
          border-color: transparent transparent transparent var(--secondary-color, #1a1a1a);
        }

        .chat-btn:hover .chat-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }

        /* Entrance and Pulse Animations */
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes zaloPulse {
          0% {
            box-shadow: 0 4px 16px rgba(0, 104, 255, 0.2), 0 0 0 0 rgba(0, 104, 255, 0.4);
          }
          70% {
            box-shadow: 0 4px 16px rgba(0, 104, 255, 0.2), 0 0 0 10px rgba(0, 104, 255, 0);
          }
          100% {
            box-shadow: 0 4px 16px rgba(0, 104, 255, 0.2), 0 0 0 0 rgba(0, 104, 255, 0);
          }
        }

        @keyframes messengerPulse {
          0% {
            box-shadow: 0 4px 16px rgba(166, 44, 255, 0.2), 0 0 0 0 rgba(166, 44, 255, 0.4);
          }
          70% {
            box-shadow: 0 4px 16px rgba(166, 44, 255, 0.2), 0 0 0 10px rgba(166, 44, 255, 0);
          }
          100% {
            box-shadow: 0 4px 16px rgba(166, 44, 255, 0.2), 0 0 0 0 rgba(166, 44, 255, 0);
          }
        }
      `}</style>
    </>
  );
}

export default ChatWidget;
