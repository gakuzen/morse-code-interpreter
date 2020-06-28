export const sleep = (ms: number): Promise<unknown> => {
  return new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, ms));
};
