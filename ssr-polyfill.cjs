// ssr-polyfill.cjs
// Evita que libs do client quebrem durante o "static rendering" no Node.

if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    get length() { return 0; },
  };
}

if (typeof global.window === 'undefined') {
  // Não criamos um objeto window completo de propósito; só evitamos reference error
  global.window = undefined;
}