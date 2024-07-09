export type Violations = {
  violationId: string;
  ordinance: string;
  title: string;
  article: string;
  desc: string;
}
 
export interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  contactNum: string;
  email: string;
  address: string;
  violations: Violations[];
  signature: string;
  printed: boolean;
}