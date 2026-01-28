import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../users/user.schema.js';
import { UsersService } from '../users/users.service.js';

export interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    user: { id: string; email: string; name: string; role: string };
    access_token: string;
  }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, sub: user._id.toString(), role: user.role };
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{
    user: { id: string; email: string; name: string; role: string };
    access_token: string;
  }> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const newUser = await this.usersService.createUser(email, password, name);
    const payload: JwtPayload = {
      email: newUser.email,
      sub: newUser._id.toString(),
      role: newUser.role,
    };
    return {
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findById(userId);
    if (!user) return null;

    const result = user.toObject();
    delete (result as { password?: string }).password;
    return result as Omit<User, 'password'>;
  }
}
