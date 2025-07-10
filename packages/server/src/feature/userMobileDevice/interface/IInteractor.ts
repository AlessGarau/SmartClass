export interface IInteractor {
  saveDeviceToken(userId: string, deviceToken: string, refreshToken: string): Promise<void>;
}