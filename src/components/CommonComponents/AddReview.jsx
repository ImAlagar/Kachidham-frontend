import React, { useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { toast } from "react-toastify";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function AddReview() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]); // Array of selected images
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const token = localStorage.getItem("token");

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (images.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type (JPEG, PNG, WebP allowed)`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        return false;
      }
      
      return true;
    });
    
    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove image from selection
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to write a review");
      navigate('/login', {
        state: {
          from: location.pathname
        }
      });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("title", title);
      formData.append("review", review);
      
      // Append images if any
      images.forEach((image, index) => {
        formData.append("reviewImages", image.file);
      });

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      const promise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText || "Upload failed"));
          }
        };
        
        xhr.onerror = () => reject(new Error("Network error"));
      });

      xhr.open("POST", `${API_BASE_URL}/api/ratings`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);

      const json = await promise;

      if (!json.success) {
        throw new Error(json.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      
      // Reset form
      setTitle("");
      setReview("");
      setRating(5);
      setImages([]);
      setUploadProgress(0);
      
      // Refresh page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error("Review submission error:", err);
      const errorMessage = err.message ? JSON.parse(err.message).message || err.message : "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 border rounded-lg p-6 space-y-6 bg-white shadow-sm"
    >
      <h3 className="text-xl font-semibold text-gray-800 tracking-widest">
        Write a Review
      </h3>

      {/* Rating Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Rating *
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl focus:outline-none"
            >
              <span className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating} {rating === 1 ? 'star' : 'stars'}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Review Title *
        </label>
        <input
          type="text"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 text-right">
          {title.length}/100 characters
        </p>
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Detailed Review *
        </label>
        <textarea
          placeholder="Share your experience with this product..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          rows="5"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 text-right">
          {review.length}/1000 characters
        </p>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Upload Photos (Optional)
          </label>
          <span className="text-xs text-gray-500">
            {images.length}/5 images
          </span>
        </div>
        
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            JPEG, PNG, WebP up to 5MB each
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum 5 images
          </p>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {image.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(image.size)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uploading...</span>
              <span className="text-primary font-medium">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg tracking-widest disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
        <p className="mt-3 text-xs text-gray-500 text-center">
          Your review will be visible after approval by our team.
        </p>
      </div>
    </form>
  );
}