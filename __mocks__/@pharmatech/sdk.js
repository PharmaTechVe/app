/* global jest */
class PharmaTech {
  constructor() {
    this.auth = {
      login: jest.fn().mockResolvedValue({
        accessToken: 'mock-token',
        user: { id: 1, email: 'test@example.com' },
      }),
    };
  }
}

module.exports = { PharmaTech };
