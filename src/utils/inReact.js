function gGetRect(element) {
  const doc = document;
  const rect = element.getBoundingClientRect();
  const scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;
  const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
  const top = document.documentElement.clientTop;
  const left = document.documentElement.clientLeft;
  return {
    top: (rect.top - top) + scrollTop,
    bottom: (rect.bottom - top) + scrollTop,
    left: (rect.left - left) + scrollLeft,
    right: (rect.right - left) + scrollLeft,
  };
}
export default function inReact(dom, pointer) {
  const rect = gGetRect(dom);
  return (pointer.x <= rect.right) && pointer.x >= rect.left && pointer.y <= rect.bottom && pointer.y >= rect.top;
}
