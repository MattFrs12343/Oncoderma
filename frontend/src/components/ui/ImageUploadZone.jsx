import React, { useState, useRef } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const ImageUploadZone = ({ onImageSelect, preview, imageMetadata }) => {
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        onImageSelect(file)
      }
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md'
            : theme === 'dark'
            ? 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/5'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <div
              className={`
                absolute top-2 right-2 p-2 rounded-full
                ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'}
                backdrop-blur-sm
              `}
            >
              <svg
                className="w-5 h-5 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Click para cambiar imagen o arrastra una nueva
          </p>
          {imageMetadata && (
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {imageMetadata.width}x{imageMetadata.height}px • {imageMetadata.megapixels}MP
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center">
            <div
              className={`
                p-3 rounded-full
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}
              `}
            >
              <svg
                className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>
          <div>
            <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Arrastra tu imagen aquí
            </p>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              o haz click para seleccionar
            </p>
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            JPEG o PNG (máx. 10MB)
          </p>
        </div>
      )}
    </div>
  )
}

export default ImageUploadZone
