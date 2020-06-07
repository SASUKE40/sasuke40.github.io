---
title: 你可能不需要 Derived State
slug: you-may-dont-need-drevied-state
author: Edward Elric
hero: ./react-derived-state.jpg
tags:
  - React
date: 2018-06-15
---

React 16.4 包含了一个  [getDerivedStateFromProps 的 bugfix](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/05/23/react-v-16-4.html%23bugfix-for-getderivedstatefromprops)，这个 bug 导致一些 React 组件潜在的 bug 稳定复现。这个版本暴露了个案例，当你的应用正在使用反模式构建，则将会在此次修复后可能无法工作，我们对这个改动感到抱歉。在本文中，我们将阐述一些通常的使用 Derived State 的反模式以及相应的解决替代方案。

在很长一段时间，在 props 改变时响应 state 的更新，无需额外的渲染，唯一的途径就是  `componentWillReceiveProps`  这个生命周期方法。在 16.3 版本下，[我们介绍了一个替代的生命周期 getDerivedStateFromProps](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/03/29/react-v-16-3.html%23component-lifecycle-changes)  更加安全的方式来解决相同的用例。同时，我们意识到人们有很多关于使用这两个方法的错误解读，我们发现了这些反模式导致一些微妙且令人困惑的 bug。 `getDerivedStateFromProps`  在 16.4 中做了修复，[使得 derived state 更加可预测](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/issues/12898)，因此滥用的后果更加容易被留意到。
Note 
所有关于旧的  > `componentWillReceiveProps`  和新  > `getDerivedStateFromProps`  的反模式都会在本文中阐述。
这篇文章涵盖以下话题：

- 什么时候使用 derived state

- 使用 derived state 时通常的 bug

  - 反模式：无条件地将 prop 复制给 state

  - 反模式：当 props 改变时清除 state

- 推荐的方案

- 什么是 memoization ？

---

# 什么时候使用 Derived State

`getDerivedStateFromProps`  存在只为了一个目的。它让组件在  **props 发生改变**时更新它自身的内部 state。我们之前的文章提供一些例子，例如：[基于 offset prop 的改变记录当前滚动位置](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/03/27/update-on-async-rendering.html%23updating-state-based-on-props)或者  [通过源 prop 加载外部数据](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/03/27/update-on-async-rendering.html%23fetching-external-data-when-props-change)。

我们没有提供更多的例子，因为这有一个常规的准则，**应该保守地使用 derived state**。所有我们看到关于 derived state 的问题从根本上可以归结成两类：(1) 无条件的以 props 更新 state 或者 (2) 每当 props 和 state 不同时就更新 state。(我们将在下面谈到更多细节。)

- 当你使用 derived state 来暂存一些仅基于当前 props 的计算结果时，你不需要 derived state。查看  [什么是 memoization ?](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html%23what-about-memoization)

- 当你无条件更新 derived state 抑或是每当 props 与 state 不同时更新 state，你的组件可能会频繁重置它的 state。

---

# 使用 Derived State 时的常见 bug

“受控的” 和 “不受控的” 这两个术语经常涉及到 form 的 input，然而他们也能描述组件数据存在的位置。当数据作为 props 传递时，则数据可以被认为是**受控的**(因为父组件*控制*了这些数据)。仅存在于内部 state 的数据可以被认为是**不受控**的(因为父组件不能直接改变它)。

derived state 的最常见错误就是混合了“受控”和“不受控”两种情况；当一个 derived state 值也使用  `setState`  来更新时，那它数据来源就不是唯一的。上文提到的“[外部数据加载的例子](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/03/27/update-on-async-rendering.html%23fetching-external-data-when-props-change)”看上去好像就是这样，但其实有本质上差别。在数据加载例子中，'source' prop 和 'loading' state 都有明确的数据来源。当 'source' prop **改变**时， 'loading' state **总会**被覆盖。相反地，state 当且仅当 prop 改变时才会被覆盖，否则只能被 state 所在的组件所管理。

当这些约束被改变时问题就浮现了。这会产生两个经典形式。让我们看一看他们。

## 反模式：无条件地将 prop 复制给 state

