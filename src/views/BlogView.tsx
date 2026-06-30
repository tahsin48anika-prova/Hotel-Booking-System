/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Search, Compass, BookOpen, Clock, ArrowLeft, ArrowRight, MessageSquare, Send } from "lucide-react";

export default function BlogView() {
  const { blogs } = useApp();
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Comments simulator for active reading
  const [comments, setComments] = useState<Record<string, Array<{ author: string; date: string; text: string }>>>({
    "blog-1": [
      { author: "Evelyn Sterling", date: "June 22, 2026", text: "Truly a magnificent read. The basalt rock sauna was indeed the highlight of my trip!" },
      { author: "Julian Mercer", date: "June 25, 2026", text: "Can confirm that the mineral ratios in the pool are perfectly calibrated. Very rejuvenating." }
    ]
  });
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const selectedBlog = blogs.find(b => b.id === selectedBlogId);

  const tagsList = ["All Journal Entries", "Wellness", "Gastronomy", "Architecture", "Travel Intelligence"];

  // Filtered lists
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch = 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tagMap: Record<string, string> = {
        "Wellness": "Wellness",
        "Gastronomy": "Gastronomy",
        "Architecture": "Architecture",
        "Travel Intelligence": "Travel Intelligence"
      };

      const matchesTag = selectedTag && selectedTag !== "All Journal Entries"
        ? b.category === tagMap[selectedTag]
        : true;

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchTerm, selectedTag]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlogId || !newCommentName.trim() || !newCommentText.trim()) return;

    const newComment = {
      author: newCommentName,
      date: new Date().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }),
      text: newCommentText
    };

    setComments(prev => ({
      ...prev,
      [selectedBlogId]: [...(prev[selectedBlogId] || []), newComment]
    }));

    setNewCommentName("");
    setNewCommentText("");
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* LISTING VIEW */}
        {!selectedBlog ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <p className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold">Worldora Chronicle</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">The Travel Journal</h1>
              <p className="text-xs text-slate-400">
                Explore essays regarding destination architecture, private vineyard tours, deep-tissue mineral therapy research, and elite leisure guidelines.
              </p>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-md">
              {/* Search bar */}
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Tag Badges */}
              <div className="md:col-span-8 flex flex-wrap gap-2 justify-start md:justify-end">
                {tagsList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === "All Journal Entries" ? "" : tag)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      (selectedTag === "" && tag === "All Journal Entries") || (selectedTag === tag)
                        ? "bg-amber-600 border-amber-500 text-white"
                        : "bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid list */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-slate-900/40 border border-slate-850 rounded-2xl overflow-hidden group hover:border-slate-800 transition-all duration-300 flex flex-col shadow-lg cursor-pointer"
                    onClick={() => setSelectedBlogId(post.id)}
                    id={`blog-card-${post.id}`}
                  >
                    {/* Cover Photo */}
                    <div className="h-52 relative overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-850 text-amber-500 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow">
                        {post.category}
                      </div>
                    </div>

                    {/* Meta & Excerpt */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{post.readTime}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-md font-serif font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                        <span className="text-[10px] text-amber-500 font-serif font-bold uppercase tracking-widest flex items-center space-x-1">
                          <span>Inspect Chronicle</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900 border border-slate-850 rounded-2xl max-w-md mx-auto space-y-2 shadow">
                <BookOpen className="w-10 h-10 text-amber-500/20 mx-auto" />
                <h4 className="text-white font-serif font-bold text-md">No Chronicles Found</h4>
                <p className="text-xs text-slate-400">Broaden your search terms or choose another filter category.</p>
              </div>
            )}
          </>
        ) : (
          /* DEEP-READ STORY VIEW */
          <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
            {/* Return Link */}
            <button
              onClick={() => setSelectedBlogId(null)}
              className="text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 uppercase text-[9px] tracking-widest font-mono font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to chronicle catalog</span>
            </button>

            {/* Meta Tags */}
            <div className="space-y-4 text-center">
              <span className="inline-block bg-amber-600/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full">
                {selectedBlog.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white leading-tight tracking-tight">
                {selectedBlog.title}
              </h1>
              <div className="flex justify-center items-center space-x-3 text-xs text-slate-500 font-mono pt-1">
                <span>By Chief Curator</span>
                <span>•</span>
                <span>{selectedBlog.date}</span>
                <span>•</span>
                <span>{selectedBlog.readTime} read</span>
              </div>
            </div>

            {/* Large Cover Image */}
            <div className="h-[250px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-900 shadow-2xl">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
            </div>

            {/* Essay Body */}
            <div className="font-serif text-sm text-slate-300 leading-relaxed space-y-6 whitespace-pre-line border-b border-slate-900 pb-10">
              {selectedBlog.content}
            </div>

            {/* Interactive Reader Comments */}
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <span>Traveler Comments ({comments[selectedBlog.id]?.length || 0})</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase text-white tracking-widest">Contribute to the Essay</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    placeholder="Your Esteemed Name"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your response or verified travel intelligence..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold py-2 px-5 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>Post Response</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>

              {/* Feed of comments */}
              <div className="space-y-4">
                {(comments[selectedBlog.id] || []).map((comm, cIdx) => (
                  <div key={cIdx} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300 font-mono">{comm.author}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{comm.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">{comm.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
