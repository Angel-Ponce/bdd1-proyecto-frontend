const insertSymbolAtPosition = (
  number: number,
  position: number,
  symbol: string
): string => {
  return (
    number.toString().slice(0, position) +
    symbol +
    number.toString().slice(position)
  );
};

export { insertSymbolAtPosition };
