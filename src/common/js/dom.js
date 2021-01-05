export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}
export function getData(el, name, val) {
  const prefix = 'data-';
  if (val) {
    // 设置属性
    return el.setAttribute(prefix + name,val)
  }
  // 获取属性
  return el.getAttribute(prefix + name);
}