// src/providers/ProviderFactory.ts
import type { IProvider } from '@/interfaces/IProvider';
import { GoogleProvider } from './GoogleProvider';

export class ProviderFactory {
    static createProvider(providerName: string): IProvider {
        switch (providerName) {
            case 'google':
                return new GoogleProvider();
            default:
                throw new Error(`Provider ${providerName} is not supported`);
        }
    }
}
