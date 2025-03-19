// @ts-nocheck
import { supabase } from '@/config/supabase'
import type { BoardColumn, BoardEmail } from '@/types/boards'
import { encryptData, decryptData, deriveUserKey } from '@/utils/crypto'

const ENCRYPTED_COLUMNS = ['subject', 'from', 'to', 'snippet'] as const;
type EncryptedColumn = typeof ENCRYPTED_COLUMNS[number];
interface EncryptedField {
    ciphertext: string;
    iv: string;
    authTag: string;
}

export class BoardEmailRepository {
    private readonly BOARD_EMAILS_TABLE = 'board_emails'
    private readonly BOARD_EMAILS_CACHE_KEY = 'board_email_cache'

    async getBoardEmails(boardId: number, encryptionHandler: () => Buffer): Promise<BoardEmail[]> {
        // Fetch base email data
        const { data: boardEmails, error: emailError } = await supabase
            .from(this.BOARD_EMAILS_TABLE)
            .select('*')
            .eq('board_id', boardId)
            .order('date', { ascending: false });

        if (emailError) throw emailError;

        // Early return if no emails
        if (!boardEmails?.length) return [];

        // Fetch encryption metadata
        const { data: metadata, error: metadataError } = await supabase
            .from('board_emails_encryption_metadata')
            .select('*')
            .in('board_email_id', boardEmails.map(email => email.id));

        if (metadataError) throw metadataError;

        const userKey = encryptionHandler();
        const metadataByEmailId = this.groupMetadataByEmailId(metadata);

        const dataToReturn = boardEmails.map(email => {
            return this.decryptEmailData(email, metadataByEmailId[email.id], userKey)
        })

        console.log('dataToReturn', JSON.stringify(dataToReturn, null, 2))

        return dataToReturn;
    }

    async saveBoardEmails(boardId: number, emails: any[], defaultColumn: BoardColumn, encryptionHandler: () =>  Buffer) {
        const userKey = encryptionHandler();

        await Promise.all(emails.map(async (email: any) => {
            console.log('email to save in board', email)
            const { id: email_id, threadId: thread_id, date } = email;

            // Encrypt all sensitive fields
            const encryptedFields = this.encryptEmailFields(email, userKey);

            // Insert main email record
            const { data: emailData, error: emailError } = await supabase
                .from(this.BOARD_EMAILS_TABLE)
                .upsert([{
                    board_id: boardId,
                    email_id,
                    thread_id,
                    column_id: defaultColumn.id,
                    date: new Date(date).toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    ...Object.fromEntries(
                        Object.entries(encryptedFields)
                            .map(([key, value]) => [key, value.ciphertext])
                    )
                }], {
                    onConflict: 'board_id,email_id'
                })
                .select();

            if (emailError) throw emailError;

            // Insert encryption metadata
            await this.saveEncryptionMetadata(emailData[0].id, encryptedFields);
        }));

        // Update cache
        await this.updateCache(boardId);
    }

    // Helper methods
    private groupMetadataByEmailId(metadata: any[]) {
        return metadata.reduce((acc, meta) => {
            if (!acc[meta.board_email_id]) {
                acc[meta.board_email_id] = {};
            }
            acc[meta.board_email_id][meta.column_name] = {
                ciphertext: meta.ciphertext,
                iv: meta.iv,
                auth_tag: meta.auth_tag
            };
            return acc;
        }, {});
    }

    private decryptEmailData(
        email: any,
        metadata: Record<EncryptedColumn, EncryptedField>,
        userKey: Buffer
    ) {
        const decryptedData: Partial<Record<EncryptedColumn, string>> = {};
        if (metadata) {
            ENCRYPTED_COLUMNS.forEach(columnName => {
                if (metadata[columnName]) {
                    decryptedData[columnName] = decryptData(userKey, metadata[columnName]);
                }
            });
        }

        return {
            id: email.id,
            board_id: email.board_id,
            column_id: email.column_id,
            created_at: email.created_at,
            updated_at: email.updated_at,
            date: email.date,
            email_id: email.email_id,
            thread_id: email.thread_id,
            labels: email.labels,
            rawLabels: email.rawLabels,
            position_in_column: email.position_in_column,
            ...decryptedData
        };
    }

    private encryptEmailFields(email: any, userKey: Buffer): Partial<Record<EncryptedColumn, EncryptedField>> {
        return ENCRYPTED_COLUMNS.reduce((acc, field) => {
            if (email[field]) {
                acc[field] = encryptData(userKey, email[field]);
            }
            return acc;
        }, {} as Partial<Record<EncryptedColumn, EncryptedField>>);
    }

    private async saveEncryptionMetadata(
        boardEmailId: number,
        encryptedFields: Partial<Record<EncryptedColumn, EncryptedField>>
    ) {
        const metadataRecords = Object.entries(encryptedFields).map(([columnName, data]) => ({
            board_email_id: boardEmailId,
            column_name: columnName as EncryptedColumn,
            ciphertext: data.ciphertext,
            iv: data.iv,
            auth_tag: data.auth_tag
        }));

        const { error } = await supabase
            .from('board_emails_encryption_metadata')
            .upsert(metadataRecords, {
                onConflict: 'board_email_id,column_name'
            });

        if (error) throw error;
    }

    private async updateCache(boardId: number) {
        await supabase
            .from(this.BOARD_EMAILS_CACHE_KEY)
            .upsert({
                board_id: boardId,
                cache_tag: 'EMAIL_CACHE',
                last_synced_at: new Date().toISOString()
            }, {
                onConflict: 'board_id'
            });
    }

    async deleteBoardEmails(boardId: number) {
        const { data, error } = await supabase.from(this.BOARD_EMAILS_TABLE).delete().eq('board_id', boardId)
        if (error) {
            console.error('Error deleting board emails:', error);
            throw error;
        }
        return data
    }

    async checkIfEmailIdIsValid(emailId: string) {
        const { data, error } = await supabase.from(this.BOARD_EMAILS_TABLE).select('*').eq('email_id', emailId)
        if (error) {
            console.error('Error checking if email id is valid in the board:', error);
            throw error;
        }
        return data
    }
}
