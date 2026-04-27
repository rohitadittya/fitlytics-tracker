export enum UserRole {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN"
};

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other"
};

export type User = {
  id: number,
  name: string,
  email: string,
  password: string,
  age: number,
  gender: Gender,
  height: number,
  weight: number,
  image: string,
  role: UserRole,
  createdAt: string,
  updatedAt: string,
  isDefaultUser: boolean
};

export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  image: string;
  role: UserRole;
};

export type UpdateUserDTO = {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  gender?: Gender;
  height?: number;
  weight?: number;
  image?: string;
  role?: UserRole;
};

export type SafeUser = Omit<User, "password">;
export type AuthResponse = {
  user: SafeUser,
  token: string
};
