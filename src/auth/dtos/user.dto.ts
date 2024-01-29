/* 
controller단 입출시 데이터 유효성 검사
swagger 및 회원가입, 로그인, 로그아웃, Token 등 에 대한 dto 정의 
*/

import { ApiProperty } from '@nestjs/swagger';
import { UUID } from '../types/user.type';

//회원가입dto
export class signUpDto {}

//로그인dto
export class loginDto {}

//로그아웃dto
export class logoutDto {}
