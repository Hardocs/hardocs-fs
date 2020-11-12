export const generateId = (base64: string): string => {
  return `${base64.length}-${base64.slice(0, 10)}-${base64.slice(
    base64.length - 10,
    base64.length
  )}`;
};
