import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
    currentImage?: string;
    onUpload: (file: File) => void;
    onCancel: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onUpload, onCancel }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Trigger upload callback
        onUpload(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className="bg-cyber-dark-gray border border-cyber-green/30 p-6 rounded-xl w-full max-w-md relative shadow-cyber">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-cyber-text-muted hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-4 font-sans">Upload Avatar</h2>

                <div
                    className={`
            border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors
            ${dragActive ? 'border-cyber-green bg-cyber-green/10' : 'border-neutral-700 hover:border-neutral-500'}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />

                    {preview ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-cyber-green">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-black/50 overflow-hidden mb-4 flex items-center justify-center border border-white/10">
                            {currentImage ? (
                                <img src={currentImage} alt="Current" className="w-full h-full object-cover opacity-50" />
                            ) : (
                                <Upload className="text-cyber-green" size={32} />
                            )}
                        </div>
                    )}

                    <p className="text-sm text-cyber-text font-mono mb-2">
                        Drag & drop or click to select
                    </p>
                    <p className="text-xs text-cyber-text-muted font-mono">
                        Supports JPG, PNG, GIF
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded text-sm font-mono text-cyber-text hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => preview && console.log('Confirm upload')}
                        disabled={!preview}
                        className="px-4 py-2 rounded text-sm font-mono bg-cyber-green text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyber transition-all"
                    >
                        Confirm Upload
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageUpload;
