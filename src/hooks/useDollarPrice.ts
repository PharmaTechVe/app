import { useEffect, useState } from 'react';

export function useDollarPrice() {
  const [dollarPrice, setDollarPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd')
      .then((res) => res.json())
      .then((data) => setDollarPrice(data.price))
      .catch(() => setDollarPrice(null));
  }, []);

  return dollarPrice;
}
