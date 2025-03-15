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
        authTag: authTag.toString('hex'),
    };
}

// Function to insert encrypted data into board_emails and encryption metadata
// async function storeEncryptedEmail(userInfo, emailData) {
//     const { subject, from, to, cc, snippet, threadId } = emailData;

//     // Encrypt each sensitive field
//     const encryptedSubject = encryptData(userInfo, subject);
//     const encryptedFrom = encryptData(userInfo, JSON.stringify(from));
//     const encryptedTo = encryptData(userInfo, JSON.stringify(to));
//     const encryptedCc = encryptData(userInfo, cc);
//     const encryptedSnippet = encryptData(userInfo, snippet);
//     const encryptedThreadId = encryptData(userInfo, threadId);

//     // Insert the encrypted data into the board_emails table
//     const { data: emailDataInsert, error: emailError } = await supabase
//         .from('board_emails')
//         .insert([
//             {
//                 board_id: emailData.board_id,
//                 column_id: emailData.column_id,
//                 encrypted_subject: 'ENCRYPTED',
//                 encrypted_from: 'ENCRYPTED',
//                 encrypted_to: 'ENCRYPTED',
//                 encrypted_cc: 'ENCRYPTED',
//                 encrypted_snippet: 'ENCRYPTED',
//                 encrypted_thread_id: 'ENCRYPTED',
//                 created_at: new Date(),
//                 updated_at: new Date(),
//             }]);

//     if (emailError) {
//         console.error('Error inserting email:', emailError);
//         return;
//     }

//     const boardEmailId = emailDataInsert[0].id;

//     // Insert encryption metadata into the board_emails_encryption_metadata table
//     const { error: metadataError } = await supabase
//         .from('board_emails_encryption_metadata')
//         .insert([
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'subject',
//                 ciphertext: encryptedSubject.ciphertext,
//                 iv: encryptedSubject.iv,
//                 auth_tag: encryptedSubject.authTag
//             },
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'from',
//                 ciphertext: encryptedFrom.ciphertext,
//                 iv: encryptedFrom.iv,
//                 auth_tag: encryptedFrom.authTag
//             },
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'to',
//                 ciphertext: encryptedTo.ciphertext,
//                 iv: encryptedTo.iv,
//                 auth_tag: encryptedTo.authTag
//             },
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'cc',
//                 ciphertext: encryptedCc.ciphertext,
//                 iv: encryptedCc.iv,
//                 auth_tag: encryptedCc.authTag
//             },
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'snippet',
//                 ciphertext: encryptedSnippet.ciphertext,
//                 iv: encryptedSnippet.iv,
//                 auth_tag: encryptedSnippet.authTag
//             },
//             {
//                 board_email_id: boardEmailId,
//                 column_name: 'thread_id',
//                 ciphertext: encryptedThreadId.ciphertext,
//                 iv: encryptedThreadId.iv,
//                 auth_tag: encryptedThreadId.authTag
//             }
//         ]);

//     if (metadataError) {
//         console.error('Error inserting encryption metadata:', metadataError);
//         return;
//     }

//     console.log('Encrypted email and metadata inserted successfully');
// }

// Example usage
// const userInfo = { email: 'user@example.com' };
// const emailData = {
//     subject: 'Example Email Subject',
//     from: { name: 'Sender', email: 'sender@example.com' },
//     to: [{ name: 'Recipient', email: 'recipient@example.com' }],
//     cc: 'cc@example.com',
//     snippet: 'This is a preview of the email.',
//     threadId: 'thread-123',
//     board_id: 1,
//     column_id: 1
// };

// storeEncryptedEmail(userInfo, emailData).catch(console.error);



// Example usage
// const userKey = 'user@example.com'; // User key (e.g., email) to derive the encryption key
// const emailId = 'email-id-12345'; // Unique email ID to retrieve and decrypt

// getDecryptedEmail(userKey, emailId)
//     .then(decryptedEmail => {
//         console.log('Decrypted Email:', decryptedEmail);
//     })
//     .catch(console.error);
