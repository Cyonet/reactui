/**
 * R91 2017/5/10
 * creatStore
 */


export default (initialState)=>{
  let state = initialState;
  const listeners = [];
  function setState(partial) {
    state = {...state, ...partial};
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }
  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  return {
    setState,
    getState,
    subscribe,
  };
};
