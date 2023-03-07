const EventBus = require('cz-event-bus-lib');
const { isObject } = require('../tools');

class CZEventStore {
  constructor({ state, actions }) {
    if (!isObject(state)) throw new TypeError('state应为Object类型');
    if (actions && isObject(action)) {
      const values = Object.values(actions);
      for (const value of values) {
        if (typeof value !== 'function')
          throw new TypeError('actions应为Function类型');
      }
      this.actions = actions;
    }
    // 初始化
    this.state = state;
    this._observe(state);
    this.event = new EventBus();
    this.eventV2 = new EventBus();
  }

  /**
   * 观察state对象变化，对state数据进行劫持
   * @param object state 订阅对象
   */
  _observe(state) {
    const _this = this;
    Object.keys(state).forEach((key) => {
      let _value = state[key];
      Object.defineProperty(state, key, {
        get: function () {
          return _value;
        },
        set: function (newValue) {
          if (_value === newValue) return;
          _value = newValue;
          _this.event.emit(key, _value);
          this.eventV2(key, { [key]: _value });
        },
      });
    });
  }

  /**
   *  监听单个状态遍鞥
   * @param {string} stateKey 监听的值
   * @param function stateCallback 监听回调
   */
  onState(stateKey, stateCallback) {
    // 处理key
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new TypeError('类型错误，该状态不是一个合法的key');
    }
    this.event.on(stateKey, stateCallback);

    // 处理callback
    if (typeof stateCallback !== 'function') {
      throw new TypeError('类型错误，该回来不是一个Function类型的参数');
    }
    const value = this.state[stateKey];
    stateCallback.apply(this.state, [value]);
  }

  /**
   *  监听多状态变更
   * @param {string} statesKeys 监听的值
   * @param function stateCallback 监听回调
   */
  onStates(stateKeys, stateCallback) {
    const keys = Object.keys(this.state);
    const value = {};
    for (const theKey of stateKeys) {
      if (keys.indexOf(theKey) === -1) {
        throw new Error('类型错误，该状态不是一个合法的key');
      }
      this.eventV2.on(theKey, stateCallback);
      value[theKey] = this.state[theKey];
    }
    stateCallback.apply(this.state, [value]);
  }

  /**
   *  取消指定值的坚挺
   * @param string stateKey 监听的值
   * @param function stateCallback 监听回调
   */
  offState(stateKey, stateCallback) {
    const keys = Object.keys(this.state);
    if (keys.indexOf(stateKey) === -1) {
      throw new TypeError('类型错误，该状态不是一个合法的key');
    }

    this.event.off(stateKey, stateCallback);
  }

  /**
   *
   * @param {string} stateKey state对象中的键
   * @param {*} stateValue state对象中的值
   */
  setState(stateKey, stateValue) {
    this.state[stateKey] = stateValue;
  }

  /**
   * 事件派发
   * @param string actionName 事件名
   * @param  {any} args
   */
  dispatch(actionName, ...args) {
    if (typeof actionName !== 'string') {
      throw new TypeError('类型错误，该事件名不是一个string类型');
    }
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new TypeError('此操作名称不存在，请检查');
    }
    const actionFn = this.actions[actionName];
    actionFn.apply(this, [this.state, ...args]);
  }
}

module.exports = CZEventStore;
