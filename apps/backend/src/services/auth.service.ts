import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';
import type { AuthUser, AuthResponse, SignupData, SigninData } from '../types';

class AuthService {
  private createToken(payload: { userId: string; role: string }): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '48h' });
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    // case 1: if user already existed
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      logger.warn(`Signup failed: Username ${data.username} already exists`);
      throw new AppError('Username already exists', 409);
    }

    // Case2: create new user
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
      },
    });

    logger.info(`User created successfully: ${user.username} (${user.role})`);
    // Generate JWT
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = this.createToken({
      userId: user.id,
      role: user.role,
    });
    return {
      token,
      user: authUser,
    };
  }

  async signin(data: SigninData): Promise<AuthResponse> {
    logger.info(`Signin attempt for username: ${data.username}`);

    // Find user
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (!user) {
      logger.warn(`Signin failed: User ${data.username} not found`);
      throw new AppError('Invalid credentials: User not found', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      logger.warn(`Signin failed: Invalid password for ${data.username}`);
      throw new AppError('Invalid credentials: Invalid password', 401);
    }

    logger.info(`User signed in successfully: ${user.username}`);

    // Generate JWT
    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = this.createToken({
      userId: user.id,
      role: user.role,
    });
    return {
      token,
      user: authUser,
    };
  }

  verifyToken(token: string): AuthUser {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AuthUser;
    } catch (error) {
      logger.warn(`Token verification failed: ${(error as Error).message}`);
      throw new AppError('Invalid or expired token', 401);
    }
  }
}

export default new AuthService();
