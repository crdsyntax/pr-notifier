import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { catchError } from "rxjs/operators";

interface LarkAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class LarkService {
  private readonly logger = new Logger(LarkService.name);
  private accessToken: string;
  private tokenExpiry: Date;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const appId = this.configService.get<string>("LARK_APP_ID");
    const appSecret = this.configService.get<string>("LARK_APP_SECRET");

    try {
      const response = await lastValueFrom(
        this.httpService
          .post<LarkAccessToken>(
            "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal",
            {
              app_id: appId,
              app_secret: appSecret,
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error("Failed to get Lark access token", error);
              throw error;
            }),
          ),
      );

      this.accessToken = response.data.access_token;
      // Establecer expiración (restar 5 minutos como margen)
      this.tokenExpiry = new Date(
        Date.now() + (response.data.expires_in - 300) * 1000,
      );

      return this.accessToken;
    } catch (error) {
      this.logger.error("Error getting Lark token", error);
      throw error;
    }
  }

  async sendMessage(chatId: string, message: any): Promise<boolean> {
    try {
      const token = await this.getAccessToken();

      const larkMessage = {
        receive_id: chatId,
        msg_type: "interactive",
        content: JSON.stringify({
          config: {
            wide_screen_mode: true,
          },
          header: {
            template: "blue",
            title: {
              content: "🚀 Nuevo Pull Request",
              tag: "plain_text",
            },
          },
          elements: [
            {
              tag: "div",
              text: {
                content: `**Repositorio:** ${message.repository}\n**Título:** ${message.title}\n**Autor:** ${message.author}`,
                tag: "lark_md",
              },
            },
            {
              tag: "action",
              actions: [
                {
                  tag: "button",
                  text: {
                    content: "Ver PR",
                    tag: "plain_text",
                  },
                  type: "primary",
                  url: message.url,
                },
              ],
            },
          ],
        }),
      };

      await lastValueFrom(
        this.httpService
          .post(
            "https://open.larksuite.com/open-apis/im/v1/messages",
            larkMessage,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(
                "Failed to send message to Lark",
                error.response?.data,
              );
              throw error;
            }),
          ),
      );

      this.logger.log(`Message sent to Lark chat ${chatId}`);
      return true;
    } catch (error) {
      this.logger.error("Error sending message to Lark", error);
      return false;
    }
  }
}
