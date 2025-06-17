
import React from 'react';
import { Photo } from '../types';
import Button from './Button';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface PhotoCardProps {
  photo: Photo;
  onView: (photo: Photo) => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photoId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onView, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full group transition-all duration-300 ease-in-out hover:shadow-2xl">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          onClick={() => onView(photo)}
          loading="lazy"
        />
        <div 
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            onClick={() => onView(photo)}
        >
            <EyeIcon className="h-12 w-12 text-white opacity-80" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-sky-700 truncate" title={photo.title}>{photo.title}</h3>
        {photo.description && (
          <p className="text-xs text-slate-500 mt-1 mb-2 h-10 overflow-hidden text-ellipsis line-clamp-2" title={photo.description}>
            {photo.description}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-auto pt-1">Uploaded: {formatDate(photo.uploadDate)}</p>
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(photo)} leftIcon={<PencilIcon className="h-4 w-4" aria-hidden="true" />} aria-label={`Edit ${photo.title}`}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(photo.id)} leftIcon={<TrashIcon className="h-4 w-4" aria-hidden="true" />} aria-label={`Delete ${photo.title}`}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PhotoCard;
