// 全局时间注册，返回remove函数
const GLOBAL_NOOP = {};

function hanlderTypeEvent(e) {
  const listens = GLOBAL_NOOP[e.type] || [];
  listens.forEach(listen => listen({ x: e.pageX, y: e.pageY }));
}

function addTriggerEvent(type, listen) {
  if (!GLOBAL_NOOP[type]) {
    document.addEventListener(type, hanlderTypeEvent, false);
  }
  GLOBAL_NOOP[type] = GLOBAL_NOOP[type] || [];
  const listens = GLOBAL_NOOP[type];
  listens.push(listen);
  return function remove() {
    listens.splice(listens.indexOf(listen), 1);
  };
}

export default addTriggerEvent;
