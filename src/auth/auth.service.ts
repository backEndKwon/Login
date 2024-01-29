import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async check() {
    return 'connected success';
  }
}
