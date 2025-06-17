
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import StudentCard from '../components/StudentCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea'; // Added for progress notes
import { PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface StudentsPageProps {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  headingTextColor?: string;
}

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  major: '',
  studentIdNumber: '', // Added
  adminProgressNotes: '', 
};

const StudentsPage: React.FC<StudentsPageProps> = ({ students, addStudent, updateStudent, deleteStudent, headingTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        email: editingStudent.email,
        dateOfBirth: editingStudent.dateOfBirth,
        major: editingStudent.major || '',
        studentIdNumber: editingStudent.studentIdNumber || '', // Added
        adminProgressNotes: editingStudent.adminProgressNotes || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingStudent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      studentIdNumber: formData.studentIdNumber || undefined, // Ensure it's undefined if empty, not ''
    };
    if (editingStudent) {
      updateStudent({ ...editingStudent, ...dataToSave });
    } else {
      addStudent(dataToSave);
    }
    closeModal();
  };

  const openModalForEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData(initialFormData);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.major && student.major.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.studentIdNumber && student.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase())) // Added search by Student ID
  );

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Manage Students</h2>
        <div className="flex gap-2 w-full sm:w-auto">
            <Input 
                id="search-students"
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 !mb-0"
            />
            <Button onClick={openModalForNew} leftIcon={<UserPlusIcon className="h-5 w-5"/>}>
            Add Student
            </Button>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} onDelete={deleteStudent} onEdit={openModalForEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="https://picsum.photos/seed/empty-students/400/300" alt="No students found" className="mx-auto mb-4 rounded-lg shadow-md h-60 w-auto object-cover" />
          <p className="text-xl text-slate-600">No students found.</p>
          {students.length > 0 && searchTerm && <p className="text-sm text-slate-500">Try adjusting your search term.</p>}
          {students.length === 0 && <p className="text-sm text-slate-500">Click "Add Student" to get started.</p>}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStudent ? "Edit Student" : "Add New Student"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="First Name" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          <Input label="Last Name" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          <Input label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          <Input label="Student ID Number (Optional)" id="studentIdNumber" name="studentIdNumber" value={formData.studentIdNumber} onChange={handleInputChange} placeholder="e.g., CUC2024001" />
          <Input label="Date of Birth" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
          <Input label="Major (Optional)" id="major" name="major" value={formData.major} onChange={handleInputChange} />
          <Textarea
            label="Admin Progress Notes (Optional)"
            id="adminProgressNotes"
            name="adminProgressNotes"
            value={formData.adminProgressNotes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter any progress notes for this student..."
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingStudent ? "Save Changes" : "Add Student"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
