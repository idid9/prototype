export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  fileName: string;
  sizeKb: number;
}

const MAX_FILE_SIZE_MB = 15;
// Keep Data URLs comfortably below Firestore's 1MB document limit (750k rule limit)
const MAX_CLOUD_DATA_URL_LENGTH = 600_000;

function encodeCanvasToBestFit(
  img: HTMLImageElement,
  startWidth: number,
  startHeight: number,
  initialQuality: number
): { dataUrl: string; width: number; height: number } {
  const qualitySteps = [initialQuality, 0.72, 0.58, 0.45, 0.34];
  const scaleSteps = [1, 0.8, 0.65, 0.5];

  let lastResult = {
    dataUrl: '',
    width: startWidth,
    height: startHeight,
  };

  for (const scale of scaleSteps) {
    const width = Math.max(120, Math.round(startWidth * scale));
    const height = Math.max(120, Math.round(startHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) break;

    ctx.drawImage(img, 0, 0, width, height);

    for (const q of qualitySteps) {
      let dataUrl = canvas.toDataURL('image/webp', q);
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', q);
      }
      lastResult = { dataUrl, width, height };
      if (dataUrl.length <= MAX_CLOUD_DATA_URL_LENGTH) {
        return lastResult;
      }
    }
  }

  return lastResult;
}

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

      // Preserve animated GIFs and vector SVGs directly when within cloud size limits
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        if (rawDataUrl.length > MAX_CLOUD_DATA_URL_LENGTH) {
          reject(
            new Error(
              'Selected GIF or SVG is too large for real-time cloud sync (max ~450KB). Please use a smaller file or PNG/JPG/WEBP.'
            )
          );
          return;
        }
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
        if (rawDataUrl.length > MAX_CLOUD_DATA_URL_LENGTH) {
          reject(new Error('Could not optimize image to fit cloud storage limits.'));
          return;
        }
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
          const encoded = encodeCanvasToBestFit(img, targetWidth, targetHeight, quality);

          if (!encoded.dataUrl) {
            resolve({
              dataUrl: rawDataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
              fileName: file.name,
              sizeKb: Math.round((rawDataUrl.length * 0.75) / 1024),
            });
            return;
          }

          // Keep whichever is smaller when original fits within limits and wasn't resized
          const canUseRaw =
            rawDataUrl.length <= MAX_CLOUD_DATA_URL_LENGTH &&
            rawDataUrl.length < encoded.dataUrl.length &&
            encoded.width === img.naturalWidth &&
            encoded.height === img.naturalHeight;

          const finalDataUrl = canUseRaw ? rawDataUrl : encoded.dataUrl;

          resolve({
            dataUrl: finalDataUrl,
            width: encoded.width,
            height: encoded.height,
            fileName: file.name,
            sizeKb: Math.round((finalDataUrl.length * 0.75) / 1024),
          });
        } catch {
          if (rawDataUrl.length > MAX_CLOUD_DATA_URL_LENGTH) {
            reject(new Error('Failed to compress image for cloud synchronization.'));
            return;
          }
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
