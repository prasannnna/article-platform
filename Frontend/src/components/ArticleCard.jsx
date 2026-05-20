import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/article/${article._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
        {article.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary font-semibold uppercase tracking-wide">
              {article.category}
            </span>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <span></span>
              <span>{article.votes || 0}</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>By {article.authorName}</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;