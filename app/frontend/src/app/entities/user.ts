export class User {
  firstname: string;
  lastname: string;
  username: string;
  phone: number;
  password: string;
  selectedShifts: string[];
  currentShifts: string[];
  isAdmin: boolean;
  totalShifts: number;
  totalSwitchRequests: number;
  totalAcceptedSwitchRequests: number;
  color: string;
}
