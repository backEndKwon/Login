/* 
controller단 입출시 데이터 유효성 검사
swagger 및 회원가입, 로그인, 로그아웃, Token 등 에 대한 dto 정의 
*/

import { ApiProperty } from '@nestjs/swagger';
import { UUID } from '../types/user.type';

//회원가입dto
export class signUpDto {
  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  password: string;

  //회원가입 하면서 refreshToken을 발급 =>
  //타입은 string이 될수도 null 일수도 undefined가 될수도?
  //
  hashedRefreshToken?: string | null | undefined;
}

//로그인dto
export class loginDto {
  //이메일, 비밀번호, token까지
  @ApiProperty({ description: '이메일' })
  email: string;
  @ApiProperty({ description: '비밀번호' })
  password: string;

  // 토큰은 있을 수도 없을 수도 이상할 수도
  //회원가입시 NULL, 로그인시 상황에 맞게 hashedRefreshToken 반환
  hashedRefreshToken?: string | null | undefined;
}

//로그아웃dto
export class logoutDto {
  //로그인 되어있는 상황에서 로그아웃 하는 거니까 email만 체크
  @ApiProperty({ description: '이메일' })
  email: string;
}
