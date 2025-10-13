import React, { useState } from 'react';
import { BookOpen, Video, Headphones, Download, Play, Clock, Star, Search, Filter } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources', count: 45 },
    { id: 'articles', name: 'Articles', count: 18 },
    { id: 'videos', name: 'Videos', count: 12 },
    { id: 'podcasts', name: 'Podcasts', count: 8 },
    { id: 'exercises', name: 'Exercises', count: 7 }
  ];

  const resources = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Complete Guide',
      type: 'article',
      category: 'Anxiety',
      duration: '8 min read',
      rating: 4.8,
      reviews: 124,
      description: 'Comprehensive guide to understanding anxiety disorders, their symptoms, and effective management strategies.',
      image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Anxiety', 'Education', 'Coping Skills']
    },
    {
      id: 2,
      title: 'Daily Mindfulness Meditation',
      type: 'video',
      category: 'Mindfulness',
      duration: '15 minutes',
      rating: 4.9,
      reviews: 89,
      description: 'Guided meditation session to help you start your day with clarity and peace.',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Meditation', 'Mindfulness', 'Daily Practice']
    },
    {
      id: 3,
      title: 'Overcoming Depression: Personal Stories',
      type: 'podcast',
      category: 'Depression',
      duration: '45 minutes',
      rating: 4.7,
      reviews: 76,
      description: 'Inspiring stories from individuals who have successfully managed depression and found hope.',
      image: 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Depression', 'Recovery', 'Hope']
    },
    {
      id: 4,
      title: 'Progressive Muscle Relaxation',
      type: 'exercise',
      category: 'Stress Relief',
      duration: '12 minutes',
      rating: 4.6,
      reviews: 156,
      description: 'Step-by-step relaxation technique to release physical tension and mental stress.',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Relaxation', 'Stress Relief', 'Body Work']
    },
    {
      id: 5,
      title: 'Building Healthy Relationships',
      type: 'article',
      category: 'Relationships',
      duration: '6 min read',
      rating: 4.5,
      reviews: 92,
      description: 'Essential skills for creating and maintaining healthy, supportive relationships.',
      image: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Relationships', 'Communication', 'Social Skills']
    },
    {
      id: 6,
      title: 'Sleep Hygiene for Better Mental Health',
      type: 'video',
      category: 'Sleep',
      duration: '20 minutes',
      rating: 4.8,
      reviews: 203,
      description: 'Learn how proper sleep habits can significantly improve your mental wellbeing.',
      image: 'https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Sleep', 'Health', 'Wellness']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'podcast': return Headphones;
      case 'exercise': return Play;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'podcast': return 'bg-purple-100 text-purple-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.type === activeCategory.slice(0, -1);
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = [
    {
      title: 'Mental Health First Aid Kit',
      description: 'Essential tools and techniques for managing mental health crises',
      downloadCount: '2.3k downloads'
    },
    {
      title: 'Daily Mood Tracking Journal',
      description: 'Printable journal template for tracking your emotional wellbeing',
      downloadCount: '1.8k downloads'
    },
    {
      title: 'Breathing Exercises Guide',
      description: 'Quick reference guide for various breathing techniques',
      downloadCount: '3.1k downloads'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover evidence-based resources, tools, and content to support your mental health journey and personal growth.
            </p>
          </div>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection delay={100}>
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </button>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Featured Downloads */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Downloads</h3>
                <div className="space-y-4">
                  {featuredResources.map((resource, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{resource.downloadCount}</span>
                        <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatedSection delay={150}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <div key={resource.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        {(() => {
                          const Icon = getTypeIcon(resource.type);
                          return <Icon className="h-4 w-4 text-gray-500 mr-2" />;
                        })()}
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {resource.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{resource.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({resource.reviews})</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{resource.category}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        {resource.type === 'article' ? 'Read Article' :
                         resource.type === 'video' ? 'Watch Video' :
                         resource.type === 'podcast' ? 'Listen Now' :
                         'Start Exercise'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Load More */}
            <AnimatedSection delay={400}>
              <div className="text-center mt-12">
                <button className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  Load More Resources
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;