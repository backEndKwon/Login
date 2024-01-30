/* 
userInput = email, password
UUID = string-string-string-string-string
userId = UUID
 */

export type userInput = {
  email: string;
  password: string;
};

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type userId = {
  id: UUID;
};

//users(임시 데이터베이스:배열)에 저장될 항목은
//userInput, userId, hasedRefreshToken
export type Users = userInput &
  userId & {
    hashedRefreshToken: string | null,
    createdAt : string 
  };
