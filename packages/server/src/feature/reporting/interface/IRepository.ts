export interface IReportingRepository {
  findAllByRoomId(roomId: string): Promise<any>;
}
