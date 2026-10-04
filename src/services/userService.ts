import { db, delay } from './client';
import type { Student } from '@/types';

export async function getStudents(): Promise<Student[]> {
  return delay(db.students);
}

export async function getProfile(id: string): Promise<Student | undefined> {
  return delay(db.students.find((s) => s.id === id));
}

export async function searchStudents(query: string): Promise<Student[]> {
  const q = query.trim().toLowerCase();
  if (!q) return delay(db.students);
  return delay(
    db.students.filter((s) =>
      `${s.name} ${s.major} ${s.skills.join(' ')}`.toLowerCase().includes(q),
    ),
  );
}

export async function toggleLookingForTeam(id: string, value: boolean): Promise<Student | undefined> {
  const student = db.students.find((s) => s.id === id);
  if (student) student.lookingForTeam = value;
  return delay(student);
}

export async function claimProfile(id: string): Promise<Student | undefined> {
  const student = db.students.find((s) => s.id === id);
  if (student) student.claimed = true;
  return delay(student);
}
