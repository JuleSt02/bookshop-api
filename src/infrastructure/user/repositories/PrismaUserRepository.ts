import { UserRepository } from "../../../domain/user/repositories/UserRepository";
import { RegisterUserUseCaseInput } from "../../../domain/user/use-cases/create-user-use-case";
import { prisma } from "../../prisma-client";
import { User } from "../../../domain/user/User";

export class PrismaUserRepository implements UserRepository {
  private readonly prisma = prisma;

  async create(params: RegisterUserUseCaseInput): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: params.email,
        password: params.password,
      },
    });

    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findById(id:number): Promise<User | null> {
    
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    return user
  }
}
