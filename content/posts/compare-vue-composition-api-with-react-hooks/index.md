---
title: 对比 Vue Composition API 和 React Hooks
slug: compare-vue-composition-api-with-react-hooks
date: 2020-05-10
author: Edward Elric
image: vue.jpg
tags:
  - Vue
  - Composition API
  - React
  - React Hooks
---

# 引言

最近 [Vue 3.0](https://github.com/vuejs/vue-next) 发布了 Beta 版本，其中最引人注意的就是其 `Composition API`。而这个设计近期经常被拿来和
`React Hooks` 进行比较，以下是两个代码片段：

```jsx
// React
function Component(props) {
  const [a, setA] = useState(0)
  return <a onClick={() => setA(x => x + 1)}>{a}</a>
}
```

```jsx
// Vue 3 composition API
function Component(props) {
  const a = ref(0)
  const setA = () => a.value++
  return <a onClick={setA}>{a}</a>
}
```

我们可以看到两者的心智模型非常不同，React 编程范式更接近于纯函数，Vue 则采取了 Reactivity 的模式。

# React Hooks 的心智负担

React Hooks 是在 2018 年 10 月 React Conf 的时候正式向广大开发者进行宣传，在当时看到 Dan Abramov 演讲以及现场使用 React Hooks 重构 Class Component 的时候简直惊为天人，那一刻我深深被 Function Programming 所着迷。
然而，直到如今一年半开发者各种实践，发现 React Hooks 并没有想象中的那么美好。你现在可以在知乎、掘金等各类平台上搜寻到大量的《React Hooks 最佳实践》，这不禁让人深思：React Hooks 怎么没那么美好了？

React Hooks 开发经常提及的一些问题我列举几个：

1. 我该使用单个 state 变量还是多个 state 变量？
2. deps 依赖过多，导致 Hooks 难以维护？
3. 该不该使用 useMemo？

然后基于这些问题的最佳实践，人们又总结出：

1. 将完全不相关的 state 拆分为多组 state。
2. 如果某些 state 是相互关联的，或者需要一起发生改变，就可以把它们合并为一组 state。
3. 依赖数组依赖的值最好不要超过 3 个，否则会导致代码会难以维护。
4. 如果发现依赖数组依赖的值过多，我们应该采取一些方法来减少它。
   1. 去掉不必要的依赖。
   2. 将 Hook 拆分为更小的单元，每个 Hook 依赖于各自的依赖数组。
   3. 通过合并相关的 state，将多个依赖值聚合为一个。
   4. 通过 setState 回调函数获取最新的 state，以减少外部依赖。
   5. 通过 ref 来读取可变变量的值，不过需要注意控制修改它的途径。
5. 应该使用 useMemo 的场景：
   1. 保持引用相等
   2. 成本很高的计算
6. 无需使用 useMemo 的场景：
   1. 如果返回的值是原始值： string, boolean, null, undefined, number, symbol（不包括动态声明的 Symbol），一般不需要使用 useMemo。
   2. 仅在组件内部用到的 object、array、函数等（没有作为 props 传递给子组件），且没有用到其他 Hook 的依赖数组中，一般不需要使用 useMemo。
7. Hooks、Render Props 和高阶组件都有各自的使用场景，具体使用哪一种要看实际情况。
8. 若 Hook 类型相同，且依赖数组一致时，应该合并成一个 Hook。
9. 自定义 Hooks 的返回值可以使用 Tuple 类型，更易于在外部重命名。如果返回的值过多，则不建议使用。
10. ref 不要直接暴露给外部使用，而是提供一个修改值的方法。
11. 在使用 useMemo 或者 useCallback 时，可以借助 ref 或者 setState callback，确保返回的函数只创建一次。也就是说，函数不会根据依赖数组的变化而二次创建。

React Hooks 给人一种美丽的错觉，Function Component 可以非常简单，但长期开发下才逐渐暴露出函数式编程在 JavaScript 中的困境。
对这个问题大家在思考，而 Vue 3.0 也在思考如何从 React Hooks 上取其精华去其糟粕。我们可以在 Vue RFC 中看到最初的 [Class API](https://github.com/vuejs/rfcs/pull/17) 到 [Function-based Component API](https://github.com/vuejs/rfcs/pull/42) 取其 FP 的精华，再到被修订为 [Composition API](https://github.com/vuejs/rfcs/pull/78) 采用 Reactivity 的过程。

这种改变和 JavaScript 这门语言本身的编程范式离不开，主要还是围绕一等公民函数、动态类型这两点。

# Vue Composition API 是否美好

Vue 一直被人所称道的就是其开发简便，这也是隐式依赖跟踪带来的便利。然而成也萧何败也萧何，Vue 诟病的一点就是闭包对象的不可预测性，例如 this。

在 Vue Composition API 中，我发现官方对 Ref 和 Reactive 给出了最佳实践。可能这里就有所谓的幻灭存在，就像当年很多人不听 React 官方最佳实践，在 componentWillMount 里获取数据一样。

[Ref vs. Reactive](https://composition-api.vuejs.org/#ref-vs-reactive) 章节中有如下的对比：

```js
// style 1: separate variables
let x = 0
let y = 0

function updatePosition(e) {
  x = e.pageX
  y = e.pageY
}

// --- compared to ---

// style 2: single object
const pos = {
  x: 0,
  y: 0
}

function updatePosition(e) {
  pos.x = e.pageX
  pos.y = e.pageY
}
```

那么依赖跟踪的迷惑就此开始，因为当你对已经 reactive 的对象进行解构赋值或者赋给新值的时候，依赖跟踪就失效了。官方对这个的态度比较模糊：

> 在现阶段，我们认为在 ref vs reactive 上实施最佳做法为时尚早。我们建议您从上面的两个选项中选择与您的心智模型相符的方式。我们将收集实开发场景下的用户真反馈，并最终提供有关此主题的更明确的指导。

# 对比两者

- Vue Composition API：闭包变量、响应式的依赖追踪
- React Hooks: 纯函数、无副作用

其实没有好坏之分，在 JavaScript 这种编程范式模棱两可的语言中，你既可以写函数，但又不能不让改引用变量（像 cpp 的 const& 一般），你又可以面向对象编程（像 Java 一样疯狂反射，咻咻咻）。

其实语言、框架没有优劣，主要看使用的人对其理解到什么程度。使用 React Hooks 就要尽量采用 immutable 变量，降低函数调用过频影响性能（部分 React 调度策略兜底）；使用 Vue 就尽量不要依赖跟踪丢失或者滥用依赖跟踪导致行为不可预测。

# 最后

React 和 Vue 没有不可调和之处，他们是 JavaScript 这门语言一体两面的提现。

未来哪个社区更加繁荣还是要看 TC39 把 JavaScript 带向何方，是更加 Functional Programming 呢？还是更加 Imperative Programming 呢？
