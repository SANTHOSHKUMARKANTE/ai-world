import type {
  AuthenticatePasswordInput,
  AuthenticatePasswordResult,
} from './authenticate-password';
import type { CreateSessionInput, CreateSessionResult } from '../session/create-session';

interface PasswordAuthenticator {
  execute(input: AuthenticatePasswordInput): Promise<AuthenticatePasswordResult>;
}

interface SessionCreator {
  execute(input: CreateSessionInput): Promise<CreateSessionResult>;
}

export interface SignInWithPasswordInput {
  readonly email: string;
  readonly password: string;
}

export interface SignInWithPasswordResult {
  readonly actorId: string;
  readonly token: string;
  readonly expiresAt: Date;
}

export class SignInWithPassword {
  constructor(
    private readonly authenticatePassword: PasswordAuthenticator,
    private readonly createSession: SessionCreator,
  ) {}

  async execute(input: SignInWithPasswordInput): Promise<SignInWithPasswordResult> {
    const authentication = await this.authenticatePassword.execute(input);

    const session = await this.createSession.execute({
      actorId: authentication.actorId,
    });

    return {
      actorId: authentication.actorId,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }
}
