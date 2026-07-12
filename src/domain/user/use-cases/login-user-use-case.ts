import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { UserRepository } from "../repositories/UserRepository";
import { SecurityService } from "../services/SecurityService";

interface LoginUserUseCaseInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly securityService: SecurityService;

  constructor(
    userRepository: UserRepository,
    securityService: SecurityService,
  ) {
    this.userRepository = userRepository;
    this.securityService = securityService;
  }

  async execute(input: LoginUserUseCaseInput): Promise<string> {
    const storedUser = await this.userRepository.findByEmail(input.email);

    if (!storedUser) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const validPassword = await this.securityService.comparePasswords(
      input.password,
      storedUser.password,
    );
    if (!validPassword) {
      throw new UnauthorizedError("Invalid credentials.");
    }
    const token = this.securityService.generateJwt(storedUser.id);
    return token;
  }
}
