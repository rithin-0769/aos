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
  maxWidth = 320,
  maxHeight = 380,
  quality = 0.8
): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    // Check MIME type or filename extension for robust Windows file support
    const isImage =
      (file.type && file.type.startsWith('image/')) ||
      /\.(jpe?g|png|webp|gif|bmp|svg|jfif|heic|avif)$/i.test(file.name);

    if (!isImage) {
      reject(new Error('Selected file is not a supported image format (JPEG, PNG, WebP).'));
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
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);

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
      reject(new Error('Failed to decode image file. Please try another image.'));
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
    console.warn(`Initial localStorage save failed for key "${key}":`, err);
    // If saving with large avatarUrl exceeded quota, attempt recovery without avatarUrl
    if (typeof value === 'object' && value !== null && 'avatarUrl' in value) {
      try {
        const strippedValue = { ...(value as Record<string, unknown>), avatarUrl: undefined };
        localStorage.setItem(key, JSON.stringify(strippedValue));
        console.warn(`Saved fallback profile without avatarUrl due to browser storage limits.`);
        return true;
      } catch (fallbackErr) {
        console.error(`Critical localStorage write failure:`, fallbackErr);
      }
    }
    return false;
  }
};
