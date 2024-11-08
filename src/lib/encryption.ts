// app/lib/encryption.ts
import { AES, enc } from "crypto-js";

// In a real application, you should use an environment variable for the secret key
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-fallback-encryption-key";

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
