import { SecurityService } from "../../domain/user/services/SecurityService";
import bcrypt from "bcrypt";
import { environmentService } from "../EnvironmentService";
import jwt from "jsonwebtoken";

export class SecuritityServiceImplementation implements SecurityService {
  private readonly SECRET_KEY: string;

  constructor() {
    this.SECRET_KEY = environmentService.get().JWT_SECRET;
  }

  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value, salt);

    return hashedPassword;
  }
  verifyToken(token: string): { iat: number; userId: number } | null {
    try {
      //.verifiy calculates signature using payload, header + secret-key if signature === received tokens signature = authenticated
      const decodedToken = jwt.verify(token, this.SECRET_KEY);
      //userId travels inside the token payload, iat (added by JWT-lib) return  so our app knows users "identity" without further querying database
      return decodedToken as { iat: number; userId: number };
    } catch {
      //the error doesn´t matter in this layer
      return null; //simple return --> undefined, return null communicates clearly absence of value after search
    }
  }

  generateJwt(userId: number): string {
    const token = jwt.sign({ userId }, this.SECRET_KEY);
    return token;
  }

  comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
