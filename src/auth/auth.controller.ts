import { tokens } from './types/token.type';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
//swagger적용하기 위해서는 Api태그, 오퍼레이션, 리스폰스 필요
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginDto, logoutDto, signUpDto, reissueRefreshToken } from './dtos/user.dto';
import { userId } from './types/user.type';

@Controller('auth')
//tag = 큰 제목
@ApiTags('AUTH API CHECK')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 등록된 계정들 확인용
  @Get('home')
  //operation = 동작
  @ApiOperation({
    summary: '등록된 임시계정들 확인용(송수신 확인용 API)',
    description: 'get방식 확인용 api',
  })
  //response = 반환값
  check() {
    return this.authService.userList();
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

//refreshToken reissue해주기
//access는 일회용이라 발급 x
//새로운 token발급 해줘야하니 Promise에 token
@Post('refresh')
@ApiOperation({
summary:"refreshToken 재발급 해주기",
description:"사용자가 id로 refresh 요청시 refreshToken재발급해주기"
})
reissueRefreshToken(@Body() ReissueRefreshToken:reissueRefreshToken):Promise<tokens>{
  return this.authService.reissueRefreshToken(ReissueRefreshToken);

}

}
