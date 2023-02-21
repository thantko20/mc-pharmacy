const tokenName = 'mc-access-token';

export class MyStorage {
  static getAccessToken() {
    return localStorage.getItem(tokenName);
  }

  static setAccessToken(token: string) {
    localStorage.setItem(tokenName, token);
  }

  static removeAccessToken() {
    localStorage.removeItem(tokenName);
  }
}
