'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  aspect?: 'square' | 'landscape' | 'banner' | string;
}

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = 'Click or drag image to upload',
  multiple = false,
  aspect = 'square',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse multi-image gallery string if multiple mode
  const multiValues = multiple && value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      if (multiple) {
        const uploadedUrls: string[] = [...multiValues];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to upload image');
          uploadedUrls.push(data.url);
        }
        onChange(uploadedUrls.join(','));
      } else {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to upload image');
        onChange(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleRemoveMulti(index: number) {
    const newValues = multiValues.filter((_, i) => i !== index);
    onChange(newValues.join(','));
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold uppercase text-slate-400">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!multiple ? (
        /* Single Image Upload Mode */
        <div className="space-y-3">
          {value ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
              <Image src={value} alt="Uploaded image" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 bg-red-500/80 text-white rounded-xl hover:bg-red-600 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white bg-slate-950/60 transition group"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-xs font-semibold">Uploading Image...</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold">{placeholder}</span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, WEBP, GIF up to 10MB</span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        /* Multi-Image Gallery Mode */
        <div className="space-y-3">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex items-center justify-center gap-3 text-slate-400 hover:text-white bg-slate-950/60 transition group"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-xs font-semibold">Uploading Photos...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Click to upload photos to Gallery</span>
              </>
            )}
          </button>

          {multiValues.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
              {multiValues.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 group">
                  <Image src={url} alt={`Gallery item ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveMulti(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
