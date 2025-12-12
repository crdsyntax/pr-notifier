// pr/interfaces/pr-data.interface.ts

export interface GithubUser {
  login: string;
  html_url: string;
  avatar_url?: string;
}

export interface GithubRepository {
  name: string;
  full_name: string;
  html_url: string;
  description?: string;
}

export interface GithubPullRequest {
  html_url: string;
  title: string;
  body: string;
  number: number;
  state: string;
  created_at: string;
  updated_at: string;
  user: GithubUser;
  draft: boolean;
  mergeable: boolean;
  mergeable_state: string;
  merged: boolean;
}

export interface GithubWebhookPayload {
  action: string;
  pull_request: GithubPullRequest;
  repository: GithubRepository;
  sender: GithubUser;
  organization?: {
    login: string;
    html_url: string;
  };
}

export interface PrNotificationData {
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
  number: number;
  state: string;
  isDraft: boolean;
  mergeable: boolean;
}
