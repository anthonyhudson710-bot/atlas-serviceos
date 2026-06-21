import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./user.entity";

export interface PublicUser {
  id: string;
  email: string;
  createdAt?: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const normalized = email.trim().toLowerCase();
    const existing = await this.users.findOne({ where: { email: normalized } });
    if (existing) {
      throw new ConflictException("Email already registered");
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.users.save(
      this.users.create({ email: normalized, passwordHash }),
    );
    return this.issueToken(user);
  }

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const normalized = email.trim().toLowerCase();
    const user = await this.users.findOne({ where: { email: normalized } });
    // Compare against a dummy hash when the user is missing to keep timing flat.
    const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.issueToken(user);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  private issueToken(user: User): { token: string; user: PublicUser } {
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email } };
  }
}
