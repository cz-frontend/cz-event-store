## 介绍

cz-event-store 是一个跨平台的 javascript 集中式状态管理库

## 支持

- Vue
- React
- Angular
- UNI APP
- 小程序

## 安装

```
npm i cz-event-store

or

yarn add cz-event-store
```

## 引入

```
import { CZEventStore } from 'cz-event-store'

or

const { CZEventStore } = require("cz-event-store")

```

## 示例

**网络请求**

```

const loginEventStore = new CZEventStore({
  state: {
    roles: [],
    menus: [],
  },
  actions: {
    loginIn(context) {
      console.log(context)
      axios.get("http://www.baidu.com/login").then(res => {
        const { roles, menus, recommend } = res.data.data

        // 赋值
        context.roles = roles
        context.recommends = recommend
      })
    }
  }
})
```

**数据监听**
可以同时坚挺多个状态变化

```
loginEventStore.onState("token", (value) => {
  console.log("监听token:", value)
})

loginEventStore.onState("isLogin", (value) => {
  console.log("监听isLogin:", value)
})
```

**数据修改**

```
setTimeout(() => {
  loginEventStore.setState("token", "wsndy")
  loginEventStore.setState("menus", ["/page1", "/page2"])
}, 1000);

loginEventStore.dispatch("loginIn")
```

## 鸣谢

如果大家觉得这个工具好使，欢迎 star、issues
