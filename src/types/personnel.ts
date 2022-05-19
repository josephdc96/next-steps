import type { Position } from './position';

export interface Personnel {
  id?: string;
  currentMonthAssign?: string;
  lastName: string;
  phoneNum: string;
  email: string;
  signedCommitment: Date;
  ltClass: Date;
  firstName: string;
  subteamLead: boolean;
  teamLead: boolean;
  leader?: string;
  lastMonthAssign?: string;
  commitedThru: Date;
  active: boolean;
  birthday: Date;
  reason?: string;
  followUp?: string;
  onBreak: boolean;
  auth0id?: string;
}
