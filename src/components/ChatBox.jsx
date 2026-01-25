import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://haritha-karma-sena-backend.onrender.com");

function ChatBox({ disposerId, collectorId, userRole }) {
  const roomId = `${disposerId}_${collectorId}`;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      roomId,
      sender: userRole, // "disposer" or "collector"
      message,
      time: new Date().toLocaleTimeString()
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div style={styles.chatBox}>
      <div style={styles.header}>Chat</div>

      <div style={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === userRole ? "flex-end" : "flex-start",
              background: msg.sender === userRole ? "#d1f7c4" : "#eee"
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
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatBox: {
    width: "300px",
    height: "400px",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px"
  },
  header: {
    padding: "10px",
    background: "#2e7d32",
    color: "#fff",
    textAlign: "center"
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto"
  },
  message: {
    padding: "8px",
    borderRadius: "8px",
    maxWidth: "75%"
  },
  inputArea: {
    display: "flex",
    padding: "5px"
  },
  input: {
    flex: 1,
    padding: "6px"
  },
  button: {
    marginLeft: "5px",
    padding: "6px 10px"
  }
};

export default ChatBox;
