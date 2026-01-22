/**
 * Task-related TypeScript type definitions
 */

export interface CreateTaskParams {
  creator: string;
  code: string;
  userid: string | number;
  amount: number;
  token: string;
}

export interface TaskResponse {
  success: boolean;
  data?: {
    code: string;
    creator: string;
    state: string;
    alreadySent: number;
    target: number;
    repeatedly?: number;
  };
  error?: string;
}

export interface CheckTaskParams {
  creator: string;
  code: string;
  userid: string | number;
  token: string;
}
