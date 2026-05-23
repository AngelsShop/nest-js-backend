export const getInsertValuesPlaceholders = (
  values: unknown[],
  startIndex = 1,
) => {
  return values
    .map((key, index) => `${String(key)} = $${index + startIndex}`)
    .join();
};
