import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ArticleCard from '../components/ArticleCard';

const Explore = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'canteen', label: ' Canteen' },
    { value: 'hostel', label: ' Hostel' },
    { value: 'branch', label: ' Branch' },
    { value: 'events', label: ' Events' },
    { value: 'campus', label: ' Campus' },
    { value: 'other', label: ' Other' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Voted' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await articleAPI.getAll({
        category: filter,
        sort: sort,
        page: page,
        limit: 9,
      });
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, [filter, sort]);

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchArticles(pagination.currentPage + 1);
    }
  };

  if (loading && articles.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Articles</h1>
        <p className="text-gray-600 mt-2">Discover stories from your college community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found</p>
          <Link to="/publish" className="text-primary hover:underline mt-2 inline-block">
            Be the first to publish an article!
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          
          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;