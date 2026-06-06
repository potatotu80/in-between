import { UserRole } from "@in-between/shared";

export type AuthenticatedUser = {
  sub: string;
  username: string;
  displayName: string;
  role: UserRole;
  locale: string;
};
