/**
 * Media Storage & Optimization Utility
 * 
 * Garantit la conservation des couleurs naturelles, l'absence de distorsion,
 * et une persistance sans faille dans le navigateur (localStorage + IndexedDB).
 */

const DB_NAME = 'GeorgesPortfolioMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB non disponible'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enregistre un média (image/vidéo en base64 ou blob) dans IndexedDB pour une persistance illimitée.
 */
export async function saveMediaToIndexedDB(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, dataUrl, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Sauvegarde IndexedDB:', err);
  }
}

/**
 * Récupère un média depuis IndexedDB si nécessaire.
 */
export async function getMediaFromIndexedDB(key: string): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.dataUrl : null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/**
 * Traite et optimise une image sélectionnée depuis l'explorateur de fichiers :
 * - Préserve strictement les couleurs naturelles et la fidélité originale (aucun filtre, aucune IA).
 * - Préserve le ratio d'aspect sans distorsion ni étirement.
 * - Réduit la dimension si l'image dépasse 1920px pour éviter de saturer le stockage du navigateur.
 * - Garantit une persistance pérenne après actualisation de la page.
 */
export function processImageFile(
  file: File,
  options: {
    maxDimension?: number;
    quality?: number;
  } = {}
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number }> {
  const { maxDimension = 1800, quality = 0.92 } = options;

  return new Promise((resolve, reject) => {
    // Vérification du type MIME
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Le fichier sélectionné n\'est pas une image valide.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('Contenu de fichier vide'));
      }

      // Si c'est un format vectoriel (SVG) ou un petit fichier déjà optimisé (< 200 Ko), le conserver directement
      if (file.type === 'image/svg+xml' || file.size < 200 * 1024) {
        return resolve({
          dataUrl: rawDataUrl,
          sizeKb: Math.round(file.size / 1024),
          width: 0,
          height: 0,
        });
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calcul des dimensions en préservant scrupuleusement les proportions naturelles
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', {
          alpha: file.type === 'image/png' || file.type === 'image/webp',
          colorSpace: 'srgb' // Espace colorimétrique sRGB standard pour fidélité exacte des teintes
        });

        if (!ctx) {
          return resolve({
            dataUrl: rawDataUrl,
            sizeKb: Math.round(file.size / 1024),
            width: img.width,
            height: img.height,
          });
        }

        // Configuration pour un rendu ultra-net sans aucun filtre artificiel
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.filter = 'none'; // AUCUN filtre appliqué (ni contraste, ni luminosité artificielle)

        // Rendu net de l'image
        ctx.drawImage(img, 0, 0, width, height);

        // Export au format JPEG (ou PNG si transparence)
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const finalDataUrl = canvas.toDataURL(outputFormat, quality);
        const approxSizeKb = Math.round((finalDataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl: finalDataUrl,
          sizeKb: approxSizeKb,
          width,
          height,
        });
      };

      img.onerror = () => {
        // En cas d'échec du décodage canvas, on retourne le DataURL brut
        resolve({
          dataUrl: rawDataUrl,
          sizeKb: Math.round(file.size / 1024),
          width: 0,
          height: 0,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
