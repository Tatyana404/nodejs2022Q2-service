export interface Jwt {
  accessToken: string;
  refreshToken: string;
}

export interface Payload {
  userId: string;
  login: string;
  iat?: number;
  exp?: number;
}

export interface RefreshToken {
  refreshToken: string;
}
