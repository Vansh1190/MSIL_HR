const store = new Map();

export default {
  setItem: (k, v) => {
    store.set(String(k), String(v));
    return Promise.resolve();
  },
  getItem: (k) => Promise.resolve(store.has(String(k)) ? store.get(String(k)) : null),
  removeItem: (k) => {
    store.delete(String(k));
    return Promise.resolve();
  },
  flushMock: () => store.clear(),
};
