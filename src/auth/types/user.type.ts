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
