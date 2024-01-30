import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { signUpDto } from './dtos/user.dto';
import { Users, userId } from './types/user.type';
import * as argon from 'argon2';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  //임시의 database 생성
  private readonly users: Users[] = [];

  async check() {
    return 'connected success';
  }

  async signUp(SignUpDto: signUpDto): Promise<userId> {
    //해당 email 중복검사
    const isUser = this.users.find((user) => user.email === SignUpDto.email);
    if (isUser) {
      throw new HttpException('이미 가입한 메일입니다.', HttpStatus.CONFLICT);
    } // 추후 error handling 필요

    //1) 비밀번호 hash후 저장(여기서는 임시 배열 사용중이니 create와 save대신 push로 저장하기)
    //2) uuid 발행
    //3) 계정 생성시간
    const hashedPassword = await argon.hash(SignUpDto.password);
    const id = randomUUID();
    const createdAt = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Seoul',
    });
    this.users.push({
      id,
      email: SignUpDto.email,
      password: hashedPassword,
      hashedRefreshToken: null, //null상태에서 로그인시 refreshToken발급예정
      createdAt: createdAt,
    });
    console.log('👉 ~ check:', hashedPassword, createdAt);
    console.log(this.users)
    console.log('Memory Usage:', process.memoryUsage()); 
    //heap 메모리 할당 부분을 보면 됨

    return { id };
  }
}
