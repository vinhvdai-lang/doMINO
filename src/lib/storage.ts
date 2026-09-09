import { Student, Faculty } from '../types';
import { INITIAL_STUDENTS, INITIAL_FACULTIES } from '../data/initialData';

const STORAGE_KEY = 'vietduc_students_data_v1';
const FACULTY_KEY = 'vietduc_faculties_data_v1';

export function loadStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading students from localStorage:', err);
  }
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to localStorage:', err);
  }
}

export function loadFaculties(): Faculty[] {
  try {
    const data = localStorage.getItem(FACULTY_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading faculties from localStorage:', err);
  }
  return INITIAL_FACULTIES;
}

export function resetToInitialData(): Student[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}
