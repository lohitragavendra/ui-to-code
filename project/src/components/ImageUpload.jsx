import React, { useState, useRef } from 'react';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setError(null);
        } else {
            setError('Please select a valid image file');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            const response = await fetch('http://localhost:8000/generate-code', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            // Create download URL for the zip file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'generated-ui.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const resetUpload = () => {
        setSelectedFile(null);
        setDownloadUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="text-4xl font-bold text-primary-purple mb-2">CODEGEN</div>
                <p className="text-text-muted">Upload a UI design to generate React code</p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-xl shadow-custom border border-gray-50/50 p-8">
                {!downloadUrl ? (
                    <>
                        {/* File Drop Zone */}
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${selectedFile
                                    ? 'border-primary-purple bg-primary-purple/5'
                                    : 'border-border-light hover:border-primary-purple/50'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {selectedFile ? (
                                <div className="space-y-4">
                                    <div className="text-primary-purple">
                                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-text-dark font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-text-muted">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-gray-400">
                                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-text-dark font-medium">Drop your image here</p>
                                        <p className="text-sm text-text-muted">or click to browse</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 py-2 px-4 border border-border-light rounded-lg text-text-dark hover:bg-gray-50 transition-colors"
                            >
                                {selectedFile ? 'Change File' : 'Select File'}
                            </button>

                            {selectedFile && (
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex-1 py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUploading ? 'Generating...' : 'Generate Code'}
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="text-center space-y-6">
                        <div className="text-green-500">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-text-dark mb-2">Code Generated Successfully!</h3>
                            <p className="text-text-muted">Your React project is ready for download</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex-1 py-3 px-6 bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                            >
                                Download ZIP
                            </button>
                            <button
                                onClick={resetUpload}
                                className="flex-1 py-3 px-6 border border-border-light text-text-dark rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Upload Another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
