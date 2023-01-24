import { SessionToken, TokenStore } from "@wppconnect-team/wppconnect/dist/token-store";

// TODO: Implement this if you want to use a bucket to store the session tokens
export class BucketSessionStore implements TokenStore<SessionToken> {
  getToken(sessionName: string): SessionToken | Promise<SessionToken> {
    console.log(`Getting token for session ${sessionName}`);
    return {
      WABrowserId: "MultiDevice",
      WASecretBundle: "MultiDevice",
      WAToken1: "MultiDevice",
      WAToken2: "MultiDevice",
    };
  }
  setToken(sessionName: string, tokenData: SessionToken): boolean | Promise<boolean> {
    console.log(`Setting token for session ${sessionName}`);
    console.log(tokenData);
    return true;
  }
  removeToken(sessionName: string): boolean | Promise<boolean> {
    console.log(`Removing token for session ${sessionName}`);
    return true;
  }
  listTokens(): string[] | Promise<string[]> {
    console.log("Listing tokens");
    return [];
  }

}