一个常见关于  `getDerivedStateFromProps`  和  `componentWillReceiveProps`  的错误理解就是他们只会在 props “变化”时调用。无论是组件重新渲染还是 props 和之前“不同”，这些生命周期方法都会被调用。基于此，这两个生命周期方法总是被用于不安全地无条件地覆盖 state。**这样做将导致 state 的更新发生丢失。**

让我们思考一个例子来说明这个问题。这里有一个  `EmailInput`  组件“映射”了一个 email 属性在 state 中：

```javascript
class EmailInput extends Component {
  state = { email: this.props.email }

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />
  }

  handleChange = event => {
    this.setState({ email: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({ email: nextProps.email })
  }
}
```

首先，这个组件看上去没什么问题。State 被 props 传递进来的值所初始化，并在我们键入  `<input>`  的时候被更新。但是如果我们的父组件重新渲染的时候，我们输入到  `input`  的内容就会丢失([看这个例子](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/m3w9zn1z8x))！即使我们在重置前进行比较  `nextProps.email !== this.state.email`也会这样。

在这个简单的例子中，只有当 email 属性被改变时加入  `shouldComponentUpdate`  来解决重渲染。然而在实践中，组件总是接受多个 props；另一个 prop 改变时依然会导致重渲染和不当重置。在函数和对象属性在内部被创建，在一个实质性的变化发生时，实现  `shouldComponentUpdate`  可靠地只返回 true 值变得困难。[这里有个 demo 展示发生的情况](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/jl0w6r9w59)。因此， `shouldComponentUpdate`  作为性能优化的最好方式被使用，而不用在 derived state 中保证正确性。

至此，为何**无条件地将 props 复制给 state 是一个坏想法**显而易见。在 review 可能的解决方案，让我们来看看一个有关的问题模式：在 email 属性改变时，如果我们只更新 state ？

## 反模式：当 props 改变时清除 state

继续上述的例子，当  `props.email`  改变时，我们可以通过只更新来避免意外地清除 state：

```javascript
class EmailInput extends Component {
  state = {
    email: this.props.email
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.email changes, update state.
    if (nextProps.email !== this.props.email) {
      this.setState({
        email: nextProps.email
      })
    }
  }

  // ...
}
```

Note
不仅在以上例子中  > `componentWillReceiveProps` ,一个的反模式也被用于  > `getDerivedStateFromProps`  中。
我们做了很大的改进。现在我们的组件在 props 实质变化时才会清楚我们输入的内容。

但依旧存在一个微妙的问题。想象一下一个密码管理应用使用上述输入组件。当在两个相同 email 的账户下切换时，输入组件重置会失败。这是因为两个账户传递给组件的 prop 值是相同的！这使得用户感到诧异，一个账户没有保存的变更会影响另一个共享同一 email 的账号上。([这里看 demo](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/mz2lnkjkrx))

