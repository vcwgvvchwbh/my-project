const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// ذخیره پیام‌ها در حافظه
const messages = [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('کاربر متصل شد');

  // ارسال پیام‌های قبلی به کاربر جدید
  socket.emit('previousMessages', messages);

  // دریافت نام کاربری از کلاینت
  socket.on('setUsername', (username) => {
    socket.username = username;
  });

  // دریافت پیام از کاربر
  socket.on('sendMessage', (message) => {
    const msg = {
      username: socket.username || 'کاربر ناشناس',
      message: message,
    };
    messages.push(msg);
    // ارسال پیام به سایر کاربران
    socket.broadcast.emit('newMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('کاربر قطع اتصال کرد');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`سرور در حال اجرا بر روی پورت ${PORT}`);
});
