declare module '@pharmatech/sdk' {
  export class PharmaTech {
    constructor(debug?: boolean);
    auth: {
      changePassword(arg0: {
        currentPassword: string;
        newPassword: string;
      }): unknown;
      login: (credentials: {
        email: string;
        password: string;
      }) => Promise<{ accessToken: string }>;
    };
  }
}
