import React, { useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { useCrm } from '../../context/CrmContext';
import { 
  Image, Plus, Search, Trash2, Edit3, ExternalLink, 
  Sparkles, Check, X, Eye, ArrowRight, Tag, Calendar, 
  Upload, RotateCcw, AlertTriangle 
} from 'lucide-react';
import { GalleryItem, GalleryCategory } from '../../types/crm';
import { processImageFile, saveMediaToIndexedDB } from '../../utils/mediaStorage';

export const AdminGalleryPage: React.FC = () => {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    category: GalleryCategory;
    description: string;
    imageUrl: string;
    tags: string;
    date: string;
    clientOrContext: string;
    metrics: string;
    featured: boolean;
  }>({
    title: '',
    category: 'Logiciels de gestion',
    description: '',
    imageUrl: '',
    tags: 'React, MySQL, Tailwind CSS',
    date: '2024',
    clientOrContext: '',
    metrics: '',
    featured: false,
  });

  const categories: GalleryCategory[] = [
    'Logiciels de gestion',
    'Applications Web & Mobile',
    'Formations & Ateliers',
    'Infrastructure & Réseaux',
    'Certifications & Événements'
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchesCat = selectedCategory === 'Tous' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const [uploadStatus, setUploadStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setUploadStatus(null);
    setFormData({
      title: '',
      category: 'Logiciels de gestion',
      description: '',
      imageUrl: '/cover_photo.jpg',
      tags: 'PHP, MySQL, TypeScript',
      date: new Date().getFullYear().toString(),
      clientOrContext: 'Entreprise Kinshasa',
      metrics: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setUploadStatus(null);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      tags: item.tags.join(', '),
      date: item.date,
      clientOrContext: item.clientOrContext || '',
      metrics: item.metrics || '',
      featured: !!item.featured,
    });
    setIsModalOpen(true);
  };

  // Upload d'image / vidéo depuis l'explorateur de fichiers de l'appareil
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.type.startsWith('video/')) {
        setUploadStatus({ message: 'Lecture de la vidéo depuis votre ordinateur...' });
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
          try {
            await saveMediaToIndexedDB(`gallery_video_${Date.now()}`, dataUrl);
          } catch (e) {
            console.warn('IndexedDB video cache skip', e);
          }
          setUploadStatus({
            message: `✓ Vidéo (${(file.size / (1024 * 1024)).toFixed(1)} Mo) importée avec succès.`,
          });
          setTimeout(() => setUploadStatus(null), 4000);
        };
        reader.readAsDataURL(file);
        return;
      }

      setUploadStatus({ message: 'Lecture et traitement de l\'image depuis votre ordinateur...' });
      const processed = await processImageFile(file, {
        maxDimension: 1920,
        quality: 0.92,
      });

      setFormData(prev => ({ ...prev, imageUrl: processed.dataUrl }));
      await saveMediaToIndexedDB(`gallery_${Date.now()}`, processed.dataUrl);

      setUploadStatus({
        message: `✓ Image importée avec succès (${processed.sizeKb} Ko) - Couleurs naturelles préservées.`,
      });
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (err: any) {
      console.error(err);
      setUploadStatus({
        message: err.message || 'Erreur lors de la lecture du fichier.',
        isError: true,
      });
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagList = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingItem) {
      updateGalleryItem({
        ...editingItem,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl,
        tags: tagList,
        date: formData.date,
        clientOrContext: formData.clientOrContext || undefined,
        metrics: formData.metrics || undefined,
        featured: formData.featured,
      });
    } else {
      addGalleryItem({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl,
        tags: tagList,
        date: formData.date,
        clientOrContext: formData.clientOrContext || undefined,
        metrics: formData.metrics || undefined,
        featured: formData.featured,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Êtes-vous certain de vouloir supprimer "${title}" de la galerie ?`)) {
      deleteGalleryItem(id);
    }
  };

  return (
    <AdminLayout activeNav="gallery">
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Image className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Gestion de la Galerie & Médias ({galleryItems.length})
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Administrez les réalisations visuelles, captures d'écrans de logiciels et photos publiées sur le portfolio.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/#galerie"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-blue-400" /> Voir en direct
            </a>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Ajouter une réalisation
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['Tous', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer les médias..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-900/90 text-blue-400 border border-blue-500/20">
                    {item.category}
                  </span>
                </div>
                {item.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
                      <Sparkles className="w-3 h-3" /> Vedette
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {item.date} {item.clientOrContext ? `• ${item.clientOrContext}` : ''}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                {item.metrics && (
                  <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    ✓ {item.metrics}
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Add / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-400" />
                  {editingItem ? 'Modifier la réalisation' : 'Ajouter une réalisation à la galerie'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Titre de la réalisation *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Terminal de Caisse POS & Impression ESC/POS"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Catégorie *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date / Période</label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="Ex: Mars 2024"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Upload & Media Selection */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <label className="block text-xs font-bold uppercase text-slate-300">
                      Média de la Réalisation (Image ou Capture) *
                    </label>
                    <span className="text-[11px] text-blue-400 font-medium">
                      Couleurs naturelles • Zéro filtre artificiel • Haute netteté
                    </span>
                  </div>

                  {uploadStatus && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      uploadStatus.isError 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {uploadStatus.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                      <span>{uploadStatus.message}</span>
                    </div>
                  )}

                  {/* Preview Container */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                    {formData.imageUrl ? (
                      formData.imageUrl.startsWith('data:video') || formData.imageUrl.endsWith('.mp4') || formData.imageUrl.endsWith('.webm') ? (
                        <video 
                          src={formData.imageUrl} 
                          controls 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img 
                          src={formData.imageUrl} 
                          alt="Aperçu réalisation" 
                          className="w-full h-full object-contain"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/cover_photo.jpg'; }}
                        />
                      )
                    ) : (
                      <div className="text-slate-500 text-xs">
                        Aucun fichier média sélectionné
                      </div>
                    )}
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-700 text-xs"
                        title="Effacer le média"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* File Selector & Path Input */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 shadow-md shadow-blue-600/20">
                      <Upload className="w-3.5 h-3.5" /> Choisir une image ou vidéo depuis mon ordinateur
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleGalleryFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Chemin local (/cover_photo.jpg) ou DataURL..."
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                    />
                  </div>

                  {/* Quick Local Assets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">Raccourcis fichiers locaux :</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '/cover_photo.jpg' }))}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> /cover_photo.jpg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '/profile_photo.jpg' }))}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> /profile_photo.jpg
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description détaillée *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez les fonctionnalités, le challenge technique et le livrable..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Client ou Contexte d'intervention</label>
                    <input
                      type="text"
                      value={formData.clientOrContext}
                      onChange={(e) => setFormData({ ...formData, clientOrContext: e.target.value })}
                      placeholder="Ex: Distributeur Kinshasa Limete"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Métrique d'impact (optionnel)</label>
                    <input
                      type="text"
                      value={formData.metrics}
                      onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                      placeholder="Ex: -45% de pertes de stock constatées"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tags technologiques (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="MySQL, PHP, React, OHADA"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Mettre en vedette (Badge doré)</span>
                    <span className="text-[10px] text-slate-400">Mise en avant sur le portfolio public</span>
                  </div>
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    {editingItem ? 'Enregistrer les modifications' : 'Publier dans la galerie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
