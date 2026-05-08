export interface User {
  name: string;
  email: string;
  password: string;
  vehicles: {
    imei: string;
    name: string;
  }[];
}
