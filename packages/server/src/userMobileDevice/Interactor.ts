import { Service } from "typedi";
import { IInteractor } from "./interface/IInteractor";
import { UserMobileDeviceRepository } from "./Repository";

@Service()
export class UserMobileDeviceInteractor implements IInteractor {
  constructor(private repository: UserMobileDeviceRepository) {}

  async saveDeviceToken(userId: string, deviceToken: string, refreshToken: string): Promise<void> {
    await this.repository.saveDeviceToken(userId, deviceToken, refreshToken);
  }
}