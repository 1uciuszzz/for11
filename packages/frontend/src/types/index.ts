export interface Profile {
  id: string;
  username: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  date: string;
  userId: string;
}

export interface AccountStatistics {
  label: number;
  value: number;
}

export interface Bucket {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  finishedAt: string | null;
  userId: string;
}

export interface File {
  id: string;
  size: number;
  createdAt: string;
  userId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  count: number;
  price: number;
  preview: string;
  createdAt: string;
  purchasedAt: string | null;
  userId: string;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  company: string;
  salary: number;
  payday: number;
  createdAt: string;
}
