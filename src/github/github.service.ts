import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import { GithubWebhookDto } from "./dto/github-webhook.dto";
import { PrService } from "../pr/pr.service";
import { LarkService } from "../lark/lark.service";

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private prService: PrService,
    private larkService: LarkService,
  ) {
    this.webhookSecret =
      this.configService.get<string>("GITHUB_WEBHOOK_SECRET") || "";
  }

  async verifySignature(signature: string, payload: string): Promise<boolean> {
    if (!this.webhookSecret) return true;

    const expectedSignature = `sha256=${crypto
      .createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex")}`;

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  async handlePullRequest(payload: GithubWebhookDto): Promise<void> {
    this.logger.log(`Processing PR event: ${payload.action}`);

    const allowedActions = ["opened", "reopened", "synchronize"];
    if (!allowedActions.includes(payload.action)) {
      return;
    }

    const prData = this.extractPrData(payload);

    const message = this.prService.formatPrMessage(prData);

    const chatId = this.configService.get<string>("LARK_CHAT_ID");

    await this.larkService.sendMessage(chatId || "", message);
  }

  private extractPrData(payload: GithubWebhookDto): any {
    return {
      url: payload.pull_request.html_url,
      title: payload.pull_request.title,
      author: payload.pull_request.user.login,
      authorUrl: payload.pull_request.user.html_url,
      repository: payload.repository.full_name,
      repoUrl: payload.repository.html_url,
      description: payload.pull_request.body || "Sin descripción",
      action: payload.action,
      createdAt: payload.pull_request.created_at,
      updatedAt: payload.pull_request.updated_at,
    };
  }
}
