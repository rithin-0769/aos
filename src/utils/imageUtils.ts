// Image processing utility for S.H.I.E.L.D. Protocol
// Handles compression, downscaling, and safe storage to prevent localStorage QuotaExceededError

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

export const processImageFile = (
  file: File,
  maxWidth = 400,
  maxHeight = 480,
  quality = 0.85
): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate aspect ratio scale
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Render to canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas 2D context.'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export compressed data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const sizeKb = Math.round((dataUrl.length * 0.75) / 1024);

      resolve({
        dataUrl,
        width,
        height,
        sizeKb
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load and decode image file.'));
    };

    img.src = objectUrl;
  });
};

// Safe localStorage helper to prevent quota crashes
export const safeSaveToLocalStorage = (key: string, value: unknown): boolean => {
  try {
    const stringified = JSON.stringify(value);
    localStorage.setItem(key, stringified);
    return true;
  } catch (err) {
    console.warn(`Failed to save to localStorage for key "${key}":`, err);
    // If quota exceeded, try to clear large cached items or warn
    return false;
  }
};
