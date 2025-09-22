export interface User {
  id: string;
  username?: string;
  email: string;
  google_id?: string;
  auth_method: 'email' | 'google';
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

