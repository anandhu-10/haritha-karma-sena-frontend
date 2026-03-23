import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { FaMessage, FaPaperPlane, FaXmark, FaUser } from "react-icons/fa6";
import "../styles/ChatBox.css";

const SOCKET_URL = (process.env.REACT_APP_API_URL || "https://haritha-karma-sena-backend.onrender.com");

function ChatBox({ disposerId, collectorId, userRole, activeRequests = [] }) {
  const socketRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedReqId, setSelectedReqId] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef(null);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
    if (open) setUnreadCount(0);
  }, [open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  /* ---------- DERIVE TARGET DISPOSER ---------- */
  useEffect(() => {
    if (userRole === "collector" && activeRequests.length > 0 && !selectedReqId) {
      setSelectedReqId(activeRequests[0]._id);
    }
  }, [activeRequests, userRole, selectedReqId]);

  const currentSelection = userRole === "collector" 
    ? activeRequests.find(r => r._id === selectedReqId) 
    : null;

  const targetDisposerId = userRole === "collector" 
    ? (currentSelection?.disposerId?._id || currentSelection?.disposerId)
    : disposerId;

  const safeDisposerId =
    typeof targetDisposerId === "object"
      ? targetDisposerId?._id || targetDisposerId?.$oid
      : targetDisposerId;

  const safeCollectorId =
    typeof collectorId === "object"
      ? collectorId?._id || collectorId?.$oid
      : collectorId;

  const roomId =
    safeDisposerId && safeCollectorId
      ? `${safeDisposerId}_${safeCollectorId}`
      : null;

  /* ---------- FETCH HISTORY ---------- */
  useEffect(() => {
    const fetchHistory = async () => {
      if (!roomId || !open) return;
      try {
        const res = await fetch(`${SOCKET_URL}/api/messages/${roomId}`);
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchHistory();
  }, [roomId, open]);

  useEffect(() => {
    if (!roomId) return;
    console.log("🔌 CONNECTING TO ROOM:", roomId);

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("join_room", roomId);

    socketRef.current.on("receive_message", (data) => {
      console.log("📩 NEW MESSAGE ARRIVED:", data);
      setMessages((prev) => [...prev, data]);
      if (!openRef.current) {
        console.log("🟠 INCREMENTING UNREAD COUNT");
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

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
        {!open && unreadCount > 0 && (
          <span className="chat-notification-badge">{unreadCount}</span>
        )}
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
              <div className="header-avatar" onClick={() => userRole === "collector" && setShowUserList(!showUserList)}>
                <FaUser size={14} />
              </div>
              <div className="header-text" onClick={() => userRole === "collector" && setShowUserList(!showUserList)}>
                {userRole === "collector" && activeRequests.length > 1 ? (
                  <div className="chat-switcher-container">
                    <span className="current-chat-name">
                      {currentSelection?.disposerName || "Select Disposer"}
                    </span>
                    {showUserList && (
                      <div className="user-dropdown-list">
                        {activeRequests.map(req => (
                          <div 
                            key={req._id} 
                            className={`user-option ${selectedReqId === req._id ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedReqId(req._id);
                              setShowUserList(false);
                            }}
                          >
                            {req.disposerName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <h3>
                    {userRole === "collector" 
                      ? (currentSelection?.disposerName || "Disposer Connection")
                      : "Collector Support"}
                  </h3>
                )}
                <small className="online-status">Online</small>
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

export default ChatBox;