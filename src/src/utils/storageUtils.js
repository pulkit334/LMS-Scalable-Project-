    export const setHashedItem = (key, value) => {
    const encodedKey = btoa(key);
    const encodedValue = btoa(JSON.stringify(value));
    localStorage.setItem(encodedKey, encodedValue);
    };

    export const getHashedItem = (key) => {
    const encodedKey = btoa(key);
    const value = localStorage.getItem(encodedKey);
    return value ? JSON.parse(atob(value)) : null;
    };

    export const removeHashedItem = (key) => {
    localStorage.removeItem(btoa(key));
    };
