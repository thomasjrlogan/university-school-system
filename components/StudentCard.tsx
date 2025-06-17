
import React from 'react';
import { Student } from '../types';
import Button from './Button';
import { UserIcon, CakeIcon, AcademicCapIcon, TrashIcon, PencilIcon, ChatBubbleBottomCenterTextIcon, IdentificationIcon } from '@heroicons/react/24/outline';


interface StudentCardProps {
  student: Student;
  onDelete: (studentId: string) => void;
  onEdit: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center mb-3">
          <UserIcon className="h-8 w-8 text-sky-600 mr-3" />
          <h3 className="text-xl font-semibold text-sky-700">{student.firstName} {student.lastName}</h3>
        </div>
        {student.studentIdNumber && (
          <p className="text-sm text-slate-600 mb-2">
            <IdentificationIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
            <span className="font-medium text-slate-700">ID:</span> {student.studentIdNumber}
          </p>
        )}
        <p className="text-sm text-slate-600 mb-2 break-all">
          <span className="font-medium text-slate-700">Email:</span> {student.email}
        </p>
        <p className="text-sm text-slate-600 mb-2">
          <CakeIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
          <span className="font-medium text-slate-700">DOB:</span> {student.dateOfBirth}
        </p>
        {student.major && (
          <p className="text-sm text-slate-600 mb-2">
            <AcademicCapIcon className="h-4 w-4 inline-block mr-1 text-slate-500" />
            <span className="font-medium text-slate-700">Major:</span> {student.major}
          </p>
        )}
        {student.adminProgressNotes && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-4 w-4 inline-block mr-1 text-blue-500" />
              Admin Notes:
            </p>
            <p className="text-xs text-slate-600 italic bg-blue-50 p-2 rounded-md whitespace-pre-wrap">
              {student.adminProgressNotes}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end space-x-2 border-t pt-4 border-slate-100">
        <Button variant="ghost" size="sm" onClick={() => onEdit(student)} leftIcon={<PencilIcon className="h-4 w-4" />}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(student.id)} leftIcon={<TrashIcon className="h-4 w-4" />}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;
