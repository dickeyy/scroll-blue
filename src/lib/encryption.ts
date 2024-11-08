// app/lib/encryption.ts
import { AES, enc } from "crypto-js";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-fallback-encryption-key";

export function encryptData<T>(data: T): T {
    try {
        const jsonString = JSON.stringify(data);
        const encrypted = AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
        return encrypted as unknown as T;
    } catch (error) {
        console.error("Encryption failed:", error);
        return data;
    }
}

export function decryptData<T>(encryptedData: T): T {
    try {
        const decrypted = AES.decrypt(encryptedData as string, ENCRYPTION_KEY).toString(enc.Utf8);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Decryption failed:", error);
        return encryptedData;
    }
}
