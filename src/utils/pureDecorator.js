import { pureCompare, isFunction } from './utils';

export default function pureDecorator(component) {
  const prot = component.prototype;
  const old = prot.shouldComponentUpdate;
  prot.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return pureCompare(this, nextProps, nextState) && (isFunction(old) ? old.call(this, nextProps, nextState) : true);
  };
  return component;
}
