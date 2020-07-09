export const resolver = {
  Query: {
    hello: (_: any, { name }: { name: string }): string => {
      return `Hello ${name || 'world'}`;
    }
  }
};
