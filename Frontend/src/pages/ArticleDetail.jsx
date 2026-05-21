import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleAPI, voteAPI } from '../services/api';
import { useAuth } from '../context/authContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await articleAPI.getById(id);
      setArticle(response.data.article);
      setIsAuthor(response.data.article.author?._id === user?._id);
      
      // Check if user voted (if authenticated)
      // if (isAuthenticated) {
      //   try {
      //     const voteCheck = await voteAPI.checkVote(id);
      //     setHasVoted(voteCheck.data.hasVoted);
      //   } catch (err) {
      //     console.error('Failed to check vote status');
      //   }
      // }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    alert("New feature");
    return;
  //   if (!isAuthenticated) {
  //     navigate('/login');
  //     return;
  //   }
    
  //   if (hasVoted) {
  //     return;
  //   }
    
  //   setVoting(true);
  //   try {
  //     await voteAPI.vote(id);
  //     setHasVoted(true);
  //     setArticle({
  //       ...article,
  //       votes: article.votes + 1,
  //     });
  //   } catch (error) {
  //     console.error('Failed to vote:', error);
  //     alert(error.response?.data?.message || 'Failed to vote');
  //   } finally {
  //     setVoting(false);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (window.confirm('Are you sure you want to delete this article?')) {
  //     try {
  //       await articleAPI.delete(id);
  //       navigate('/my-articles');
  //     } catch (error) {
  //       alert('Failed to delete article');
  //     }
  //   }
  };

  if (loading) return <LoadingSpinner />;
  if (!article) return null;

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="capitalize"> {article.category}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {article.authorName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.authorName}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleVote}
              disabled={voting || hasVoted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                hasVoted
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>👍</span>
              <span>{article.votes || 0}</span>
            </button>
            
            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-article/${article._id}`)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.imageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* Author Bio */}
      {article.author?.bio && (
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">About the Author</h3>
          <p className="text-gray-600">{article.author.bio}</p>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
