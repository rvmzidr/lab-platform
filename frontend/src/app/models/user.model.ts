// User Model
// TypeScript interface matching backend User model exactly
// Used for type safety throughout frontend application

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  role: UserRole;  // Enum controlling access to resources
  createdAt?: Date;
  updatedAt?: Date;
}

// User Role Enum
// Matches backend role values exactly
export enum UserRole {
  ADMIN = 'admin',              // LabHead from UML - full access to all resources
  MEMBER = 'member'             // Limited access to assigned resources
}

// Login Request Interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Login Response Interface
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Signup Request Interface
export interface SignupRequest {
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  password: string;
  role?: UserRole;  // Optional, defaults to 'member' on backend
}

// Signup Response Interface
export interface SignupResponse {
  success: boolean;
  message: string;
  data: User;
}
