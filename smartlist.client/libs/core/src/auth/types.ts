export type IAuthResponse = {
  token: string;
  user: IUser
}

export type IUser = {
  userId: string;
  userName: string;
  email: string;
  phoneNumber: string;
};
