import crypto from 'crypto';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient('https://your-project.supabase.co', 'your-api-key');
const MASTER_KEY = "f1d2d2f924e986ac86fdf7b36c94bcdfdfeaf3f5d7ec812e7b5366e92b8e7e65";

export function deriveUserKey(userInfo: { email: string }): Buffer {
    const salt = userInfo.email; // Unique salt for the user (e.g., email or user ID)
    return crypto.pbkdf2Sync(MASTER_KEY, salt, 100000, 32, 'sha256'); // 32 bytes = 256-bit key
}

// Decrypts encrypted data using AES-256-GCM
export function decryptData(userKey: Buffer, encryptedData: { iv: string; auth_tag: string; ciphertext: string }): string {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.auth_tag, 'hex');
    const ciphertext = Buffer.from(encryptedData.ciphertext, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', userKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}

// Encrypts data using AES-256-GCM
export function encryptData(userKey: Buffer, data: string): { ciphertext: string; iv: string; auth_tag: string } {
    const iv = crypto.randomBytes(12); // AES-GCM requires a 12-byte IV
    const cipher = crypto.createCipheriv('aes-256-gcm', userKey, iv);

    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        ciphertext: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        auth_tag: authTag.toString('hex'),
    };
}
