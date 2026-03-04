import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { FaMessage, FaPaperPlane, FaXmark, FaUser } from "react-icons/fa6";
import "../styles/ChatBox.css";

const SOCKET_URL = "https://haritha-karma-sena-backend.onrender.com";

function ChatBox({ disposerId, collectorId, userRole }) {
  const socketRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔥 Ensure IDs are always strings
  const safeDisposerId =
    typeof disposerId === "object"
      ? disposerId?._id || disposerId?.$oid
      : disposerId;

  const safeCollectorId =
    typeof collectorId === "object"
      ? collectorId?._id || collectorId?.$oid
      : collectorId;

  const roomId =
    safeDisposerId && safeCollectorId
      ? `${safeDisposerId}_${safeCollectorId}`
      : null;

  useEffect(() => {
    if (!open || !roomId) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("join_room", roomId);

    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [open, roomId]);

  const sendMessage = () => {
    if (!message.trim() || !roomId) return;

    const msgData = {
      roomId,
      sender: userRole,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socketRef.current.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="chat-wrapper">
      {/* 💬 CHAT TOGGLE BUTTON */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? <FaXmark size={22} /> : <FaMessage size={22} />}
      </button>

      {/* ❌ No collector assigned or no disposer active */}
      {open && !roomId && (
        <div className="chat-disabled-notice">
          {userRole === "collector"
            ? "No active chat instance. Once a request is accepted, chat will move here."
            : "Collector not assigned. You'll be able to chat once a collector accepts your request."}
        </div>
      )}

      {/* ✅ CHAT WINDOW */}
      {open && roomId && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="header-avatar">
                <FaUser size={14} />
              </div>
              <div className="header-text">
                <h3>{userRole === "collector" ? "Disposer Connection" : "Collector Support"}</h3>
                <small style={{ color: "rgba(255,255,255,0.7)" }}>Online</small>
              </div>
            </div>
            <button className="close-chat" onClick={() => setOpen(false)}>
              <FaXmark size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "40%", color: "#94a3b8" }}>
                <FaMessage size={40} style={{ opacity: 0.1, marginBottom: "10px" }} />
                <p style={{ fontSize: "14px" }}>Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${msg.sender === userRole ? "mine" : "other"}`}
                >
                  <div className="msg-text">{msg.message}</div>
                  <span className="message-time">{msg.time}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button className="send-message-btn" onClick={sendMessage}>
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Clean up old styles object
const styles = {};

export default ChatBox;