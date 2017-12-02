// 全局时间注册，返回remove函数
const noop = {};

function hanlderTypeEvent(e) {
  const listens = noop[e.type] || [];
  listens.forEach(listen => listen({ x: e.pageX, y: e.pageY }));
}

function addTriggerEvent(type, listen) {
  if (!noop[type]) {
    document.addEventListener(type, hanlderTypeEvent, false);
  }
  noop[type] = noop[type] || [];
  const listens = noop[type];
  listens.push(listen);
  return function remove() {
    listens.splice(listens.indexOf(listen), 1);
  };
}

export default addTriggerEvent;
