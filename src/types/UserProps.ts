export type UserResponseProps = {
  id: string;
  username: String;
  email?: string;
  role: String;
  avatarUrl?: string;
  coverUrl?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface CredentialsProps {
  id: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export interface JobSeekerProps {
  id?: string;
  username: string;
  password: string;
  email?: string;
  role: String;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  gender: string;
  dob: string;
}

export interface RecruiterProps {
  id?: string;
  username: string;
  password: string;
  email?: string;
  role: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  companyName: string;
  description: string;
  phone: string;
  address: string;
}

export type ExpertProps = {
  id?: string;
  username: string;
  password: string;
  email?: string;
  role: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
