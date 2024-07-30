export interface JwtPayload {
  id: string;
  name: string;
  phone: string;
  roles: string[];
  products: string[];
  expiryDate: Date | string;
}
