import type { Assignment } from './assignment';

export interface Personnel {
  id?: string;
  currentMonthAssign?: Assignment;
  lastName: string;
  phoneNum: string;
  email: string;
  signedCommitment: Date;
  ltClass: Date;
  firstName: string;
  subteamLead: boolean;
  teamLead: boolean;
  leader?: string;
  lastMonthAssign?: Assignment;
  commitedThru: Date;
  active: boolean;
  birthday: Date;
  reason?: string;
  followUp?: string;
  onBreak: boolean;
}
