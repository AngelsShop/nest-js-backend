export const getInsertValuesPlaceholders = (values: unknown[]) => {
  return values.map((_, index) => `$${index + 1}`).join();
};
