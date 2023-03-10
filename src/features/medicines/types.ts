export type TMedicine = {
  _id: string;
  id: string;
  name: string;
  companyName: string;
  details: string;
  expiredDate: string;
  price: number;
  stocks: number;
  categoryId: string;
  pictureUrls: string[];
  picPublicIds: string[];
  orderCount: number;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
  categoryDetail: {
    id: string;
    title: string;
    pictureUrls: string[];
    picPublicIds: string[];
    createdAt: string;
    updatedAt: string;
  };
};
