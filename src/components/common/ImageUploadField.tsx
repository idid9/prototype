import React, { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { processImageFile } from '../../utils/imageUpload';
import { Upload, Image as ImageIcon, Trash2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  onClear?: () => void;
  helperText?: string;
  previewHeightClass?: string;
  maxDimension?: number;
  variant?: 'theme' | 'modal-light';
  emptyPlaceholder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  onClear,
  helperText,
  previewHeightClass = 'h-36',
  maxDimension = 1440,
  variant = 'theme',
  emptyPlaceholder,
}) => {
  const { language, isRtl } = useLanguage();
  const { currentAccentHex } = useTheme();
  const isArabic = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadMeta, setUploadMeta] = useState<{ fileName: string; sizeKb: number } | null>(null);

  const isModalLight = variant === 'modal-light';
  const headingClass = isModalLight ? 'text-[#123B32]' : 'text-[var(--tf-heading)]';
  const mutedClass = isModalLight ? 'text-[#777D75]' : 'text-[var(--tf-muted)]';
  const surfaceClass = isModalLight
    ? 'bg-[#FAF8F5] border-[#D9C29A]/60 text-[#202923]'
    : 'bg-[var(--tf-input-bg)] border-[var(--tf-border)] text-[var(--tf-text)]';

  const resolvedEmptyPlaceholder =
    emptyPlaceholder ||
    (isArabic
      ? 'انقر أو اسحب وأفلت صورة من جهازك'
      : 'Click or drag & drop an image from your device');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrorMsg('');
    setIsProcessing(true);

    try {
      const processed = await processImageFile(file, { maxDimension });
      onChange(processed.dataUrl);
      setUploadMeta({ fileName: processed.fileName, sizeKb: processed.sizeKb });
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : '';
      if (isArabic) {
        if (rawMsg.includes('valid image')) {
          setErrorMsg('يرجى اختيار ملف صورة صالح (PNG أو JPG أو WEBP أو GIF أو SVG).');
        } else if (rawMsg.includes('too large')) {
          setErrorMsg('حجم ملف الصورة كبير جداً. الحد الأقصى المسموح هو 15 ميجابايت.');
        } else {
          setErrorMsg('تعذرت معالجة ملف الصورة المحدد.');
        }
      } else {
        setErrorMsg(rawMsg || 'Unable to process image file.');
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isUploadedFromDevice = value.startsWith('data:image/');

  return (
    <div className="space-y-2" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-2">
        <label className={`block text-xs font-semibold ${headingClass}`}>
          {label}
        </label>
        {value && isUploadedFromDevice && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
            <CheckCircle2 className="w-3 h-3" />
            <span>
              {uploadMeta
                ? `${uploadMeta.fileName} (${uploadMeta.sizeKb} ${isArabic ? 'ك.ب' : 'KB'})`
                : isArabic
                ? 'تم تفعيل الصورة من الجهاز'
                : 'Device image active'}
            </span>
          </span>
        )}
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Interactive Upload Dropzone + Live Preview */}
      <div
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={isDragging ? { borderColor: currentAccentHex } : undefined}
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer group ${surfaceClass} ${
          isDragging ? 'ring-2 ring-offset-1 opacity-95' : 'hover:opacity-95'
        }`}
      >
        {value ? (
          <div className={`relative w-full ${previewHeightClass} bg-neutral-900`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-between p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15">
                  <ImageIcon className="w-3.5 h-3.5" style={{ color: currentAccentHex }} />
                  <span>
                    {isUploadedFromDevice
                      ? isArabic
                        ? 'مرفوعة من الجهاز'
                        : 'Uploaded from Device'
                      : isArabic
                      ? 'الصورة النشطة'
                      : 'Active Photo'}
                  </span>
                </span>

                {onClear && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadMeta(null);
                      onClear();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-red-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isArabic ? 'إزالة' : 'Remove'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-white/85">
                  {isArabic
                    ? 'انقر أو أسقط صورة هنا للاستبدال من جهازك'
                    : 'Click or drop a photo here to replace from device'}
                </span>
                <span
                  style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm shrink-0"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isProcessing
                      ? isArabic
                        ? 'جارٍ المعالجة...'
                        : 'Processing...'
                      : isArabic
                      ? 'رفع صورة'
                      : 'Upload Photo'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-full ${previewHeightClass} flex flex-col items-center justify-center p-4 text-center gap-2`}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: currentAccentHex, color: '#102E29' }}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className={`text-xs font-bold ${headingClass}`}>
              {isProcessing
                ? isArabic
                  ? 'جارٍ تحسين الصورة من جهازك...'
                  : 'Optimizing image from device...'
                : resolvedEmptyPlaceholder}
            </div>
            <div className={`text-[11px] ${mutedClass}`}>
              {isArabic
                ? 'يدعم JPG و PNG و WEBP و GIF و SVG · يتم تحسينها تلقائياً للمزامنة الفورية'
                : 'Supports JPG, PNG, WEBP, GIF, SVG · Automatically optimized for instant sync'}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <p className={`text-[11px] ${mutedClass}`}>{helperText}</p>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
