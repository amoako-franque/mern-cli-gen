if (typeof global.localStorage !== 'undefined') {
    // Configurable for newer Node versions
    Object.defineProperty(global, 'localStorage', { value: undefined });
}
