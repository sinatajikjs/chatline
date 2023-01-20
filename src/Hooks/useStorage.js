const useStorage = () => {
  const getStorage = (key) => {
    return JSON.parse(localStorage.getItem(`messanger-${key}`));
  };
  const setStorage = (key, data) => {
    localStorage.setItem(`messanger-${key}`, JSON.stringify(data));
  };
  const deleteStorage = (key) => {
    localStorage.removeItem(`messanger-${key}`);
  };
  return { getStorage, setStorage,deleteStorage };
};

export default useStorage;
