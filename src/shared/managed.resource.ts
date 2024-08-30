import { ResultAsync } from 'neverthrow';

export interface ManagedResource {
  initialize(): ResultAsync<void, Error>;
  dispose(): ResultAsync<void, Error>;
}
