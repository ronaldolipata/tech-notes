import { Request } from 'express';

export interface UserExtendedRequest extends Request {
  id?: string;
  username?: string;
  password?: string;
  roles?: string[];
  active?: boolean;
}
