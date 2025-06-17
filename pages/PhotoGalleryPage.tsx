
import React, { useState, useEffect, useCallback } from 'react';
import { Photo } from '../types';
import PhotoCard from '../components/PhotoCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { PlusIcon, PhotoIcon as PageIcon, CameraIcon } from '@heroicons/react/24/outline'; // Renamed PhotoIcon to PageIcon to avoid conflict
import LoadingSpinner from '../components/LoadingSpinner';

interface PhotoGalleryPageProps {
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'uploadDate'>) => void;
  updatePhoto: (photo: Photo) => void;
  deletePhoto: (photoId: string) => void;
  headingTextColor?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const initialFormData = {
  title: '',
  description: '',
  imageUrl: '',
};

const PhotoGalleryPage: React.FC<PhotoGalleryPageProps> = ({ photos, addPhoto, updatePhoto, deletePhoto, headingTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState<Omit<Photo, 'id' | 'uploadDate'>>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (editingPhoto) {
      setFormData({
        title: editingPhoto.title,
        description: editingPhoto.description || '',
        imageUrl: editingPhoto.imageUrl,
      });
      setSelectedFile(null); // Clear selected file when editing existing photo, image URL is already set
    } else {
      setFormData(initialFormData);
      setSelectedFile(null);
    }
  }, [editingPhoto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Preview image locally (optional)
      // const reader = new FileReader();
      // reader.onload = (event) => setFormData(prev => ({...prev, imageUrl: event.target?.result as string }));
      // reader.readAsDataURL(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
        alert("Photo title is required.");
        return;
    }
    if (!editingPhoto && !selectedFile) {
        alert("Please select an image file to upload.");
        return;
    }

    setIsUploading(true);
    let photoDataToSave = { ...formData };

    if (selectedFile) {
      try {
        const base64Image = await fileToBase64(selectedFile);
        photoDataToSave.imageUrl = base64Image;
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        alert("Failed to process image file. Please try again.");
        setIsUploading(false);
        return;
      }
    }
    
    if (editingPhoto) {
      updatePhoto({ ...editingPhoto, ...photoDataToSave });
    } else {
      addPhoto(photoDataToSave);
    }
    setIsUploading(false);
    closeModal();
  };

  const openModalForEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingPhoto(null);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    setFormData(initialFormData);
    setSelectedFile(null);
  }, []);

  const handleDelete = (photoId: string) => {
    if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      deletePhoto(photoId);
    }
  };
  
  const openViewModal = (photo: Photo) => {
    setViewingPhoto(photo);
    setIsViewModalOpen(true);
  };

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingPhoto(null);
  }, []);


  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>
            <PageIcon className="h-8 w-8 inline-block mr-2 align-text-bottom" />
            Photo Gallery
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            id="search-photos"
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 !mb-0"
          />
          <Button onClick={openModalForNew} leftIcon={<PlusIcon className="h-5 w-5"/>}>
            Add Photo
          </Button>
        </div>
      </div>

      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <PhotoCard 
                key={photo.id} 
                photo={photo} 
                onView={openViewModal}
                onEdit={openModalForEdit} 
                onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <CameraIcon className="h-24 w-24 text-slate-300 mx-auto mb-4" />
          <p className="text-xl text-slate-600">No photos found.</p>
          {photos.length > 0 && searchTerm && <p className="text-sm text-slate-500">Try adjusting your search term.</p>}
          {photos.length === 0 && <p className="text-sm text-slate-500">Click "Add Photo" to upload images to the gallery.</p>}
        </div>
      )}

      {/* Add/Edit Photo Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPhoto ? "Edit Photo Details" : "Add New Photo"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Photo Title *" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          <Textarea label="Description (Optional)" id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
              Image File {!editingPhoto && <span className="text-red-500">*</span>}
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/jpeg, image/png, image/gif, image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-sky-50 file:text-sky-700
                hover:file:bg-sky-100"
            />
            {selectedFile && <p className="text-xs text-slate-500 mt-1">Selected: {selectedFile.name}</p>}
            {editingPhoto && !selectedFile && <p className="text-xs text-slate-500 mt-1">Current image will be kept if no new file is selected.</p>}
          </div>

          {isUploading && <LoadingSpinner size="sm" className="my-2" />}

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isUploading}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isUploading} disabled={isUploading}>
              {editingPhoto ? "Save Changes" : "Add Photo"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Photo Modal (Lightbox style) */}
      {viewingPhoto && (
        <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title={viewingPhoto.title}>
            <div className="space-y-4">
                <img 
                    src={viewingPhoto.imageUrl} 
                    alt={viewingPhoto.title} 
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-md mx-auto shadow-lg" 
                />
                {viewingPhoto.description && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{viewingPhoto.description}</p>
                )}
                <p className="text-xs text-slate-400 text-center">Uploaded: {new Date(viewingPhoto.uploadDate).toLocaleDateString()}</p>
            </div>
             <div className="pt-4 flex justify-end">
                <Button variant="ghost" onClick={closeViewModal}>Close</Button>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default PhotoGalleryPage;
