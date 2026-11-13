export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
  sizeKb: number;
}

const MAX_FILE_SIZE_MB = 15;

export function processImageFile(
  file: File,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<ProcessedImageResult> {
  const { maxDimension = 1440, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (PNG, JPG, WEBP, GIF, or SVG).'));
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`Image file is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));

    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // Preserve animated GIFs and vector SVGs directly without canvas rasterization
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve({
          dataUrl: rawDataUrl,
          width: 0,
          height: 0,
          fileName: file.name,
          sizeKb: Math.round((rawDataUrl.length * 0.75) / 1024),
        });
        return;
      }

      const img = new window.Image();
      img.onerror = () => {
        // Fallback to raw DataURL if browser cannot decode via Image element
        resolve({
          dataUrl: rawDataUrl,
          width: 0,
          height: 0,
          fileName: file.name,
          sizeKb: Math.round((rawDataUrl.length * 0.75) / 1024),
        });
      };

      img.onload = () => {
        let targetWidth = img.naturalWidth || img.width;
        let targetHeight = img.naturalHeight || img.height;

        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          if (targetWidth >= targetHeight) {
            targetHeight = Math.round((targetHeight / targetWidth) * maxDimension);
            targetWidth = maxDimension;
          } else {
            targetWidth = Math.round((targetWidth / targetHeight) * maxDimension);
            targetHeight = maxDimension;
          }
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({
              dataUrl: rawDataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
              fileName: file.name,
              sizeKb: Math.round((rawDataUrl.length * 0.75) / 1024),
            });
            return;
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // WebP supports transparency and keeps localStorage compact; fall back to JPEG if unsupported
          let outputDataUrl = canvas.toDataURL('image/webp', quality);
          if (!outputDataUrl.startsWith('data:image/webp')) {
            outputDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Keep whichever is smaller when original wasn't resized
          const finalDataUrl =
            outputDataUrl.length < rawDataUrl.length ||
            targetWidth < img.naturalWidth ||
            targetHeight < img.naturalHeight
              ? outputDataUrl
              : rawDataUrl;

          resolve({
            dataUrl: finalDataUrl,
            width: targetWidth,
            height: targetHeight,
            fileName: file.name,
            sizeKb: Math.round((finalDataUrl.length * 0.75) / 1024),
          });
        } catch {
          resolve({
            dataUrl: rawDataUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
            fileName: file.name,
            sizeKb: Math.round((rawDataUrl.length * 0.75) / 1024),
          });
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
