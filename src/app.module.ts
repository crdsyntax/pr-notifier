// app.module.ts
import { Module } from "@nestjs/common";
import { GithubModule } from "./github/github.module";
import { LarkModule } from "./lark/lark.module";
import { PrModule } from "./pr/pr.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GithubModule,
    LarkModule,
    PrModule,
  ],
})
export class AppModule {}
