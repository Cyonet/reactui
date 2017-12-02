import { toJSON, stringify } from './utils';
/**
 * localStorage, sessionStorage 本地缓存
 * @param  {[type]} [store=localStorage] [description]
 * @param  {[type]} [getKey=key          =>            key] [description]
 * @return {[type]}                      [description]
 */
export default function storage(store = localStorage, getKey = key => key) {
  return {
    getItem(key) {
      return store.getItem(getKey(key));
    },
    setItem(key, data) {
      store.setItem(getKey(key), data);
    },
    getJSONItem(key) {
      return toJSON(store.getItem(getKey(key)));
    },
    setJSONItem(key, data) {
      store.setItem(getKey(key), stringify(data));
    },
    removeItem(key) {
      return store.removeItem(getKey(key));
    },
    clear() {
      store.clear();
    },
  };
}
