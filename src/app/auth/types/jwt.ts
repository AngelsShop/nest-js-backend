export type JWTPayload = {
  sub: string;
  username: string;
};

export type JWTValidateResponse = {
  login: string;
  id: string;
};
