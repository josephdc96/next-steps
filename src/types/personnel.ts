import type { Position } from './position';

export interface Personnel {
  id?: string;
  currentMonthAssign?: string;
  teams: string[];
  lastName: string;
  phoneNum: string;
  email: string;
  signedCommitment: Date;
  ltClass: Date;
  firstName: string;
  leader?: string;
  lastMonthAssign?: string;
  commitedThru: Date;
  active: boolean;
  birthday: Date;
  reason?: string;
  followUp?: string;
  onBreak: boolean;
  auth0id?: string;
  roles?: UserRole[];
  auth0Id?: string;
}

export enum UserRole {
  Leader = 0,
  SubTeamLeader,
  TeamLeader,
  Admin,
  SuperUser,
}
