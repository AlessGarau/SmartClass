import { Service } from "typedi";
import { userMobileDeviceTable } from "../../database/schema/userMobileDevice";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { IRepository } from "./interface/IRepository";
import { UserMobileDeviceDatabaseMapper } from "./Mapper";

@Service()
export class UserMobileDeviceRepository implements IRepository {
  constructor(
    private db: NodePgDatabase<Record<string, never>>,
    private userMobileDeviceDatabaseMapper: UserMobileDeviceDatabaseMapper,
  ) {}

  async saveDeviceToken(userId: string, deviceToken: string, refreshToken: string): Promise<void> {
    await this.db.insert(userMobileDeviceTable).values(this.userMobileDeviceDatabaseMapper.toUserMobileDevice(userId, deviceToken, refreshToken)).onConflictDoUpdate({
      target: [userMobileDeviceTable.user_id, userMobileDeviceTable.device_token],
      set: {
        refresh_token: refreshToken,
        last_seen: new Date(),
      },
    });
  }
}