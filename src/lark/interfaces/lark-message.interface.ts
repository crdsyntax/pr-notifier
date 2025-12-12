export interface LarkAccessToken {
  code: number;
  msg: string;
  tenant_access_token: string;
  expire: number;
}

export interface LarkResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface LarkMessage {
  receive_id: string;
  content: string;
  msg_type: string;
}

export interface LarkInteractiveMessage {
  receive_id: string;
  msg_type: "interactive";
  content: string;
}

export interface LarkMessageElement {
  tag: string;
  text?: {
    tag: string;
    content: string;
  };
  actions?: Array<{
    tag: string;
    text: {
      tag: string;
      content: string;
    };
    type?: string;
    url?: string;
    value?: Record<string, any>;
  }>;
}

export interface LarkMessageConfig {
  wide_screen_mode?: boolean;
  enable_forward?: boolean;
}

export interface LarkMessageHeader {
  title: {
    tag: string;
    content: string;
  };
  template?: string;
}

export interface LarkInteractiveContent {
  config: LarkMessageConfig;
  header: LarkMessageHeader;
  elements: LarkMessageElement[];
}

export interface SendMessageDto {
  chatId: string;
  message: LarkInteractiveContent;
  receiveType?: "open_id" | "user_id" | "union_id" | "email" | "chat_id";
}

export interface SendMessageResponse {
  message_id: string;
  chat_id?: string;
  root_id?: string;
  parent_id?: string;
}

export interface LarkAppConfig {
  appId: string;
  appSecret: string;
  chatId?: string;
}
