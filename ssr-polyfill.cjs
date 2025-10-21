// ssr-polyfill.cjs
(function () {
  // cria window no ambiente Node (SSR)
  if (typeof global.window === 'undefined') {
    global.window = {};
  }

  // polyfill simples de localStorage
  const makeLocalStorage = () => ({
    _data: new Map(),
    getItem(key) { return this._data.has(key) ? this._data.get(key) : null; },
    setItem(key, value) { this._data.set(String(key), String(value)); },
    removeItem(key) { this._data.delete(String(key)); },
    clear() { this._data.clear(); },
    key(i) { return Array.from(this._data.keys())[i] ?? null; },
    get length() { return this._data.size; },
  });

  if (typeof global.localStorage === 'undefined') {
    global.localStorage = makeLocalStorage();
  }
  if (typeof global.window.localStorage === 'undefined') {
    global.window.localStorage = global.localStorage;
  }
})();