declare module '@pharmatech/sdk' {
  export class PharmaTech {
    constructor(debug?: boolean);
    auth: {
      login: (credentials: {
        email: string;
        password: string;
      }) => Promise<{ accessToken: string }>;
    };
  }
}
