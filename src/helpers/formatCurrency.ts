const formatCurrency = (value: number): string => {
  const res = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GTQ",
  }).format(value);

  return res.slice(2, res.length);
};

export { formatCurrency };
