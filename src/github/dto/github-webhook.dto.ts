import { IsString, IsObject, IsOptional } from "class-validator";

export class GithubWebhookDto {
  @IsString()
  action: string;

  @IsObject()
  pull_request: {
    html_url: string;
    title: string;
    user: {
      login: string;
      html_url: string;
    };
    body: string;
    created_at: string;
    updated_at: string;
  };

  @IsObject()
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };

  @IsObject()
  sender: {
    login: string;
    html_url: string;
  };

  @IsOptional()
  @IsObject()
  organization?: Record<string, any>;
}
