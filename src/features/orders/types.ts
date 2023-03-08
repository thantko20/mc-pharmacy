import { TMedicine } from '../medicines/types';

export type TCreateOrderPayload = {
  orderDetails: {
    medicine: string;
    quantity: number;
  }[];
  address: string;
};

export type TOrder = {
  id: string;
  _id: string;
  orderDetails: {
    medicine: TMedicine;
    quantity: number;
    _id: string;
  }[];
  totalQuantity: number;
  totalPrice: number;
  userId: string;
  status: 'pending' | 'deliver' | 'complete' | 'cancel';
  address: string;
  createdAt: string;
  updatedAt: string;
};
