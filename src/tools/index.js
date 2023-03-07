/**
 * 对象类型检测
 * @param {object} option 检测对象
 * @returns boolean
 */
function isObject(option) {
  return option?.constructor === Object;
}

module.exports = {
  isObject,
};
