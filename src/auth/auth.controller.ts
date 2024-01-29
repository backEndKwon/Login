import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    // api 확인용
    @Get('home')
    check() {
        return this.authService.check(); // Assuming you have a method named 'check' in your AuthService
    }
    

}
