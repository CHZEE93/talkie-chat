export interface User {
  id: string;
  email: string;
  displayName: string;
  color: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
} 