import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly client: InstanceType<typeof google.auth.OAuth2>;

  constructor(private readonly config: ConfigService) {
    this.client = new google.auth.OAuth2(
      this.config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      this.config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      this.config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  getAuthorizationUrl(state?: string) {
    return this.client.generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
    });
  }

  async getUser(code: string) {
    const { tokens } = await this.client.getToken(code);

    this.client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    return {
      googleId: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  }
}
