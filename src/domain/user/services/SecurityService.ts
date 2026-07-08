export interface SecurityService {
  hash(value: string): Promise<string>;
  generateJwt(userId: number): string;
  verifyToken(token: string): { iat: number; userId: number } | null;
  comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
