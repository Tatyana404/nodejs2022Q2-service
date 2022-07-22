export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassowrd: string;
  newPassword: string;
}
