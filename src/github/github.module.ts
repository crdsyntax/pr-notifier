import { Module } from "@nestjs/common";
import { GithubController } from "./github.controller";
import { GithubService } from "./github.service";
import { PrService } from "src/pr/pr.service";
import { LarkModule } from "src/lark/lark.module";

@Module({
  imports: [LarkModule],
  controllers: [GithubController],
  providers: [GithubService, PrService],
})
export class GithubModule {}
