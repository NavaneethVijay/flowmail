import type { IProvider } from '@/interfaces/IProvider';

export abstract class BaseProvider implements IProvider {
    abstract fetchDomainStats(): Promise<any>;
    abstract searchEmails(options: unknown): Promise<any>;
    abstract setClientConnection(accessToken: string): Promise<any>;
}
