const win = window || global;

export const NOT_TRUE = false;
export const TRUE = true;
export const UNDFINED = undefined;
export const NULL = null;
export const PLAIN_OBJECT = {};
export const EMPTY_ARRAY = [];
/**
 * 函数节流
 * @fn {function} 回调函数
 * @delay {number} 时间，毫秒
 * */
export function throttle(fn, delay = 200) {
  let timeId = null;
  return function(){
     const context = this;
     const args = arguments;
        if(!function){
            function = setTimeout(function(){
               fn.apply(context, args);
               timeId = null;
           ,delay);
        }
    }
}
/**
 * 空函数
 * @return {boolean} true
 */
export function noop(arg) { return arg; }
/**
 * 判断属性
 * @param  {Object}  obj 操作对象
 * @param  {string}  key key
 * @return {Boolean}     result
 */
export function hasOwnProperty(obj, key) {
  return Object.hasOwnProperty.call(obj, key);
}

/**
 * 去除对象给定的属性
 * @param  {Object} [obj={}]  [description]
 * @param  {Array}  [keys=[]] [description]
 * @return {[type]}           [description]
 */
export function extract(obj = {}, keys = []) {
  const surplus = { ...obj };
  let loops = keys;
  if (typeof keys === 'string') { loops = [keys]; }
  loops.forEach(key => {
    if ((key in obj) && hasOwnProperty(obj, key)) {
      delete surplus[key];
    }
  });
  return surplus;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

/**
 * 判断给定值是否为空,字符串，空对象，空数组
 * @param  {[type]}  target [description]
 * @return {Boolean}        [description]
 */
export function isEmpty(target) {
  if (target === UNDFINED || target === NULL || target === '') return true;
  if (isArray(target)) {
    return target.length === 0;
  }
  if (typeof target === 'object') {
    const keys = Object.keys(target);
    return !!keys.length;
  }
  return false;
}

export function isFunction(fn) {
  return !!fn && typeof fn !== 'string' && !fn.nodeName && fn.constructor !== Array && /^[\s[]?function/.test(`${fn}`);
}
export function getIndex(arr, v) {
  return arr.indexOf(v);
}

export function inArray(arr, v) {
  return getIndex(arr, v) > -1;
}

export function isObjectLike(value) {
  return typeof value === 'object' && value !== null;
}
export function isPlainObject(value) {
  if (!isObjectLike(value) || Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
export function isNumeric(obj) {
  const type = typeof obj;
  return (type === 'number' || type === 'string') && !win.isNaN(obj - parseFloat(obj));
}
export function formatDouble(fixed = 2) {
  return (value) => {
    if (isNumeric(value)) {
      return +(parseFloat(value) || 0).toFixed(fixed);
    }
    return value;
  };
}
/**
 * 将class转换为驼峰
 * @param  {[type]} str     [description]
 * @param  {String} [h='-'] [description]
 * @return {[type]}         [description]
 */
export function hyphenToCamelcase(str, h = '-') {
  return str.replace(new RegExp(`${h}(\\w)`, 'g'), (all, mactch) => mactch.toUpperCase());
}
export function is(x, y) {
  if (x === y) {
    return (x !== 0 || y !== 0) || (1 / x === 1 / y);
  }
  return win.isNaN(x) && win.isNaN(y);
}
// 浅比较两个
export function shallowEqual(a, b) {
  if (is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0, len = aKeys.length; i < len; i++) {
    if (hasOwnProperty(b, aKeys[i])) return true;
    return a[aKeys[i]] === b[bKeys[i]];
  }
  return true;
}

export function pureCompare(instance, nextProps, nextState) {
  return !(shallowEqual(instance.props, nextProps) && shallowEqual(instance.state, nextState));
}

export function toJSON(str) {
  if (str) return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export function stringify(str) {
  try {
    return JSON.stringify(str);
  } catch (e) {
    return '';
  }
}
/**
 * [unique 数组去重]
 * @return {[type]} [description]
 */
export function unique(arr) {
  const res = [];
  const json = {};
  for (let i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i]);
      json[arr[i]] = 1;
    }
  }
  return res;
}
export default {
  throttle,
};
