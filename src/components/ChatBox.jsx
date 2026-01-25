import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "https://haritha-karma-sena-backend.onrender.com";

function ChatBox({ disposerId, collectorId, userRole }) {
  const socketRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const roomId =
    disposerId && collectorId ? `${disposerId}_${collectorId}` : null;

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
    <div style={styles.wrapper}>
      {/* 💬 CHAT BUTTON (ALWAYS VISIBLE) */}
      <button style={styles.chatButton} onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* ❌ No collector assigned */}
      {open && !roomId && (
        <div style={styles.disabledBox}>
          Collector not assigned yet
        </div>
      )}

      {/* ✅ CHAT BOX */}
      {open && roomId && (
        <div style={styles.chatBox}>
          <div style={styles.header}>Chat</div>

          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.sender === userRole ? "flex-end" : "flex-start",
                }}
              >
                <b>{msg.sender}</b>
                <div>{msg.message}</div>
                <small>{msg.time}</small>
              </div>
            ))}
          </div>

          <div style={styles.inputArea}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
  },
  chatButton: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    fontSize: "22px",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
  },
  disabledBox: {
    marginTop: "10px",
    padding: "10px",
    background: "#fff3cd",
    borderRadius: "6px",
    fontSize: "14px",
  },
  chatBox: {
    width: "300px",
    height: "380px",
    background: "#fff",
    borderRadius: "10px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
  },
  header: {
    padding: "10px",
    background: "#2e7d32",
    color: "#fff",
    textAlign: "center",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    overflowY: "auto",
  },
  message: {
    padding: "6px",
    background: "#eee",
    borderRadius: "6px",
    maxWidth: "75%",
    fontSize: "13px",
  },
  inputArea: {
    display: "flex",
    padding: "6px",
  },
  input: {
    flex: 1,
    padding: "6px",
  },
  sendBtn: {
    marginLeft: "5px",
    padding: "6px 10px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
};

export default ChatBox;
