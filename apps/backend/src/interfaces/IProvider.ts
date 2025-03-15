export interface IProvider {
    fetchDomainStats(): Promise<any>;
    searchEmails(options: unknown): Promise<any>;
    setClientConnection(accessToken: string): Promise<any>;
}
