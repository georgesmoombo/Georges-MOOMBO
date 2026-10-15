import React, { useState } from 'react';
import { Newspaper, Clock, User, ArrowRight, X, Tag } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { BlogArticle } from '../../types/crm';

export const BlogSection: React.FC = () => {
  const { blogArticles } = useCrm();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Tous');

  const published = blogArticles.filter(a => a.status === 'Publié');
  const filtered = categoryFilter === 'Tous' 
    ? published 
    : published.filter(a => a.category === categoryFilter);

  const categories = ['Tous', 'Informatique de Gestion', 'Cybersécurité', 'Bases de données'];

  return (
    <section id="blog" className="py-24 bg-white dark:bg-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Newspaper className="w-4 h-4" /> Veille & Publications Techniques
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Articles & Retours d'Expérience
          </h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Conseils pratiques sur l'informatisation des entreprises, la sécurité des données et les architectures modernes en RDC.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 fade-in-up">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8 stagger-children">
          {filtered.map(article => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer fade-in-up zoom-in"
            >
              <div>
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold uppercase rounded-full shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                Lire l'article complet <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 my-6 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="relative h-60 sm:h-72 w-full flex-shrink-0">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded-full">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight text-white">
                  {selectedArticle.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <span>Par {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {selectedArticle.content}

              {selectedArticle.tags && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
              >
                Fermer la lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
