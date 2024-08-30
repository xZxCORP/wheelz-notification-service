export interface Config {
  logLevel: string;
  notificationQueue: {
    url: string;
    queueName: string;
  };
  messageEmitter: {
    host: string;
    port: number;
    auth: {
      username: string;
      password: string;
    };
  };
}
