import { supabase } from '@/config/supabase.js';
import { oauth2Client } from '@/config/google.js';
import type { OAuth2Client } from 'google-auth-library';
import { User } from '@supabase/supabase-js';

export default class AuthService {
  private oauth2Client: OAuth2Client
  private user?: User

  constructor() {
    this.oauth2Client = oauth2Client
  }

  setUser(user: User) {
    this.user = user
    return this
  }

  async generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ]
    })
  }

  async refreshTokensIfNeeded() {
    if (!this.user) throw new Error('User not set');

    // Get stored tokens
    const { data: userData } = await supabase
      .from('user_oauth_data')
      .select('*')
      .eq('id', this.user?.id)
      .single();

    if (!userData) throw new Error('User oauth data not found');

    // Check if token needs refresh
    if (new Date(userData.token_expiry) <= new Date()) {
      this.oauth2Client.setCredentials({
        refresh_token: userData.refresh_token
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

      // Update stored tokens
      await supabase
        .from('user_oauth_data')
        .update({
          access_token: credentials.access_token,
          token_expiry: new Date(credentials.expiry_date!)
        })

      return credentials;
    }

    return {
      access_token: userData.access_token,
      refresh_token: userData.refresh_token
    };
  }

  async signOut() {
    if (!this.user) throw new Error('User not set');

    const { data: userData } = await supabase
      .from('user_oauth_data')
      .select('*')
      .eq('id', this.user.id)
      .single()

    if (!userData) throw new Error('User not found');

    // sign out from supabase
    await supabase.auth.admin.signOut(userData.access_token!)

    // clear oauth data
    const { error: oauthError } = await supabase
      .from('user_oauth_data')
      .delete()
      .eq('id', userData.id)
    if (oauthError) {
      console.error('Error clearing OAuth data:', oauthError);
      // Continue with logout even if this fails
    }

  }


  async handleGoogleCallback(code: string) {
    // 1. Get tokens from Google
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const userinfo = await this.oauth2Client.getTokenInfo(tokens.access_token!);
    console.log('userinfo', JSON.stringify(userinfo, null, 2))

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userinfo.email!,
      email_verified: true,
      provider: 'google'
    });

    //Handle user already exists
    if (authError) {
      console.error('User already exists, login in with google:', authError);
      const { data, error: sessionError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: tokens.id_token!,
        access_token: tokens.access_token
      });

      console.log('data from supabase sign in with google', data)

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        throw sessionError;
      }

      const { error: tokenError } = await supabase
        .from('user_oauth_data')
        .upsert({
          id: data!.user.id,
          email: userinfo.email,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: new Date(tokens.expiry_date!)
        });

      if (tokenError) {
        console.error('Error storing tokens:', tokenError);
      }
      return data?.session;
    }

    const { error: tokenError } = await supabase
      .from('user_oauth_data')
      .upsert({
        id: authData!.user.id,
        email: userinfo.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date!)
      });

    const { data, error: sessionError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.id_token!,
      access_token: tokens.access_token
    });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      throw sessionError;
    }

    return data?.session;
  }

  async getUserSettings() {
    if (!this.user) throw new Error('User not set');

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', this.user.id)

    if (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
    return data;
  }


}
