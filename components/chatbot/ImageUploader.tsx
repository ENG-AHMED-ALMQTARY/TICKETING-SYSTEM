import React, { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageSelected(file, result);
      };

      reader.readAsDataURL(file);
    }
    
    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-700 transition-colors"
        title="Upload Image"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
    </>
  );
};