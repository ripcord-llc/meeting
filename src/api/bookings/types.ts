export interface Slot {
  startTime: Date;
  endTime: Date;
}

export type TeamSlot = Slot & {
  users: number[];
};
