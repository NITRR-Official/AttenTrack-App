const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

let currentOTP = null;
let progressData = { time: 0, progress: 0 };

app.get('/', (req, res) => {
  res.send('Server is running...')
});

// SSE route for sending progress updates to students
app.get('/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send progress data every second
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
  }, 1000);
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// WebSocket for OTP communication
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'otp_verification') {
      if (data.otp === currentOTP) {
        // If OTP matches, send success message to the student and broadcast to teacher
        ws.send(JSON.stringify({ type: 'verification_result', status: 'success' }));

        // Broadcast attendance update to all clients (including teacher)
        const rollNumber = '21116008';  // Example roll number
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'attendance_update', rollNumber }));
          }
        });

        console.log('OTP verified successfully, roll number 21116008 marked as present.');
      } else {
        ws.send(JSON.stringify({ type: 'verification_result', status: 'failure' }));
        console.log('OTP verification failed.');
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


// Endpoint for teacher to set OTP and time
app.post('/setAttendance', (req, res) => {
  const { otp, time } = req.body;
  currentOTP = otp;
  progressData = { time, progress: 0 };  // Reset the progress for students
  res.send('OTP and time set');
  
  // Simulate progress countdown
  let progressInterval = setInterval(() => {
    if (progressData.progress < 1) {
      progressData.progress += 1 / time;
    } else {
      clearInterval(progressInterval);
    }
  }, 1000);
});

server.listen(3000,"192.168.1.175", () => {
  console.log('Server started on port 3000');
});
