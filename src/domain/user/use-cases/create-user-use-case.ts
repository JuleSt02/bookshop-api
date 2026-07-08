import { UserRepository } from "../repositories/UserRepository";
import { SecurityService } from "../services/SecurityService";
import { User } from "../User";
import { BusinessConflictError } from "../../errors/BusinessConflictError";
import { BadSyntaxError } from "../../errors/BadSyntaxError";
import { passwordValidator, emaiLValidator } from "../utils/validators";

export interface RegisterUserUseCaseInput {
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService,
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: RegisterUserUseCaseInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new BusinessConflictError("A user with this email already exists.");
    }

    const validatedEmail = emaiLValidator(input.email);
    const validatedPassword = passwordValidator(input.password);

    if (!validatedEmail) {
      throw new BadSyntaxError("Invalid email.");
    }

    if (!validatedPassword) {
      throw new BadSyntaxError("Invalid password.");
    } else {
      const hashedPassword = await this.securityService.hash(input.email);
      const newUser = await this.userRepository.create({
        ...input,
        password: hashedPassword,
      });

      return newUser;
    }
  }
}
