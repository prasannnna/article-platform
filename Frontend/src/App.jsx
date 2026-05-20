import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Signup from './pages/Signup';
import Login from './pages/Login';
import Explore from './pages/Explore';
import ArticleDetail from './pages/ArticleDetail';
import PublishArticle from './pages/PublishArticle';
import MyArticles from './pages/MyArticles';
// import Leaderboard from './pages/Leaderboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
        
        {/* Protected Routes */}
        <Route path="/publish" element={
          <ProtectedRoute><PublishArticle /></ProtectedRoute>
        } />
        <Route path="/my-articles" element={
          <ProtectedRoute><MyArticles /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;