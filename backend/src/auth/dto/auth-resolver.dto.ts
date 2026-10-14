import { IsEmail, Length } from 'class-validator';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDTO {
  @IsEmail() email: string;
  @Length(8, 50) password: string;
}

export class UserWithoutCreds {
  id: number;
  email: string;
  role: Role;
}

export class AuthRO {
  token: string;
  user: UserWithoutCreds;
}

export class UserWithoutCredsRO {
  token: string;
  user: UserWithoutCreds;
}
