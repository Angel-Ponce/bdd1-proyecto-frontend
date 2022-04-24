const separateNumberWithDashes = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "-");
};

export { separateNumberWithDashes };
