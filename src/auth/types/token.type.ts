//token은 accessToken과 refreshToken으로 존재
// jwt의 playload도 설정 : email, issuer, type정도

export type tokens = {
  accessToken: string;
  refreshToken: string;
};

export type jwtPayload = {
  email: string;
  issuer: 'test-issuer';
  type: 'ACCESS' | 'REFRESH';
};
