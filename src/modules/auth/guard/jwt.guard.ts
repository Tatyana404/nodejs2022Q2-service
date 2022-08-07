import { AuthGuard } from '@nestjs/passport';

export class JwtGward extends AuthGuard('jwtAccess') {
  constructor() {
    super();
  }
}
