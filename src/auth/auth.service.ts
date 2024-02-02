import {
  HttpException,
  HttpStatus,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  signUpDto,
  loginDto,
  logoutDto,
  reissueRefreshToken,
} from './dtos/user.dto';
import { Users, userId } from './types/user.type';
import * as argon from 'argon2';
import { randomUUID } from 'crypto';
import { jwtPayload, tokens } from './types/token.type';
import { validatePassword } from './validations.ts/password-validation';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'rxjs';

const JWT_SECRET_KEY = '123QWE!@#';

@Injectable()
export class AuthService {
  //임시의 database 생성
  private readonly users: Users[] = [];
  //jwtservice는 주입시켜서 사용해야함
  constructor(private readonly jwtService: JwtService) {}

  async check() {
    return this.users;
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
    // console.log('Memory Usage:', process.memoryUsage());
    //heap 메모리 할당 부분을 보면 됨

    return { id };
  }

  // 로그인시 loginDto.email이 있는지 확인
  // 해당 계정이 있다면 access와 refresh 토큰, 해당userid 반환
  async login(loginDto: loginDto): Promise<userId & tokens> {
    console.log(`login service 진입`);
    // 해당 유저가 존재하지 않을 경우
    // (1)email검사, (2)password검사
    const isUser = this.users.find((user) => user.email === loginDto.email);

    if (!isUser)
      throw new UnauthorizedException('해당 유저는 존재하지 않습니다.');
    //password는 isUser의 password와 입력받은 password 를 검사
    // 해당 password Validate는 따로 validation폴더로 관리
    const isValidPassword = await validatePassword(
      isUser.password,
      loginDto.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('비밀번호가틀립니다.');

    //해당 유저가 존재할 경우
    // email을 기반으로 Token 발행을 위한 generateToken 함수 필요
    const tokens = await this.generateTokens(loginDto.email);
    //여기서 한단계 더 나아가서 만약 refreshToken이 null이라면 그냥 null값
    // 그게 아니라면 refreshToken까지도 hash시켜버려서 더욱 안전하게 가자
    await this.hashedRefreshToken(loginDto.email, tokens.refreshToken);

    return { ...tokens, id: isUser.id };
  }

  //refreshToken이 로그인 과정에서 만료되었었으면 null일 수도 있으니까
  async hashedRefreshToken(
    email: string,
    refreshToken: string | null,
  ): Promise<void> {
    console.log('this.hashedRefreshToken 진입');
    //만약 받아온 refreshToken이 null이면? isUser의 hash된 리플레시토큰을 null로 바꿔준다.
    const isUser = this.users.find((user) => user.email === email);
    if (refreshToken === null) {
      isUser.hashedRefreshToken = null;
      return; //끝내기
    }
    //그게아니라면 hash시키기
    isUser.hashedRefreshToken = await argon.hash(refreshToken);
  }

  //email을 가지고 access와 refresh 토큰 찍어내기
  async generateTokens(email: string): Promise<tokens> {
    const accessTokenPayload: jwtPayload = {
      email,
      issuer: 'test-issuer',
      type: 'ACCESS',
    };
    const refreshTokenPayload: jwtPayload = {
      email,
      issuer: 'test-issuer',
      type: 'REFRESH',
    };

    //해당객체를 JWT SERVICE에 의해 각각 만들어지게끔 세팅
    //그럴려먼, JwtService 라이브러리 import

    //스프레드문법과 promise.all을 이용해서return
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: JWT_SECRET_KEY,
        expiresIn: '5m', //5분
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: JWT_SECRET_KEY,
        expiresIn: '5d', //5일
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async logout(LogoutDto: logoutDto): Promise<userId> {
    const { email, id, hashedRefreshToken } = this.users.find(
      (user) => user.email === LogoutDto.email,
    );
    // console.log(id)
    // refreshToken을 null로 만들어주기
    this.hashedRefreshToken(email, null);
    // 로그아웃 두번 해보면 hashedRefreshToken이 null로 바뀌어있음을 알 수 있다.
    // console.log(hashedRefreshToken)
    return { id };
  }

  async reissueRefreshToken(
    ReissueRefreshToken: reissueRefreshToken,
  ): Promise<tokens> {
    const { userId, refreshToken } = ReissueRefreshToken;
    const isUser = this.users.find((user) => user.id === userId);
    if (!isUser || !refreshToken) {
      throw new UnauthorizedException(
        'refreshtoken이 없거나 존재하지 않는 userId입니다.',
      );
    }
    //그게 아니라면 hashed된 refreshtoken과 같은지 유효성 확인
    const isValid = await argon.verify(isUser.hashedRefreshToken, refreshToken);
    console.log(
      '👉 ~ isUser.hashedRefreshToken, refreshToken:',
      isUser.hashedRefreshToken,
      refreshToken,
    );
    console.log('👉 ~ isValid:', isValid);
    if (!isValid)
      throw new UnauthorizedException('111올바르지 않은 refreshToken입니다.');
    // jwt service로 추가 확실한 증명 확인

    const check = this.jwtService.verify(refreshToken, {
      secret: JWT_SECRET_KEY,
    });
    console.log('👉 ~ check:', check);
    //로그아웃
    // await this.logout({ email: isUser.email });
    // throw new UnauthorizedException('222올바르지 않은 refreshToken입니다.');
    //token 재 생성 후 hash한 token으로 update해줘야됨
    const newToken = await this.generateTokens(isUser.email);
    console.log("👉 ~ newToken:", newToken)
    await this.hashedRefreshToken(isUser.email, newToken.refreshToken);
    return newToken;
  }
}
