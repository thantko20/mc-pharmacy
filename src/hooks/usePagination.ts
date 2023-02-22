import { useCallback, useEffect, useState } from 'react';

export const usePagination = ({ limit }: { total: number; limit: number }) => {
  const [page, setPage] = useState(1);

  const previousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  return { page, previousPage };
};
