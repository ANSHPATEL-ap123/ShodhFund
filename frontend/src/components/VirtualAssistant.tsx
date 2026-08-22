"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Minimize2,
  Trash2,
  ArrowRight,
  Bot,
  User,
  Loader2,
} from "lucide-react";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const suggestions = [
  "What is ShodhFund?",
  "How does GFR compliance work?",
  "How does AI process bills?",
  "How does UC generation work?",
];

const getPageContext = () => {
  if (typeof window === "undefined") return "website";

  const path = window.location.pathname;

  if (path === "/") return "landing page";
  if (path.includes("login")) return "login page";
  if (path.includes("select-role")) return "role selection page";
  if (path.includes("grant")) return "grant management";
  if (path.includes("expense") || path.includes("bill"))
    return "expense and bill management";
  if (path.includes("compliance")) return "GFR compliance";
  if (path.includes("uc")) return "Utilization Certificate generation";
  if (path.includes("analytics")) return "research analytics";
  if (path.includes("dashboard")) return "dashboard";

  return "website";
};

export default function VirtualAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm the ShodhFund Virtual Assistant. I can help you understand grants, expenses, GFR compliance, bills, UCs and the platform.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const message = (text ?? input).trim();

    if (!message || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          page: getPageContext(),
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            data.reply ||
            "I couldn't process that request. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Something went wrong while connecting to the assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content:
          "Chat cleared. How can I help you with ShodhFund?",
      },
    ]);
  };

  return (
    <>
      {/* FLOATING BUTTON */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open ShodhFund Virtual Assistant"
          className="assistant-launcher"
        >
          <span className="assistant-pulse" />

          <div className="assistant-launcher-icon">
            <Sparkles />
          </div>

          <div className="assistant-launcher-text">
            <span>ShodhFund AI</span>
            <small>Virtual Assistant</small>
          </div>
        </button>
      )}

      {/* CHAT WINDOW */}

      {open && !minimized && (
        <div className="assistant-window">

          {/* HEADER */}

          <div className="assistant-header">

            <div className="assistant-title">

              <div className="assistant-avatar">
                <Sparkles />
              </div>

              <div>
                <div className="assistant-name">
                  ShodhFund AI
                </div>

                <div className="assistant-online">
                  <span />
                  Online · Virtual Assistant
                </div>
              </div>

            </div>

            <div className="assistant-header-actions">

              <button
                onClick={clearChat}
                title="Clear chat"
              >
                <Trash2 />
              </button>

              <button
                onClick={() => setMinimized(true)}
                title="Minimize"
              >
                <Minimize2 />
              </button>

              <button
                onClick={() => setOpen(false)}
                title="Close"
              >
                <X />
              </button>

            </div>

          </div>

          {/* CHAT BODY */}

          <div className="assistant-body">

            <div className="assistant-context">
              <Sparkles />
              <span>
                You're currently on the{" "}
                <strong>{getPageContext()}</strong>.
              </span>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`assistant-message-row ${
                  message.role === "user"
                    ? "user-message"
                    : ""
                }`}
              >

                {message.role === "assistant" && (
                  <div className="message-avatar">
                    <Bot />
                  </div>
                )}

                <div
                  className={`assistant-message ${
                    message.role === "user"
                      ? "assistant-message-user"
                      : "assistant-message-ai"
                  }`}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <div className="message-avatar user-avatar">
                    <User />
                  </div>
                )}

              </div>
            ))}

            {loading && (
              <div className="assistant-message-row">

                <div className="message-avatar">
                  <Bot />
                </div>

                <div className="assistant-message assistant-message-ai typing">
                  <span />
                  <span />
                  <span />
                </div>

              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="assistant-suggestions">

                <div className="suggestion-label">
                  Try asking
                </div>

                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="suggestion-button"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight />
                  </button>
                ))}

              </div>
            )}

            <div ref={bottomRef} />

          </div>

          {/* INPUT */}

          <div className="assistant-input-area">

            <div className="assistant-input">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask anything about ShodhFund..."
                disabled={loading}
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="assistant-send"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Send />
                )}
              </button>

            </div>

            <div className="assistant-disclaimer">
              AI-generated responses may need verification.
            </div>

          </div>

        </div>
      )}

      {/* MINIMIZED STATE */}

      {open && minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="assistant-minimized"
        >
          <div className="assistant-avatar">
            <Sparkles />
          </div>

          <div>
            <strong>ShodhFund AI</strong>
            <small>Continue conversation</small>
          </div>

          <ArrowRight />
        </button>
      )}

      <style jsx global>{`

        /* =============================================
           LAUNCHER
        ============================================= */

        .assistant-launcher {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;

          display: flex;
          align-items: center;
          gap: 11px;

          height: 58px;
          padding: 6px 15px 6px 7px;

          border-radius: 18px;

          background: #071A2B;
          color: white;

          border: 1px solid rgba(255,255,255,.12);

          box-shadow:
            0 20px 50px rgba(7,26,43,.25),
            0 5px 15px rgba(7,26,43,.12);

          cursor: pointer;

          transition:
            transform .3s cubic-bezier(.2,.8,.2,1),
            box-shadow .3s ease;
        }

        .assistant-launcher:hover {
          transform: translateY(-5px);
          box-shadow:
            0 25px 60px rgba(7,26,43,.32);
        }

        .assistant-pulse {
          position: absolute;
          left: 17px;
          top: 14px;

          width: 36px;
          height: 36px;

          border-radius: 50%;

          background: #C8F135;

          opacity: .15;

          animation: assistant-pulse 2.5s infinite;
        }

        .assistant-launcher-icon {
          position: relative;

          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background: #C8F135;
          color: #071A2B;
        }

        .assistant-launcher-icon svg {
          width: 19px;
          height: 19px;
        }

        .assistant-launcher-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .assistant-launcher-text span {
          font-size: 12px;
          font-weight: 700;
        }

        .assistant-launcher-text small {
          font-size: 9px;
          color: rgba(255,255,255,.45);
        }

        /* =============================================
           WINDOW
        ============================================= */

        .assistant-window {
          position: fixed;
          right: 24px;
          bottom: 24px;

          z-index: 9999;

          width: min(405px, calc(100vw - 32px));
          height: min(650px, calc(100vh - 48px));

          display: flex;
          flex-direction: column;

          overflow: hidden;

          border-radius: 24px;

          background: rgba(248,250,249,.97);

          border: 1px solid #DCE5E1;

          box-shadow:
            0 35px 100px rgba(7,26,43,.22),
            0 10px 30px rgba(7,26,43,.1);

          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);

          animation:
            assistant-open .4s
            cubic-bezier(.2,.8,.2,1)
            both;
        }

        /* =============================================
           HEADER
        ============================================= */

        .assistant-header {
          flex-shrink: 0;

          height: 76px;

          padding: 0 17px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: #071A2B;
          color: white;

          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .assistant-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .assistant-avatar {
          width: 39px;
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #C8F135;
          color: #071A2B;

          flex-shrink: 0;
        }

        .assistant-avatar svg {
          width: 17px;
          height: 17px;
        }

        .assistant-name {
          font-size: 13px;
          font-weight: 700;
        }

        .assistant-online {
          margin-top: 3px;

          display: flex;
          align-items: center;
          gap: 5px;

          font-size: 9px;
          color: rgba(255,255,255,.42);
        }

        .assistant-online span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #C8F135;

          box-shadow: 0 0 8px #C8F135;
        }

        .assistant-header-actions {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .assistant-header-actions button {
          width: 30px;
          height: 30px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          background: transparent;

          border-radius: 8px;

          color: rgba(255,255,255,.45);

          cursor: pointer;

          transition:
            background .2s ease,
            color .2s ease;
        }

        .assistant-header-actions button:hover {
          background: rgba(255,255,255,.08);
          color: white;
        }

        .assistant-header-actions svg {
          width: 14px;
          height: 14px;
        }

        /* =============================================
           BODY
        ============================================= */

        .assistant-body {
          flex: 1;

          overflow-y: auto;

          padding: 17px;

          scrollbar-width: thin;
          scrollbar-color: #CCD7D2 transparent;
        }

        .assistant-context {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 9px 11px;

          border-radius: 10px;

          background: #EEF4F1;

          color: #74817B;

          font-size: 9px;

          margin-bottom: 17px;
        }

        .assistant-context svg {
          width: 12px;
          height: 12px;

          color: #7C9708;
        }

        .assistant-context strong {
          color: #45534D;
        }

        .assistant-message-row {
          display: flex;
          align-items: flex-end;
          gap: 7px;

          margin-bottom: 13px;

          animation:
            message-in .35s
            cubic-bezier(.2,.8,.2,1)
            both;
        }

        .assistant-message-row.user-message {
          justify-content: flex-end;
        }

        .message-avatar {
          width: 25px;
          height: 25px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background: #E9F2D1;
          color: #668000;
        }

        .message-avatar svg {
          width: 12px;
          height: 12px;
        }

        .user-avatar {
          background: #071A2B;
          color: white;
        }

        .assistant-message {
          max-width: 78%;

          padding: 10px 12px;

          border-radius: 13px;

          font-size: 12px;
          line-height: 1.65;
        }

        .assistant-message-ai {
          background: white;
          border: 1px solid #E0E7E4;
          color: #46545F;
          border-bottom-left-radius: 4px;
        }

        .assistant-message-user {
          background: #071A2B;
          color: white;
          border-bottom-right-radius: 4px;
        }

        /* =============================================
           TYPING
        ============================================= */

        .typing {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 38px;
        }

        .typing span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #9EAAA5;

          animation:
            typing 1.2s
            infinite ease-in-out;
        }

        .typing span:nth-child(2) {
          animation-delay: .15s;
        }

        .typing span:nth-child(3) {
          animation-delay: .3s;
        }

        /* =============================================
           SUGGESTIONS
        ============================================= */

        .assistant-suggestions {
          margin-top: 22px;
        }

        .suggestion-label {
          margin-bottom: 8px;

          font-size: 9px;
          font-weight: 700;

          text-transform: uppercase;
          letter-spacing: .15em;

          color: #9AA5A0;
        }

        .suggestion-button {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 10px 12px;

          margin-bottom: 6px;

          border: 1px solid #E0E7E4;

          border-radius: 10px;

          background: white;

          color: #4D5B65;

          font-size: 10px;

          cursor: pointer;

          text-align: left;

          transition:
            transform .2s ease,
            border-color .2s ease,
            background .2s ease;
        }

        .suggestion-button:hover {
          transform: translateX(3px);
          border-color: #C9D5CF;
          background: #FBFCFB;
        }

        .suggestion-button svg {
          width: 12px;
          height: 12px;

          color: #91A000;
        }

        /* =============================================
           INPUT
        ============================================= */

        .assistant-input-area {
          flex-shrink: 0;

          padding: 12px 14px 14px;

          border-top: 1px solid #E1E8E5;

          background: rgba(255,255,255,.75);
        }

        .assistant-input {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 5px;

          border-radius: 13px;

          background: white;

          border: 1px solid #D9E2DE;

          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .assistant-input:focus-within {
          border-color: #B9C8C1;

          box-shadow:
            0 0 0 3px rgba(200,241,53,.08);
        }

        .assistant-input input {
          flex: 1;

          min-width: 0;

          height: 37px;

          padding: 0 9px;

          border: 0;
          outline: 0;

          background: transparent;

          color: #071A2B;

          font-size: 11px;
        }

        .assistant-input input::placeholder {
          color: #A1AAA7;
        }

        .assistant-send {
          width: 36px;
          height: 36px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;

          border-radius: 9px;

          background: #C8F135;
          color: #071A2B;

          cursor: pointer;

          transition:
            transform .2s ease,
            opacity .2s ease;
        }

        .assistant-send:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .assistant-send:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .assistant-send svg {
          width: 14px;
          height: 14px;
        }

        .assistant-disclaimer {
          margin-top: 7px;

          text-align: center;

          font-size: 8px;

          color: #A2ACA7;
        }

        /* =============================================
           MINIMIZED
        ============================================= */

        .assistant-minimized {
          position: fixed;

          right: 24px;
          bottom: 24px;

          z-index: 9999;

          display: flex;
          align-items: center;
          gap: 9px;

          padding: 8px 13px 8px 8px;

          border: 1px solid #DCE5E1;

          border-radius: 15px;

          background: white;

          box-shadow:
            0 20px 50px rgba(7,26,43,.15);

          cursor: pointer;

          animation: assistant-open .3s ease both;
        }

        .assistant-minimized .assistant-avatar {
          width: 35px;
          height: 35px;
        }

        .assistant-minimized div:nth-child(2) {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .assistant-minimized strong {
          font-size: 11px;
          color: #071A2B;
        }

        .assistant-minimized small {
          margin-top: 2px;
          font-size: 8px;
          color: #8A9690;
        }

        .assistant-minimized > svg {
          width: 13px;
          height: 13px;
          color: #8A990A;
        }

        /* =============================================
           ANIMATIONS
        ============================================= */

        @keyframes assistant-open {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(.95);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: .4;
          }

          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        @keyframes assistant-pulse {
          0% {
            transform: scale(.7);
            opacity: .25;
          }

          70% {
            transform: scale(1.6);
            opacity: 0;
          }

          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @media (max-width: 600px) {

          .assistant-launcher {
            right: 15px;
            bottom: 15px;
          }

          .assistant-launcher-text {
            display: none;
          }

          .assistant-launcher {
            width: 54px;
            height: 54px;
            padding: 5px;
            justify-content: center;
            border-radius: 17px;
          }

          .assistant-window {
            right: 8px;
            bottom: 8px;

            width: calc(100vw - 16px);
            height: calc(100vh - 16px);

            border-radius: 20px;
          }

          .assistant-minimized {
            right: 15px;
            bottom: 15px;
          }
        }

      `}</style>
    </>
  );
}