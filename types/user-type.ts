export type TUser = {
    id : string;
    name : string;
    email : string;
    role : Role;
}

export enum Role {
  ADMIN = "ADMIN",
  LEAD = "LEAD",
  MEMBER = "MEMBER"
}