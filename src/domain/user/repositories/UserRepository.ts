import { RegisterUserUseCaseInput } from "../use-cases/create-user-use-case";
import { User } from "../User";

export interface UserRepository {
  create: (params: RegisterUserUseCaseInput) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  findById:(id:number) => Promise<User | null>
}
