// pr/pr.service.ts
import { Injectable } from "@nestjs/common";

export interface PrData {
  url: string;
  title: string;
  author: string;
  authorUrl: string;
  repository: string;
  repoUrl: string;
  description: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PrService {
  formatPrMessage(prData: PrData): any {
    // Determinar emoji según acción
    const actionEmoji =
      {
        opened: "🎯",
        reopened: "🔄",
        synchronize: "🔄",
      }[prData.action] || "📌";

    // Formatear descripción (truncar si es muy larga)
    const description =
      prData.description.length > 200
        ? `${prData.description.substring(0, 200)}...`
        : prData.description;

    return {
      url: prData.url,
      title: prData.title,
      author: prData.author,
      authorUrl: prData.authorUrl,
      repository: prData.repository,
      repoUrl: prData.repoUrl,
      description,
      action: prData.action,
      createdAt: new Date(prData.createdAt).toLocaleString(),
      updatedAt: new Date(prData.updatedAt).toLocaleString(),
      emoji: actionEmoji,
    };
  }

  formatPrMessageForLark(prData: PrData): any {
    const message = this.formatPrMessage(prData);

    return {
      msg_type: "interactive",
      card: {
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**${message.emoji} Nuevo Pull Request**\n\n**Repositorio:** [${message.repository}](${message.repoUrl})\n**Título:** ${message.title}\n**Autor:** [${message.author}](${message.authorUrl})\n\n${message.description}`,
            },
          },
          {
            tag: "action",
            actions: [
              {
                tag: "button",
                text: {
                  tag: "plain_text",
                  content: "Abrir PR en GitHub",
                },
                type: "primary",
                url: message.url,
              },
            ],
          },
        ],
        header: {
          title: {
            tag: "plain_text",
            content: `PR: ${message.repository}`,
          },
        },
      },
    };
  }
}
