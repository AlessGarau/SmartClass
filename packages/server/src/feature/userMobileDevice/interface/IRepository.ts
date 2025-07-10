export interface IRepository {
    saveDeviceToken(userId: string, deviceToken: string, refreshToken: string): Promise<void>;
    }