import AuthService from '@/services/auth/index'
import type { GoogleProvider } from '@/app/providers/GoogleProvider'
import { ProviderFactory } from '@/app/providers/ProviderFactory'
import type { EmailData } from '@/types/email'
import { User } from '@supabase/supabase-js'
import { GeminiService } from '../ai/GeminiService'

export default class EmailService {
  private authService: AuthService
  private provider: GoogleProvider
  private user?: User
  private geminiService: GeminiService

  constructor() {
    this.authService = new AuthService()
    this.provider = ProviderFactory.createProvider('google') as GoogleProvider
    this.geminiService = new GeminiService(process.env.GEMINI_API_KEY!)
  }

  setUser(user: User) {
    this.authService.setUser(user)
    this.user = user
    return this
  }

  async getEmailDomainStats() {
    const tokens = await this.authService.refreshTokensIfNeeded()
    this.provider.setTokens(tokens)

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const searchQuery = `after:${Math.floor(thirtyDaysAgo.getTime() / 1000)}`;

    const response = await this.provider.searchEmails({
      q: searchQuery,
    });

    const emails = await Promise.all(
      response.map(async (message) => {
        const email = await this.provider.getEmailDetails(message.id);
        const headers = email.data.payload?.headers;
        const from = headers?.find((h: any) => h.name === 'From')?.value;
        const to = headers?.find((h: any) => h.name === 'To')?.value;
        return { from, to };
      }) || []
    ) as EmailData[]

    // Create domain statistics
    const domainStats: { [key: string]: number } = {};

    emails.forEach((email: EmailData) => {
      // Process 'From' domains
      if (email.from) {
        const fromDomain = this.extractDomain(email.from);
        if (fromDomain) {
          domainStats[fromDomain] = (domainStats[fromDomain] || 0) + 1;
        }
      }

      // Process 'To' domains
      if (email.to) {
        const toAddresses = email.to.split(',');
        toAddresses.forEach((addr: string) => {
          const toDomain = this.extractDomain(addr.trim());
          if (toDomain) {
            domainStats[toDomain] = (domainStats[toDomain] || 0) + 1;
          }
        });
      }
    });

    // Convert to array and sort by count
    const sortedDomainStats = Object.entries(domainStats)
      .map(([domain, count]) => ({
        domain,
        count,
        image: `https://img.logo.dev/${domain}?token=pk_by_Ug9eERqKxq4TH8UdUPQ`
      }))
      .sort((a, b) => b.count - a.count);

    // const { error } = await supabase
    //   .from('available_projects')
    //   .upsert(sortedDomainStats);

    return {
      totalEmails: emails.length,
      domains: sortedDomainStats
    };
  }

  private extractDomain(emailString: string): string | null {
    // Handle format: "Name <email@domain.com>" or "email@domain.com"
    const emailMatch = emailString.match(/<(.+@.+)>/) || emailString.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      const email = emailMatch[1] || emailMatch[0];
      const domain = email.split('@')[1];
      return domain.toLowerCase();
    }
    return null;
  }

  async getEmailById(id: string) {
    if (!this.user) throw new Error('User not set')

    const tokens = await this.authService.refreshTokensIfNeeded()
    this.provider.setTokens(tokens)
    const threadEmails = await this.provider.getEmail({ id, format: 'full' })
    return threadEmails
  }

  async getLabels() {
    if (!this.user) throw new Error('User not set')

    const tokens = await this.authService.refreshTokensIfNeeded()
    return this.provider.setTokens(tokens).listLabels()
  }

  async getThreadsByLabel(labelId: string) {
    if (!this.user) throw new Error('User not set')

    const tokens = await this.authService.refreshTokensIfNeeded()
    return this.provider.setTokens(tokens).getThreadsByLabel(labelId)
  }

  async getRecentInboxEmails(options: { maxResults?: number; pageToken?: string }) {
    if (!this.user) throw new Error('User not set')

    const tokens = await this.authService.refreshTokensIfNeeded()
    return this.provider.setTokens(tokens).getRecentInboxEmails(options)
  }

  async summarizeThread(threadId: string): Promise<{ summary: string, emails: EmailData[] }> {
    if (!this.user) throw new Error('User not set');

    try {
      const tokens = await this.authService.refreshTokensIfNeeded();
      this.provider.setTokens(tokens);

      // Fetch emails in the thread
      const emails = await this.provider.getEmail({ id: threadId, format: 'full' });

      // Combine email content for summarization
      const emailContent = emails
        .map(email => `
Date: ${email.date}
From: ${email.from}
Subject: ${email.subject}
Content: ${email.body || email.snippet}
        `)
        .join('\n---\n');

      // Get summary from Gemini
      const summary = await this.geminiService.summarizeEmail(emailContent);

      return {
        summary,
        emails: []
      };
    } catch (error) {
      console.error('Error summarizing thread:', error);
      throw error;
    }
  }
}
