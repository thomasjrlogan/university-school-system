
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  major?: string;
  studentIdNumber?: string; // Added Student ID Number
  adminProgressNotes?: string; // Added for admin-editable progress notes
}

export interface Course {
  id: string;
  title: string;
  code: string; // e.g., CS101
  description: string;
  credits: number;
  department?: string;
  coverImageUrl?: string; // Optional: Base64 data URL or external URL
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string; // ISO date string
  grade?: string; // e.g., A, B+, C
}

export interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  coursesTaught?: string[]; // Array of course IDs
}

export enum Page {
  Dashboard = 'Dashboard',
  Students = 'Students',
  Courses = 'Courses',
  Enrollments = 'Enrollments',
  Gallery = 'Photo Gallery', // Added Gallery
  Applications = 'Applications',
  Settings = 'Settings',
  Results = 'Results',
  LecturerDashboard = 'Lecturer Dashboard',
  StudentDashboard = 'Student Dashboard',
  UserManagement = 'User Management', // Added for Admin Dashboard link
}

export interface UploadedFile {
  fileName: string;
  fileType: string;
  fileData: string; // Base64 data URL
}

export interface StudentApplication {
  id: string;
  fullName: string;
  email: string;
  alternativeEmail?: string; // Added alternative email
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  programOfInterest: string;
  selectedCourseId?: string; // Optional: For specific first course choice
  previousSchool: string;
  personalStatement: string;
  passportPhoto?: UploadedFile; 
  academicTranscripts?: UploadedFile;
  recommendationLetter?: UploadedFile; 
  applicationDate: string; // ISO date string
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

export interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  alternativeEmail?: string; // Added alternative email
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  highestQualification: string;
  yearsOfExperience: number;
  subjectsSpecialization: string;
  coverLetter: string;
  passportPhoto?: UploadedFile; 
  cvResume?: UploadedFile;
  academicCertificates?: UploadedFile;
  applicationDate: string; // ISO date string
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

export interface AppSettings {
  appName: string;
  collegeAddress: string;
  collegePhone: string;
  collegeLogo?: string; // Base64 data URL for the logo
  collegeWhatsApp?: string; // WhatsApp number
  applicationFee?: number;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;

  // Theme & Appearance
  primaryColor?: string; // e.g., 'sky-600', 'indigo-500', '#RRGGBB'
  contentBackgroundTheme?: string; // e.g., 'slate-100', 'white'
  mainTextColor?: string; // e.g., 'text-slate-700', '#333333'
  headingTextColor?: string; // e.g., 'text-slate-800', '#111111'
  fontFamily?: string; // e.g., 'font-sans', 'font-serif'

  // Email Configuration
  smtpServer?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string; 
  smtpFromEmail?: string;

  // SMS Configuration
  smsApiUrl?: string;
  smsApiKey?: string; 
  smsSenderId?: string;

  // Admin Profile Settings
  adminUsername: string;
  adminEmail?: string;
  adminPassword?: string; // Stored in clear text in localStorage for demo - NOT SECURE
}

export interface StudentResultInfo {
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade?: string;
  enrollmentDate: string;
}

export type CalendarEventType = 'Holiday' | 'Exam' | 'Event' | 'Deadline' | 'Registration';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  description?: string;
  type: CalendarEventType;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  author: string; // e.g., "Admin"
}

export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string; // Base64 data URL
  uploadDate: string; // ISO date string
}
