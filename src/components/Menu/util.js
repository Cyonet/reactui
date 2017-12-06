export function getComponentName(comp) {
  if (typeof comp.type === 'function') return comp.type.name;
  return '';
}

export default {
  getComponentName,
};
