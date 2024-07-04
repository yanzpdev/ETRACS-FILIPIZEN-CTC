export type Violations = {
  violationId: string;
  ordinance: string;
  title: string;
  article: string;
  desc: string;
}
 
export interface FormData {
  fullName: string;
  contactNum: string;
  email: string;
  address: string;
  violations: Violations[];
  signature: string;
  printed: boolean;
}

export interface ParsedResult {
  surname: string;
  givenName: string;
  contactNum: string;
  address: string;
  IDNum: string;
  birthDate: string;
  expiryDate: string;
}

export interface ScannedIDCard {
  image: string;
  info: ParsedResult;
  timestamp: number;
}