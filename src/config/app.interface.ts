export interface AppConfig {
  github: {
    webhookSecret: string;
    allowedRepositories?: string[];
    allowedActions?: string[];
  };

  lark: {
    appId: string;
    appSecret: string;
    defaultChatId: string;
    enabled: boolean;
  };

  server: {
    port: number;
    environment: "development" | "production" | "test";
    logLevel: string;
  };

  security: {
    rateLimit: {
      ttl: number;
      limit: number;
    };
    cors: {
      enabled: boolean;
      origin: string[];
    };
  };
}
