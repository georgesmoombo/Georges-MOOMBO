import React, { useState } from 'react';
import { 
  Image, Sparkles, Filter, ExternalLink, Calendar, 
  Tag, ArrowRight, X, ChevronLeft, ChevronRight, 
  Search, CheckCircle2, Layers 
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { GalleryCategory, GalleryItem } from '../../types/crm';

interface GallerySectionProps {
  onSelectForQuote?: (title: string) => void;
  onOpenProjectDetails?: (projectId: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  onSelectForQuote,
  onOpenProjectDetails 
}) => {
  const { galleryItems } = useCrm();
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const categories: string[] = [
    'Tous',
    'Logiciels de gestion',
    'Applications Web & Mobile',
    'Formations & Ateliers',
    'Infrastructure & Réseaux',
    'Certifications & Événements'
  ];

  // Filtering
  const filteredItems = galleryItems.filter(item => {
    const matchesCat = activeCategory === 'Tous' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const selectedItem: GalleryItem | null = 
    selectedItemIndex !== null && filteredItems[selectedItemIndex] 
      ? filteredItems[selectedItemIndex] 
      : null;

  const handleNext = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="galerie" className="py-24 bg-slate-50 dark:bg-slate-900 scroll-mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Portfolio Visuel & Réalisations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Galerie des Projets & Interventions
            </h2>
            <div className="mt-2 h-1 w-20 bg-blue-600 rounded-full"></div>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Captures d'interfaces logicielles, déploiements d'infrastructures réseaux, sessions de formation bureautique et certifications à Kinshasa.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une réalisation..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar fade-in-up">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            Aucun élément ne correspond à votre recherche pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemIndex(index)}
                className="group relative bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer fade-in-up zoom-in"
              >
                {/* Image Container with Zoom & Badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-xl">
                      Agrandir la vue <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {item.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shadow-md block" title="Projet Vedette">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">
                      {item.date} {item.clientOrContext ? `• ${item.clientOrContext}` : ''}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {item.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                  {selectedItem.category}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                  {selectedItem.date}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Précédent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Suivant"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedItemIndex(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Full Image */}
              <div className="rounded-2xl overflow-hidden bg-black max-h-[50vh] flex items-center justify-center border border-slate-800">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[50vh] object-contain"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                />
              </div>

              {/* Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.clientOrContext && (
                    <span className="text-xs text-blue-400 font-bold block mt-1">
                      Contexte / Client : {selectedItem.clientOrContext}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>

                {selectedItem.metrics && (
                  <div className="p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center gap-2.5 text-xs text-blue-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Impact mesuré : {selectedItem.metrics}</span>
                  </div>
                )}

                {/* Tech tags */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Technologies & Méthodes :</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Intéressé par une réalisation similaire pour votre entreprise ?
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedItem.relatedProjectId && onOpenProjectDetails && (
                  <button
                    onClick={() => {
                      const pId = selectedItem.relatedProjectId;
                      setSelectedItemIndex(null);
                      if (pId) onOpenProjectDetails(pId);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Voir la fiche projet
                  </button>
                )}

                <button
                  onClick={() => {
                    const title = selectedItem.title;
                    setSelectedItemIndex(null);
                    if (onSelectForQuote) {
                      onSelectForQuote(title);
                    }
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  Demander un devis similaire <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