这种设计是有本质缺陷的，但它是最容易犯的。([我就犯过！](https://link.zhihu.com/?target=https%3A//twitter.com/brian_d_vaughn/status/959600888242307072))幸运的是，以下有两个更好的替代方案。而关键就是对每一片数据，你需要选一个控制数据并以其作为真实源的简单组件，并避免副本数据存在于其他组件。让我们来看一下这些替代方案。

---

# 优选方案

## 推荐：完全受控组件

一个避免上述涉及问题的途径就是完全地移除我们组件中的 state。如果 email 地址只存在于 prop，那我们没必要担心 state 的冲突。我们甚至可以把  `EmailInput`  缓存一个更加轻量的函数式的组件：

```javascript
function EmailInput(props) {
  return <input onChange={props.onChange} value={props.email} />
}
```

这个途径简化了我们组件的实现，但是我们如果想存储草稿的时候，父组件还是需要手工完成这件事。([点这看这种模式的例子](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/7154w1l551))

## 推荐：带有 key 的完全不受控组件

另一个替代方案就是我们的组件完全的控制自己的 email state “草稿”。在此例子中，我们的组件依然可以接收一个来自于*初始值*，但它将会忽略后面 prop 的改动：

```javascript
class EmailInput extends Component {
  state = { email: this.props.defaultEmail }

  handleChange = event => {
    this.setState({ email: event.target.value })
  }

  render() {
    return <input onChange={this.handleChange} value={this.state.email} />
  }
}
```

为了能在不同的情境下重置值(如密码管理方案)，我们使用特殊的 React 属性  `key` 。当  `key`  改变时，React [将创建一个新的组件实例而不是更新现有的这个](https://link.zhihu.com/?target=https%3A//reactjs.org/docs/reconciliation.html%23keys)。Keys 经常被用于动态 list，但在这里依然管用。在我们的案例中，我们能根据 user ID 在新用户被选中时重新创建 email 输入组件：

```javascript
<EmailInput defaultEmail={this.props.user.email} key={this.props.user.id} />
```

每当 ID 改变时， `EmailInput`  将会被重新创建，它的 state 将会用最新的  `defaultEmail`  值重置。([点这里看这种模式的例子](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/6v1znlxyxn))使用这种途径，你不需要为每一个输入组件加  `key` 。也许在 from 中加一个  `key`  会来得更好。每当 key 改变时，所有在 from 里的组件都会用一个新的 initialized state 来重新创建。

更多的案例中，这是一个处理需要被重置的 state 的最佳方式。
Note
虽然这貌似会很慢，在性能差异无关紧要的时候。当组件有很重的更新逻辑时候，使用一个 key ，忽略子树 diffing 甚至会更快。

## 替代方案 1：使用 ID prop 重置不受控组件

如果  `key`  由于某些原因不能被使用(也许组件有昂贵的初始化代价)，一个可行但笨重的方案就是在  `getDerivedStateFromProps`  中监听 “userID” 的改变：

```javascript
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail,
    prevPropsUserID: this.props.userID
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevPropsUserID) {
      return {
        prevPropsUserID: props.userID,
        email: props.defaultEmail
      }
    }
    return null
  }

  // ...
}
```

这也提供了灵活性——重置部分被我们选中的组件内部 state。([点这里看此模式的 demo](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/rjyvp7l3rq))
Note
及时以上例子展示了  > `getDerivedStateFromProps` ，同样的技术手段也可以被用在  > `componentWillReceiveProps` 。

## 替代方式 2：在一个实例方法中重置不受控组件

更罕见地，你可能需要重置 state 即使没有适当的 ID 可用为  `key` 。一个解决方案就是每次你想重置时用一个随机数或者自增数字重置 key。另一个可行的方案是暴露一个实例方法命令式的重置内部 state：

```javascript
class EmailInput extends Component {
  state = {
    email: this.props.defaultEmail
  }

  resetEmailForNewUser(newEmail) {
    this.setState({ email: newEmail })
  }

  // ...
}
```

父组件能[用 ref 来调用这个方法](https://link.zhihu.com/?target=https%3A//reactjs.org/docs/glossary.html%23refs)。([点击这看这个模式例子](https://link.zhihu.com/?target=https%3A//codesandbox.io/s/l70krvpykl))

Refs 在这个确定的例子中是有用的，但通常上我们建议你保守使用。甚至在这个 demo 中，这个必要的方法是不理想的，因为本来一次的渲染会变成两次。

---

# 扼要重述

重述一下，当设计一个组件的时候，决定数据是否受控或不受控是至关重要的。

让组件变得**受控**，而不是试图在** state 中复制一个 prop **，在一些父组件的 state 中联合两个分散的值。举个例子，与其子组件接收一个“已提交的” `props.value`  并跟踪一个“草稿” `state.value` ，不如在父组件中管理  `state.draftValue`  和  `state.committedValue` ，并控制直接控制子组件的值。这让数据流更加明确和可预测。

对**不受控**组件，如果你在一个特殊的 prop (通常是 ID)改变时试图重置 state，你有一些选择：

- **推荐：重置所有内部 state，使用 key 属性**

- 替代方案 1：_仅重置确定的 state 字段_，监听特定属性的变化(例如： `props.userID`)。

- 替代方案 2：你也可以考虑使用 refs 调用一个命令式实例方法。

---

# 什么是 memoization ?

我们也看到，仅当输入变化的时候，derived state 被用于确保关键值被用于  `render`  中会重新计算。这个技巧被称之为  [memoization](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Memoization)。

使用 derived state 来完成 memoization 并不一定是坏事，但这经常不是最佳方案。管理 derived state 具有内在复杂度，这个复杂度随着属性的增加而提升。例如，如果我们想要加入第二个 derived feild 到我们的组件 state，那么我们的实现将需要分别跟踪两者的变化。

让我们来看一个例子——组件携带一个属性(一个 item list)，并渲染匹配用户输入的搜索查询的 item。我们使用 derived state 存储过滤的 list：

```javascript
class Example extends Component {
  state = {
    filterText: ''
  }

  // *******************************************************
  // NOTE: this example is NOT the recommended approach.
  // See the examples below for our recommendations instead.
  // *******************************************************

  static getDerivedStateFromProps(props, state) {
    // Re-run the filter whenever the list array or filter text change.
    // Note we need to store prevPropsList and prevFilterText to detect changes.
    if (
      props.list !== state.prevPropsList ||
      state.prevFilterText !== state.filterText
    ) {
      return {
        prevPropsList: props.list,
        prevFilterText: state.filterText,
        filteredList: props.list.filter(item =>
          item.text.includes(state.filterText)
        )
      }
    }
    return null
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value })
  }

  render() {
    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>
          {this.state.filteredList.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </Fragment>
    )
  }
}
```

这个实现避免了不必要  `filteredList`  的重新计算。但这比原来的更复杂，因为他必须分开跟踪和检测 props 和 state 的变化，才能正确更新过滤后的列表。在这个例子中，我们能使用  `PureComponent`  简化工作，移动更新操作到 render 方法中：

```javascript
// PureComponents only rerender if at least one state or prop value changes.
// Change is determined by doing a shallow comparison of state and prop keys.
class Example extends PureComponent {
  // State only needs to hold the current filter text value:
  state = {
    filterText: ''
  }

  handleChange = event => {
    this.setState({ filterText: event.target.value })
  }

  render() {
    // The render method on this PureComponent is called only if
    // props.list or state.filterText has changed.
    const filteredList = this.props.list.filter(item =>
      item.text.includes(this.state.filterText)
    )

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>
          {filteredList.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </Fragment>
    )
  }
}
```

这种途径比用 derived state 更加清晰且简单。偶尔地，这不够好——在大列表中过滤会变得慢，如果其他 prop 变化时  `PureComponent`  不会阻止重渲染。为了解决这些问题，我们可以加入一个 memoization helper 来避免对 list 的不必要过滤：

```javascript
import memoize from 'memoize-one'

class Example extends Component {
  // State only needs to hold the current filter text value:
  state = { filterText: '' }

  // Re-run the filter whenever the list array or filter text changes:
  filter = memoize((list, filterText) =>
    list.filter(item => item.text.includes(filterText))
  )

  handleChange = event => {
    this.setState({ filterText: event.target.value })
  }

  render() {
    // Calculate the latest filtered list. If these arguments haven't changed
    // since the last render, `memoize-one` will reuse the last return value.
    const filteredList = this.filter(this.props.list, this.state.filterText)

    return (
      <Fragment>
        <input onChange={this.handleChange} value={this.state.filterText} />
        <ul>
          {filteredList.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </Fragment>
    )
  }
}
```

这更加简单，而且性能和 derived state 版本的一样好！

当使用 memoization 时，记住一些约束条件：

1. 在大多数案例中，你会想把 memoized 函数附加到组件实例上。这防止一个组件的多个实例重置彼此的 memoized key。

2. 通常地，你会想使用一个具有缓存大小限制的 memoization helper 来避免内存泄露问题。（在以上的例子中，我们用了  `memoize-one`  因为它仅缓存最近的参数和结果。）

3. 如果  `props.list`  在每次父组件渲染时被重新创建，本节中展示的实现手段是无法工作的。但在多数案例中，这种设置是适当的。

---

# 结语

在实际的应用中，组件经常包含受控和不受控行为的混合。这是没问题的！如果每一个值都有清晰的真实源，你可以避免上面提及的反模式。

同样值得重申的是， `getDerivedStateFromProps` (一般的 derived state) 是一个高级特性，由于其复杂度，应该保守的使用它。如果你使用的案例超出这些模式，请在  [Github](https://link.zhihu.com/?target=https%3A//github.com/reactjs/reactjs.org/issues/new)  或  [Twitter](https://link.zhihu.com/?target=https%3A//twitter.com/reactjs)  上与我们分享！

原文链接：[You Probably Don't Need Derived State - React Blog](https://link.zhihu.com/?target=https%3A//reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
