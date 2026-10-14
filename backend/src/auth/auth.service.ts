import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRO, Role, UserWithoutCreds, UserWithoutCredsRO } from './dto';

@Injectable()
export class AuthService {
  private readonly users: {
    id: number;
    email: string;
    password: string;
    role: Role;
  }[] = [
    {
      id: 1,
      email: 'test@gmail.com',
      password: '1',
      role: Role.USER,
    },
  ];

  constructor(private jwt: JwtService) {}

  async login(email: string, password: string): Promise<AuthRO> {
    const user = this.users.find((u) => u.email === email);
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Invalid password');

    const jwtToken = await this.jwtSign({
      userId: user.id,
      sub: user.email,
      email: user.email,
      role: user.role,
    });

    return { token: jwtToken, user: user as UserWithoutCreds };
  }

  async refreshToken(userId: number): Promise<UserWithoutCredsRO> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const jwtToken = await this.jwtSign({
      userId: user.id,
      sub: user.email,
      email: user.email,
      role: user.role,
    });
    return { token: jwtToken, user: user as UserWithoutCreds };
  }

  me(userId: number): UserWithoutCreds {
    if (!userId) throw new Error('User not found');
    const user = this.users.find((u) => u.id === userId);
    return user;
  }

  logout(userId: number): boolean {
    if (!userId) throw new Error('User not found');
    return true;
  }

  private async jwtSign(payload: {
    userId: number;
    email: string;
    role: string;
    sub: string;
  }): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}
