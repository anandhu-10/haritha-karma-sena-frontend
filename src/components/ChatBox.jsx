import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "https://haritha-karma-sena-backend.onrender.com";

function ChatBox({ disposerId, collectorId, userRole }) {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const roomId =
    disposerId && collectorId ? `${disposerId}_${collectorId}` : null;

  useEffect(() => {
    if (!roomId) return;

    // 🔌 Create socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    // 🟢 Join room
    socketRef.current.emit("join_room", roomId);

    // 📩 Receive message
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // 🔴 Cleanup on unmount
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

  // 🚫 Hide chat if no collector assigned
  if (!roomId) return null;

  return (
    <div style={styles.wrapper}>
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
                background:
                  msg.sender === userRole ? "#d1f7c4" : "#eee",
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
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  wrapper: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
  },
  chatBox: {
    width: "300px",
    height: "400px",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    background: "#fff",
  },
  header: {
    padding: "10px",
    background: "#2e7d32",
    color: "#fff",
    textAlign: "center",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
  },
  message: {
    padding: "8px",
    borderRadius: "8px",
    maxWidth: "75%",
    fontSize: "14px",
  },
  inputArea: {
    display: "flex",
    padding: "6px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "6px",
    fontSize: "14px",
  },
  button: {
    marginLeft: "5px",
    padding: "6px 12px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ChatBox;
