import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePoll from './pages/CreatePoll';
import PollDetail from './pages/PollDetail';
import Dashboard from './pages/Dashboard';
import ExplanationPage from './components/polls/ExplanationPage';
import GrainyBackground from './components/layout/GrainyBackground';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <GrainyBackground>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:shareId" element={<PollDetail />} />
              <Route path="/poll/:shareId/explanation" element={<ExplanationPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </GrainyBackground>
      </AuthProvider>
    </Router>
  );
};

export default App;