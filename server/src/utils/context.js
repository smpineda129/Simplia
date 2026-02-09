import { AsyncLocalStorage } from 'node:async_hooks';

export const context = new AsyncLocalStorage();

export const getContext = () => {
  const store = context.getStore();
  if (!store) return null;
  return store;
};
