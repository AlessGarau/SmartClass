import { Service } from "typedi";
import { UserMobileDeviceRegister } from "../../../database/schema/userMobileDevice";

@Service()
export class UserMobileDeviceDatabaseMapper {
  toUserMobileDevice(userId: string, deviceToken: string, refreshToken: string): UserMobileDeviceRegister {
    return {
      user_id: userId,
      device_token: deviceToken,
      refresh_token: refreshToken,
    };
  }
}