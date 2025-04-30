document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const messagesList = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const changeNameButton = document.getElementById("changeNameButton");

  // دریافت یا تنظیم نام کاربری
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("لطفاً نام کاربری خود را وارد کنید:");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      username = "کاربر ناشناس";
    }
  }
  socket.emit("setUsername", username);

  // ارسال پیام به سرور
  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit("sendMessage", message);
      addMessage({ username, message });
      messageInput.value = "";
    }
  });

  // دریافت پیام‌های قبلی از سرور
  socket.on("previousMessages", (messages) => {
    messagesList.innerHTML = "";
    messages.forEach((msg) => {
      addMessage(msg);
    });
  });

  // دریافت پیام جدید از سرور
  socket.on("newMessage", (msg) => {
    addMessage(msg);
  });

  // افزودن پیام به لیست
  function addMessage(msg) {
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");
    if (msg.username === username) {
      messageElement.classList.add("self");
    } else {
      messageElement.classList.add("other");
    }
    messageElement.textContent = `${msg.username}: ${msg.message}`;
    messagesList.appendChild(messageElement);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  // تغییر نام کاربری
  changeNameButton.addEventListener("click", () => {
    const newUsername = prompt("لطفاً نام کاربری جدید را وارد کنید:", username);
    if (newUsername && newUsername !== username) {
      username = newUsername;
      localStorage.setItem("username", username);
      socket.emit("setUsername", username);
      alert("نام کاربری با موفقیت تغییر یافت.");
    }
  });
});
