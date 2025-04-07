import axios from "axios";
import config from "../config";
import { AlaiTokens } from "../types";

class AuthService {
  private tokens: AlaiTokens | null = null;

  /**
   * Login to Alai and get access/refresh tokens
   */
  async login(): Promise<boolean> {
    try {

      const response = await axios.post(
        `https://eschotthjgljbxjerczn.supabase.co/auth/v1/token?grant_type=password`,
        {
          email: config.alai.email,
          password: config.alai.password,
        },
        {
          headers: {
            apikey: process.env.ALAI_API_KEY!,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data) {
        this.tokens = {
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          lastRefresh: Date.now(),
        };
        console.log(" Successfully logged in to Alai");
        return true;
      } else {
        console.error(" Unexpected response format from Alai login");
        return false;
      }
    } catch (error: any) {
      console.error(" Failed to login to Alai:", error?.response?.data || error.message);
      return false;
    }
  }

  /**
   * Refresh the access token if needed
   */
  async ensureValidToken(): Promise<boolean> {
    if (!this.tokens) {
      return this.login();
    }

    const currentTime = Date.now();
    const needsRefresh = currentTime - this.tokens.lastRefresh > 25 * 60 * 1000;

    if (needsRefresh) {
      try {
        const response = await axios.post(
          `https://eschotthjgljbxjerczn.supabase.co/auth/v1/token?grant_type=refresh_token`,
          {
            refresh_token: this.tokens.refreshToken,
          },
          {
            headers: {
              apikey: process.env.ALAI_API_KEY!,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200 && response.data) {
          this.tokens = {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            lastRefresh: currentTime,
          };
          console.log(" Refreshed Alai access token");
          return true;
        } else {
          console.warn(" Refresh failed, re-logging in...");
          return this.login();
        }
      } catch (error: any) {
        console.error(" Token refresh error, re-logging in:", error?.response?.data || error.message);
        return this.login();
      }
    }

    return true;
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }
}

export default new AuthService();
