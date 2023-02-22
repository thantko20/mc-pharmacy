export type TUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  pictureUrls: string[];
  picPublicIds: string[];
  isTwoFactor: boolean;
  phoneNumber: string;
  favouriteMedicines: string[];
  createdAt: string;
  updatedAt: string;
};
