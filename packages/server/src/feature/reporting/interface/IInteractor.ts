export interface IReportingInteractor {
  findAllByRoomId(roomId: string): Promise<any>;
}
