export interface Notification {
  type: 'new_user';
  payload?: unknown;
}

export interface NewUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}
