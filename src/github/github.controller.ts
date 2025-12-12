// github/github.controller.ts
import {
  Controller,
  Post,
  Headers,
  Body,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { GithubService } from "./github.service";
import { GithubWebhookDto } from "./dto/github-webhook.dto";
import { ApiTags, ApiHeader } from "@nestjs/swagger";

@ApiTags("github")
@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  @ApiHeader({
    name: "X-GitHub-Event",
    description: "GitHub event type",
  })
  @ApiHeader({
    name: "X-Hub-Signature-256",
    description: "GitHub webhook signature",
  })
  async handleWebhook(
    @Headers("X-GitHub-Event") event: string,
    @Headers("X-Hub-Signature-256") signature: string,
    @Body() payload: GithubWebhookDto,
  ) {
    // Verificar firma
    const isValid = await this.githubService.verifySignature(
      signature,
      JSON.stringify(payload),
    );

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    // Procesar según el tipo de evento
    if (event === "pull_request") {
      await this.githubService.handlePullRequest(payload);
    }

    return { received: true };
  }
}
