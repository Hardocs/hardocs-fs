export const createHashFromValue = (value: any) => {
  let hash = 0;
  if (value.length === 0) return hash;

  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return hash;
};
