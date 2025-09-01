# 🎙️ Voice Notes with AI Summarization  

A **MERN + GenAI application** that allows users to record voice notes, automatically transcribe them using **OpenAI Whisper**, and generate **AI-powered summaries** with **GPT-3.5**.  
Users can manage their notes with full **CRUD operations**, search, and sort for easy organization.  

---

## 🚀 Tech Stack  

### Frontend  
- ⚡ **Vite + React (JavaScript)**  
- 🎨 **TailwindCSS** for styling  
- 🌐 **Axios** for API calls  
- 🎙️ **MediaRecorder API** for real-time recording  

### Backend  
- 🟢 **Node.js + Express.js**  
- 🍃 **MongoDB Atlas + Mongoose**  
- 🔑 **JWT Authentication** (1-day expiry)  
- 🔒 **bcrypt** for password hashing  
- 🤖 **OpenAI Whisper API** → Speech-to-text  
- 🤖 **OpenAI GPT-3.5** → Summarization  

---

## ✨ Features  
- 🔐 **User Authentication** → Signup & Login with JWT  
- 🎙️ **Voice Recording** → Record notes directly from browser  
- 📝 **Automatic Transcription** → Whisper converts speech to text  
- 🖊️ **CRUD Notes** → Create, edit, delete, and view notes  
- 🤖 **AI Summarization** → Generate short summaries of notes  
- 🔍 **Search & Sort** → Full-text search & sort by date  
- ⚡ **Responsive UI** → Tailwind-powered modern interface  
- 🔔 **User Feedback** → Toasts & spinners for async actions  

---

## 📂 Folder Structure  

### Backend 
```
/backend
  /src
    /config
      db.js              # MongoDB connection
    /models
      User.js            # User schema
      Note.js            # Note schema
    /routes
      authRoutes.js      # Auth routes (signup, login)
      noteRoutes.js      # Notes CRUD routes
      aiRoutes.js        # Transcription + summarization routes
    /middleware
      authMiddleware.js  # JWT auth verification
    server.js            # Express app entry point
  package.json
  .env
```
### Frontend
```
/frontend
  /src
    /components
      Recorder.jsx       # Handles audio recording & upload
      NoteCard.jsx       # Displays each note with actions
      Toast.jsx          # Notification system
      LoadingSpinner.jsx # Loader for async ops
    /pages
      Login.jsx          # Login page
      Signup.jsx         # Signup page
      Dashboard.jsx      # Main notes dashboard
    /context
      AuthContext.jsx    # Auth state & provider
    /api
      axiosConfig.js     # Axios instance with interceptors
    App.jsx              # Routing only
    main.jsx             # App entry point
  package.json
  tailwind.config.js
  vite.config.js
```


---
## 🔑 Environment Variables  

### Backend
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```
### Frontend
```
VITE_API_URL=your_backend_api
```
## 📡 API Documentation

### Auth Routes
- **POST** `/api/auth/signup` → Register user
```
{
  "username": "pooja",
  "email": "pooja@example.com",
  "password": "securepassword"
}
```
- **POST** `/api/auth/login` → Login
```
{
  "email": "pooja@example.com",
  "password": "securepassword"
}
```

### Notes Routes (JWT Protected)
- **POST** `/api/notes` → Create note
```
{
  "title": "Meeting notes",
  "content": "Transcribed text here..."
}
```
- **GET** `/api/notes` → Get all notes (supports ?search=query&sort=date)
- **PUT** `/api/notes/:id` → Update note
- **DELETE** `/api/notes/:id` → Delete note

### AI Routes (JWT Protected)
- **POST** `/api/ai/transcribe` → Upload audio → Get transcription
- **POST** `/api/ai/summarize` → Summarize note
```
{
  "noteId": "64h2a9f...",
  "content": "Full text of note here..."
}
```
<!-- ## 🔗 Deployed Link
[Backend](https://voice-notes-ai-0bsk.onrender.com)
[Frontend](https://placeholder.com) -->

## 🛠️ Setup & Run Locally
#### Clone repo
```
git clone https://github.com/create-source1/realty-ai-assignment.git
```
### Backend
```
cd backend
npm install
npm start
```
### Frontend
```
cd frontend
npm install
npm run dev
```
---
**Built with ❤️ by POOJA JAISWAL 👩‍💻**