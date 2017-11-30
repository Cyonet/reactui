const win = window || global;
/**
 * 函数节流
 * @fn {function} 回调函数
 * @time {number} 时间，毫秒
 * */
export function throttle(fn, time = 200) {
  if (throttle.id) {
    clearTimeout(throttle.id);
  }
  throttle.id = setTimeout(() => {
    fn();
  }, time);
}
/**
 * 空函数
 * @return {boolean} true
 */
export function noop() {}
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
  if (target === undefined || target === null || target === '') return true;
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

export function inArray(arr, v) {
  return arr.indexOf(v) > -1;
}

export function isNumeric(obj) {
  const type = typeof obj;
  return (type === 'number' || type === 'string') && !win.isNaN(obj - parseFloat(obj));
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

export default {
  throttle,
};
