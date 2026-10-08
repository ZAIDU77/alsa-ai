import { supabase } from "@/integrations/supabase/client";

type OAuthProvider = "google";

interface OAuthOptions {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
}

interface OAuthResult {
  redirected: boolean;
  error?: Error;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}

export const lovableAuth = {
  async signInWithOAuth(
    provider: OAuthProvider,
    options: OAuthOptions = {},
  ): Promise<OAuthResult> {
    try {
      const redirectTo =
        options.redirect_uri ||
        `${window.location.origin}/auth`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: options.extraParams,
        },
      });

      if (error) {
        return {
          redirected: false,
          error,
        };
      }

      if (data?.url) {
        window.location.href = data.url;

        return {
          redirected: true,
        };
      }

      return {
        redirected: false,
        error: new Error("OAuth redirect URL was not returned."),
      };
    } catch (error) {
      return {
        redirected: false,
        error:
          error instanceof Error
            ? error
            : new Error("Google sign-in failed."),
      };
    }
  },
};