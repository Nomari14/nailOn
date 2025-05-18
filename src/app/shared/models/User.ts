export interface User {
    id: string;
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    reservations: string[];
  }