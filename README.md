# 🗳️ Quick Poll Maker

A modern, full-stack quiz-style polling application built with the MERN stack (MongoDB, Express, React, Node.js). Create interactive polls with single correct answers, get instant feedback, and track participation through an intuitive dashboard.

<p>
  <img src="https://skillicons.dev/icons?i=react,nodejs,expressjs,mongodb,vite,tailwind,javascript,css,html," />
</p>

## ✨ Features

### 🎯 Core Features
- **Quiz-Style Polls**: Create polls with single correct answers (not opinion polls)
- **Instant Feedback**: Green/red highlighting immediately after voting
- **One Vote Per User**: Prevents duplicate voting
- **Auto Expiry**: Polls automatically expire after 72 hours
- **Shareable Links**: Unique URLs for each poll with copy functionality
- **Answer Explanations**: Detailed explanations for correct answers
- **Vote Tracking**: Visual indicator for polls you've already voted on

### 👤 User Features
- **Secure Authentication**: JWT-based registration and login
- **User Dashboard**: Track created polls and voting history
- **Poll Management**: Edit/delete your polls before expiry
- **Vote History**: Review your attempts and see correct/incorrect answers

### 🎨 UI/UX Features
- **Modern Dark Theme**: Professional zinc color scheme with emerald accents
- **Grainy Background**: Subtle noise texture for premium feel
- **Responsive Design**: Fully mobile-responsive interface
- **Real-time Updates**: Instant visual feedback and vote counts
- **Masonry Layout**: Efficient poll card arrangement on home page
- **Smooth Animations**: Transitions and interactive elements

## 🏗️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling with custom dark theme
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Context API** - State management

### **Backend**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Node Cron** - Background job scheduler

## 📁 Project Structure

```
quick-poll-maker/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utilities & scheduler
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       │   ├── layout/  # Layout components
│       │   ├── polls/   # Poll-related components
│       │   └── ui/      # Reusable UI components
│       ├── context/     # React context providers
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Helper functions
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/quick-poll-maker.git
cd quick-poll-maker
```

2. **Set up the Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quick-poll
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

3. **Set up the Frontend**
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

2. **Start the Backend Server**
```bash
cd backend
npm run dev
```

3. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Poll Creators
1. **Register/Login** to your account
2. **Create a Poll** with a question, 2-6 options, and mark the correct answer
3. **Add Tags & Explanation** (optional) to help users understand
4. **Share the Poll** using the unique link
5. **Track Results** in your dashboard with real-time stats

### For Participants
1. **Browse Polls** on the home page
2. **Vote on Polls** (login required)
3. **Get Instant Feedback** with correct/incorrect highlighting
4. **Read Explanations** to learn why answers are correct
5. **Track Your Progress** in your dashboard

## 🗂️ Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Poll Schema
```javascript
{
  question: String,
  options: Array[{ text: String, voteCount: Number }],
  correctOptionIndex: Number,
  explanationNote: String,
  tags: Array[String],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  expiresAt: Date (createdAt + 72 hours),
  shareId: String (unique),
  isActive: Boolean
}
```

### Vote Schema
```javascript
{
  userId: ObjectId (ref: User),
  pollId: ObjectId (ref: Poll),
  selectedOptionIndex: Number,
  isCorrect: Boolean,
  votedAt: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Polls
- `GET /api/polls` - Get all active polls
- `GET /api/polls/:id` - Get single poll
- `POST /api/polls` - Create new poll
- `DELETE /api/polls/:id` - Delete poll
- `GET /api/polls/me/created` - Get user's created polls
- `GET /api/polls/me/voted` - Get user's voted polls

### Votes
- `POST /api/votes/:id/vote` - Submit vote

## 🎨 UI Components

### PollCard
Displays poll preview on home page with:
- Poll question and options
- Vote statistics and progress bars
- Expiry timer and status
- "Voted" indicator for user participation
- Share functionality

### PollVote
Interactive voting interface with:
- Real-time option selection
- Instant correctness feedback
- Results display with percentages
- Explanation access

### ExplanationPage
Dedicated page showing:
- Poll question and correct answer
- Detailed explanation from creator
- Vote distribution and statistics

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt for password security
- **Protected Routes** - Both frontend and backend
- **Input Validation** - Server-side validation
- **Vote Prevention** - One vote per user per poll
- **Poll Ownership** - Only creators can edit/delete

## ⏱️ Auto Expiry System

- Polls expire exactly 72 hours after creation
- Background cron job runs hourly to clean up expired polls
- Expired polls are removed from database (polls and votes)
- Users see "Expired" status on completed polls

## 📱 Responsive Design

The application is fully responsive across all devices:
- **Mobile** (320px+): Single column, touch-friendly
- **Tablet** (768px+): Two column grid
- **Desktop** (1024px+): Three column masonry layout
- **Large Desktop** (1280px+): Four column layout

## 🎯 Key Features in Detail

### Instant Feedback System
After voting, users immediately see:
- ✅ Green highlight for correct answers
- ❌ Red highlight for incorrect selections
- Correct answer always revealed
- Disabled options to prevent re-voting

### Share Functionality
- Unique 8-character shareId for each poll
- Copy link button with visual feedback
- Shareable on WhatsApp, LinkedIn, etc.
- Public access via direct links

### Dashboard Analytics
Users can track:
- Polls created and their status
- Voting accuracy (correct/wrong ratio)
- Total participation metrics
- Time remaining on active polls

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login to Heroku
heroku login

# Create new app
heroku create quick-poll-backend

# Add MongoDB addon
heroku addons:create mongolab

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
1. Build the project:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod --version`
   - Check connection string in `.env` file
   - Restart MongoDB service

2. **CORS Errors**
   - Ensure backend CORS is configured
   - Check frontend API URL in `.env`
   - Verify ports are correct (5000 for backend, 3000 for frontend)

3. **JWT Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret in backend `.env`
   - Ensure token is being sent in headers

4. **Poll Not Displaying Correctly**
   - Check console for errors
   - Verify API response structure
   - Ensure poll data is valid

## 📈 Future Enhancements

### Planned Features
- **Real-time Updates**: Live vote counting with WebSockets
- **Advanced Analytics**: Detailed insights and charts
- **Poll Categories**: Organized browsing by subjects
- **Leaderboards**: Top voters and poll creators
- **Poll Templates**: Quick creation from templates
- **Social Features**: Follow creators, like polls
- **Mobile App**: React Native application

### Technical Improvements
- **Testing Suite**: Jest for frontend/backend
- **TypeScript Migration**: Better type safety
- **GraphQL API**: More efficient data fetching
- **Redis Caching**: Improved performance
- **Docker Support**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Add comments for complex logic
- Update documentation as needed
- Test changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [MongoDB](https://www.mongodb.com/) for flexible database
- [Express](https://expressjs.com/) for robust backend framework

## 📞 Support

For support, email rakesh.coding.007@gmail.com or open an issue in the GitHub repository.

---

**Made with ❤️ by the Quick Poll Maker**

*Transform quizzes into engaging learning experiences with instant feedback and community participation.*