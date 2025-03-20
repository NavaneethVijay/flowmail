import { WaitlistRepository } from '@/app/repository/waitlistRepository'

export default class WaitlistService {
  private waitlistRepository: WaitlistRepository

  constructor() {
    this.waitlistRepository = new WaitlistRepository()
  }

  async addToWaitlist(email: string) {
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email address')
    }

    return await this.waitlistRepository.addEmail(email)
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}