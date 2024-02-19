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
import * as validator from 'validator';
import { ERROR_MESSAGES } from '../common/exceptions/errorMessage';

const JWT_SECRET_KEY = '123QWE!@#';

@Injectable()
export class AuthService {
  //임시의 database 생성
  private readonly users: Users[] = [];
  //jwtservice는 주입시켜서 사용해야함
  constructor(private readonly jwtService: JwtService) {}

  //모든계정 리스트
  async userList(): Promise<Users[] | string> {
    const today = new Date()
    return this.users.length === 0 ? `(cicd최종확인)_${today})가입된 계정이 없습니다.` : this.users;
  }

  async signUp(SignUpDto: signUpDto): Promise<userId> {
    /* 
    이메일 유효성 검사 
    RFC5322호환 정규식 사용(이메일 주소의 99.99% 검증 가능하다고 함)
    참고: http://emailregex.com/ 
    */
    // const regexEmail = new RegExp(
    //   "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])",
    // );
    // const isPassedEmail = regexEmail.test(SignUpDto.email);
    if (!validator.isEmail(SignUpDto.email))
      throw new HttpException(
        ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
        HttpStatus.BAD_REQUEST,
      );

    /* 
      비밀번호 유효성 검사
      조건: 8자 이상, 최소 하나 이상 대문자 알파벳, 소문자 알파벳, 숫자, 특수문자
      문자 숫자 또는 특수문자이외에 다른 문자는 허용 안됨
    */

    const regexPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!regexPassword.test(SignUpDto.password))
      throw new HttpException(
        ERROR_MESSAGES.INVALID_PASSWORD_FORMAT,
        HttpStatus.BAD_REQUEST,
      );
    //해당 email 중복검사
    const isUser = this.users.find((user) => user.email === SignUpDto.email);
    if (isUser)
      throw new HttpException(
        ERROR_MESSAGES.EMAIL_ALREADY_EXIST,
        HttpStatus.CONFLICT,
      );

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
    // 해당 유저가 존재하지 않을 경우
    // (1)email검사, (2)password검사
    const isUser = this.users.find((user) => user.email === loginDto.email);

    if (!isUser)
      throw new HttpException(
        ERROR_MESSAGES.USER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    //password는 isUser의 password와 입력받은 password 를 검사
    // 해당 password Validate는 따로 validation폴더로 관리
    const isValidPassword = await validatePassword(
      isUser.password,
      loginDto.password,
    );
    if (!isValidPassword)
      throw new HttpException(
        ERROR_MESSAGES.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );

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
    try {
      const { email, id, hashedRefreshToken } = this.users.find(
        (user) => user.email === LogoutDto.email,
      );
      // console.log(id)
      // refreshToken을 null로 만들어주기
      this.hashedRefreshToken(email, null);
      // 로그아웃 두번 해보면 hashedRefreshToken이 null로 바뀌어있음을 알 수 있다.
      // console.log(hashedRefreshToken)
      return { id };
    } catch (error) {
      throw new HttpException(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reissueRefreshToken(
    ReissueRefreshToken: reissueRefreshToken,
  ): Promise<tokens> {
    const { userId, refreshToken } = ReissueRefreshToken;
    const isUser = this.users.find((user) => user.id === userId);
    if (!isUser || !refreshToken) {
      throw new HttpException(
        ERROR_MESSAGES.REFRESHTOKEN_USER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    //그게 아니라면 hashed된 refreshtoken과 같은지 유효성 확인
    const isValid = await argon.verify(isUser.hashedRefreshToken, refreshToken);
    if (!isValid)
      throw new HttpException(
        ERROR_MESSAGES.WRONG_REFRESHTOKEN,
        HttpStatus.BAD_REQUEST,
      );
    // jwt service로 추가 확실한 증명 확인

    const check = this.jwtService.verify(refreshToken, {
      secret: JWT_SECRET_KEY,
    });
    //로그아웃
    // await this.logout({ email: isUser.email });
    // throw new UnauthorizedException('222올바르지 않은 refreshToken입니다.');
    //token 재 생성 후 hash한 token으로 update해줘야됨
    const newToken = await this.generateTokens(isUser.email);
    await this.hashedRefreshToken(isUser.email, newToken.refreshToken);
    return newToken;
  }
}
