import { TMedicine } from '../medicines/types';

export type TCreateOrderPayload = {
  orderDetails: {
    medicine: TMedicine;
    quantity: number;
  }[];
  address: string;
};

export type TOrder = {
  id: string;
  _id: string;
  orderDetails: {
    medicineId: string;
    quantity: number;
    _id: string;
  }[];
  totalQuantity: number;
  totalPrice: number;
  userId: string;
  status: string;
  address: string;
};
