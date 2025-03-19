// @ts-nocheck
import { gmail_v1, google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { BaseProvider } from './BaseProvider'
import type { EmailData } from '@/types/email'

interface LabelData {
    id: string;
    name: string;
    type: string;
    messagesTotal: number;
    messagesUnread: number;
    color: string | null;
    messageListVisibility: string | null;
    labelListVisibility: string | null;
}

interface OrganizedLabels {
    categories: LabelData[];
    labels: LabelData[];
}

export class GoogleProvider extends BaseProvider {

    private gmail: gmail_v1.Gmail
    private oauth2Client: OAuth2Client
    private userId: string | null = ''
    private tokens: object = {}

    constructor() {
        super()
        this.oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI
        })

        this.gmail = google.gmail({ version: 'v1' })
    }

    public setTokens(tokens: any) {
        this.tokens = tokens
        return this
    }

    async listLabels(): Promise<OrganizedLabels> {
        await this.setClientConnection();

        try {
            const response = await this.gmail.users.labels.list({ userId: 'me', auth: this.oauth2Client });
            const labels = response.data.labels || [];

            const defaultLabels = [
                'INBOX', 'SENT', 'DRAFT', 'SPAM', 'TRASH', 'STARRED', 'IMPORTANT',
                'CATEGORY_PERSONAL', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS',
                'CATEGORY_UPDATES', 'CATEGORY_FORUMS'
            ];

            const organizedLabels = labels.reduce<OrganizedLabels>((acc, label) => {
                const labelData: LabelData = {
                    id: label.id || '',
                    name: label.name || '',
                    type: label.type || '',
                    messagesTotal: label.messagesTotal || 0,
                    messagesUnread: label.messagesUnread || 0,
                    color: label.color as string,
                    messageListVisibility: label.messageListVisibility as string,
                    labelListVisibility: label.labelListVisibility as string
                };

                if (label.name && defaultLabels.includes(label.name)) {
                    acc.categories.push(labelData);
                } else {
                    acc.labels.push(labelData);
                }
                return acc;
            }, { categories: [], labels: [] });

            return organizedLabels;

        } catch (error) {
            console.error('Error listing labels:', error);
            return { categories: [], labels: [] };
        }
    }

    async getThreadsByLabel(labelId: string): Promise<any> {
        return this.searchEmails({
            labelIds: [labelId],
            maxResults: 30
        })
    }

    async getEmailDetails(emailId: string): Promise<any> {
        const email = await this.gmail.users.messages.get({
            userId: 'me',
            id: emailId,
            auth: this.oauth2Client
        });
        return email
    }

    /**
     * Get email by id
     * @param options - Options for the email
     * @returns Email data
     */
    async getEmail(options: {
        format: string
        id: string
    }): Promise<EmailData[]> {
        if (!this.tokens) throw new Error('Client not connected');
        await this.setClientConnection()

        // Get the message details
        const email = await this.gmail.users.messages.get({
            userId: 'me',
            id: options.id,
            format: options.format,
            auth: this.oauth2Client
        });

        const headers = email.data.payload?.headers || [];
        const labels = email.data.labelIds || [];

        // Extract email body
        let body = '';

        if (email.data.payload?.body?.data) {
            // If body is directly available
            body = Buffer.from(email.data.payload.body.data, 'base64').toString('utf-8');
        } else if (email.data.payload?.parts) {
            // If the body is in multiple parts (multipart email)
            body = this.decodeMessageContent(email.data.payload);
        }

        const emailData: EmailData = {
            id: email.data.id!,
            threadId: email.data.threadId!,
            subject: headers.find((h) => h.name === 'Subject')?.value,
            from: headers.find((h) => h.name === 'From')?.value,
            to: headers.find((h) => h.name === 'To')?.value,
            cc: headers.find((h) => h.name === 'Cc')?.value,
            date: headers.find((h) => h.name === 'Date')?.value,
            snippet: email.data.snippet,
            body,
            labels: {
                starred: labels.includes('STARRED'),
                important: labels.includes('IMPORTANT'),
                inbox: labels.includes('INBOX'),
                sent: labels.includes('SENT'),
                draft: labels.includes('DRAFT'),
                spam: labels.includes('SPAM'),
                trash: labels.includes('TRASH'),
                unread: labels.includes('UNREAD'),
                custom: labels.filter(
                    (label) =>
                        ![
                            'STARRED',
                            'IMPORTANT',
                            'INBOX',
                            'SENT',
                            'DRAFT',
                            'SPAM',
                            'TRASH',
                            'UNREAD',
                            'CATEGORY_PERSONAL',
                            'CATEGORY_SOCIAL',
                            'CATEGORY_PROMOTIONS',
                            'CATEGORY_UPDATES',
                            'CATEGORY_FORUMS',
                        ].includes(label)
                ),
            },
            rawLabels: labels,
        };

        return [emailData];
    }

    private decodeMessageContent(payload: any): string {
        const parts = payload.parts || [];

        for (const part of parts) {
            if (part.mimeType === 'text/html') {
                // Decode and return the HTML content
                return Buffer.from(part.body.data, 'base64').toString('utf-8');
            } else if (part.parts && part.parts.length > 0) {
                // Check nested parts for HTML content
                const nestedHtml = this.decodeMessageContent(part);
                if (nestedHtml) {
                    return nestedHtml;
                }
            }
        }

        return '';
    }

    async setClientConnection(): Promise<void> {
        this.oauth2Client.setCredentials(this.tokens)
    }

    async searchEmails(options: gmail_v1.Params$Resource$Users$Messages$List): Promise<EmailData[]> {
        if (!this.tokens) throw new Error('Client not connected');
        await this.setClientConnection();

        // Fetch a list of messages based on the query
        const response = await this.gmail.users.messages.list({
            userId: 'me',
            labelIds: options.labelIds || [],
            maxResults: options.maxResults || 20,
            q: options.q,
            auth: this.oauth2Client,
        });

        // Guard clause: Return an empty array if no messages are found
        if (!response.data.messages || response.data.messages.length === 0) {
            return [];
        }

        // Map to store emails grouped by threadId
        const threadsMap = new Map<string, EmailData>();

        // Fetch details for each message
        await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await this.gmail.users.messages.get({
                    userId: 'me',
                    id: message.id!,
                    format: 'full',
                    auth: this.oauth2Client,
                });

                const headers = email.data.payload?.headers;
                const labels = email.data.labelIds || [];
                const threadId = email.data.threadId!;

                const emailData: EmailData = {
                    id: message.id!,
                    threadId,
                    subject: headers?.find((h) => h.name === 'Subject')?.value,
                    from: headers?.find((h) => h.name === 'From')?.value,
                    to: headers?.find((h) => h.name === 'To')?.value,
                    cc: headers?.find((h) => h.name === 'Cc')?.value,
                    date: headers?.find((h) => h.name === 'Date')?.value,
                    snippet: email.data.snippet,
                    labels: {
                        starred: labels.includes('STARRED'),
                        important: labels.includes('IMPORTANT'),
                        inbox: labels.includes('INBOX'),
                        sent: labels.includes('SENT'),
                        draft: labels.includes('DRAFT'),
                        spam: labels.includes('SPAM'),
                        trash: labels.includes('TRASH'),
                        unread: labels.includes('UNREAD'),
                        custom: labels.filter(
                            (label) =>
                                ![
                                    'STARRED',
                                    'IMPORTANT',
                                    'INBOX',
                                    'SENT',
                                    'DRAFT',
                                    'SPAM',
                                    'TRASH',
                                    'UNREAD',
                                    'CATEGORY_PERSONAL',
                                    'CATEGORY_SOCIAL',
                                    'CATEGORY_PROMOTIONS',
                                    'CATEGORY_UPDATES',
                                    'CATEGORY_FORUMS',
                                ].includes(label)
                        ),
                    },
                    rawLabels: labels,
                };

                // Compare emails in the same thread and keep the latest one
                const existingEmail = threadsMap.get(threadId);
                if (!existingEmail || new Date(emailData.date!).getTime() > new Date(existingEmail.date!).getTime()) {
                    threadsMap.set(threadId, emailData);
                }
            })
        );

        // Return the latest email from each thread
        return Array.from(threadsMap.values());
    }

    async fetchDomainStats(): Promise<EmailData[]> {
        if (!this.userId) throw new Error('Client not connected');

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const searchQuery = `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)}`;

        return await this.searchEmails({
            q: searchQuery,
            maxResults: 20
        });
    }

    async getRecentInboxEmails(options: { maxResults?: number; pageToken?: string }) {
        if (!this.tokens) throw new Error('Client not connected');
        await this.setClientConnection();

        try {
            // Fetch the list of threads in the inbox
            const response = await this.gmail.users.threads.list({
                userId: 'me',
                labelIds: ['INBOX', 'IMPORTANT'],
                maxResults: options.maxResults || 20,
                pageToken: options.pageToken, // Handle pagination
                auth: this.oauth2Client,
            });

            if (!response.data.threads || response.data.threads.length === 0) {
                return { emails: [], nextPageToken: null };
            }

            const emails: EmailData[] = await Promise.all(
                response.data.threads.map(async (thread) => {
                    const threadData = await this.gmail.users.threads.get({
                        userId: 'me',
                        id: thread.id!,
                        format: 'full',
                        auth: this.oauth2Client,
                    });

                    // Get the latest message in the thread (Gmail's default view)
                    const latestMessage = threadData.data.messages?.[0];
                    const headers = latestMessage?.payload?.headers || [];

                    return {
                        id: thread.id!,
                        threadId: thread.id!,
                        subject: headers.find((h) => h.name === 'Subject')?.value || "(No Subject)",
                        from: headers.find((h) => h.name === 'From')?.value || "Unknown",
                        date: headers.find((h) => h.name === 'Date')?.value || "Unknown",
                        snippet: latestMessage?.snippet || "",
                    };
                })
            );

            return {
                emails,
                nextPageToken: response.data.nextPageToken || null, // Return pagination token
            };
        } catch (error) {
            console.error('Error fetching inbox threads:', error);
            return { emails: [], nextPageToken: null };
        }
    }

}
