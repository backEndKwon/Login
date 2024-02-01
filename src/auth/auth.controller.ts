import { tokens } from './types/token.type';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
//swagger적용하기 위해서는 Api태그, 오퍼레이션, 리스폰스 필요
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginDto, logoutDto, signUpDto } from './dtos/user.dto';
import { userId } from './types/user.type';

@Controller('auth')
//tag = 큰 제목
@ApiTags('AUTH API CHECK')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // api 확인용
  @Get('home')
  //operation = 동작
  @ApiOperation({
    summary: '송수신 확인용 API',
    description: 'GET방식을 보내 반환값을 잘 return하는지 확인',
  })
  //response = 반환값
  @ApiResponse({ description: 'connected success를 반환한다.' })
  check() {
    return this.authService.check();
  }

  //회원가입
  @Post('signUp')
  @ApiOperation({
    summary: '회원가입용 API',
    description:
      '회원가입 하기 위해서 email, password를 받아 가입시키고, 반환값에는 hashedRefreshToken이 null값으로 반환, 표면적으로는 생성된 uuid 반환',
  })
  signUp(@Body() SignUpDto: signUpDto): Promise<userId> {
    return this.authService.signUp(SignUpDto);
  }

  //로그인
  //로그인시 해당 계정이 올바르다면 accessToken과 refreshToken발급
  @Post('login')
  @ApiOperation({
    summary: '사용자 로그인시 accessToken과 refreshToken발급',
    description:
      '사용자 로그인시 email, password확인후 상황에 맞게 결과 값 반환',
  })
  //body값으로 loginDto(email, password)에 맞게 받기
  //반환값은 token을 준다. (추가로 userId까지 주어 사용자 식별, 클라이언츠 측 상태관리에 사용하게 끔 하자)
  login(@Body() LoginDto: loginDto): Promise<userId & tokens> {
    console.log("👉 ~ LoginDto:", LoginDto)
    return this.authService.login(LoginDto)
  }

  //로그아웃
  //로그아웃은 받아온 이메일로 로그아웃을 시키는데 refresh token을 null처리 해준다.
  //로그아웃을 한 후 userId반환으로 필요한 추가동작 하게끔 유도(ex, 로그아웃 성공 표시 등)
  @Post('logout')
  @ApiOperation({
    summary:"사용자 로그아웃시 해당 email을 기반으로 refreshToken null처리후 userId반환",
    description:"summary와 동일"
  }) 
  logout(@Body() LogoutDto: logoutDto):Promise<userId>{
    return this.authService.logout(LogoutDto);
  }
}
