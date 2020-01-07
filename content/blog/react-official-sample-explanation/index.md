---
title: React 官網示例講解
date: 2016-03-01
tags:
  - MVVM
  - React
---

# 前言

可能大家會問：“官網示例那麼簡單，有必要講解嗎？”，我的看法是：“非常需要！”。一般而言，官方文檔是學習新知識最好的去處，你可以瞭解它的理念、思想、模式和 API 等等，可謂是無所不包。相對來說，官網的 Sample 就是能快速的瞭解和切入的直觀體現。因此，今天來看看官網的示例要告訴我們什麼，相信它對感興趣 React 但是不是很瞭解的人可以有個感性的瞭解。

# 什麼是 React（個人見解/官方簡介轉述）

1. 它只做 UI 層面的事，你可以理解為是 Web Component 的特殊實現
2. Virtual DOM，就一個字：“快”，同時支持服務端渲染
3. 數據流，單向的數據綁定足夠應付大部分的業務場景，同時使得數據和事件的流動變得清晰

# 怎麼開始用上 React

這裡我們先不用 Webpack、gulp 這些這麼“高級”的工具，方便小白入門。
我們直接引入對應的腳本更加方便，大概是這樣子的：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Sample 1</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://cdn.bootcss.com/babel-core/5.8.34/browser.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-with-addons.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-dom.js"></script>
    <script type="text/babel">
      var mountNode = document.getElementById('container')

      var HelloMessage = React.createClass({
        render: function() {
          return <div>Hello {this.props.name}</div>
        },
      })

      ReactDOM.render(<HelloMessage name="SASUKE40" />, mountNode)
    </script>
  </body>
</html>
```

這是官網的第一個示例，當然官網略去了很多東西沒說。
先說一下上面代碼我加了的東西：

1. `browser.js` 是 `babel` 的瀏覽器版本，`babel` 是一個很酷的東西，自己 Google 下就知道有多酷。提示一下，千萬別急著用 babel6，你會用哭的~
2. `react` 就不必多說了，我們的主角
3. `react-dom` 是最近從 `react` 拆出來的，以前是包在 `react` 中的

細心的朋友可能看到 `type="text/babel"` 這個奇怪的類型屬性，其實它是為了讓 `babel` 能去轉換 `jsx` 成瀏覽器讀得懂兼容較好的 `JavaScript`

# 示例初步講解

為什麼說初步呢？因為深挖底層具體的動作，可能很多人都會暈，所以只講表層我們看的到的東西。

第一個官方示例主要分成兩個步驟：

1. 創建 React 類，使用 `React.createClass` 創建，傳入一個 object，
   這個 object 有個成員屬性 render 返回 `jsx`
2. 用 ReactDOM 如渲染並掛載到某個具體的 DOM 節點上

> 額外的 Tip：在這裡的 `<div>Hello {this.props.name}</div>` 這一部分並不是 HTML，而是貨真價實的 JavaScript，並且創建出來對象是 React 實例，並不是 HTML 的 DOM 節點。

# 使用 React 在這個示例的好處

可以自定義標籤屬性，在渲染的時候可以插入到內容中

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Sample 2</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://cdn.bootcss.com/babel-core/5.8.34/browser.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-with-addons.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-dom.js"></script>
    <script type="text/babel">
      var mountNode = document.getElementById('container')

      var Timer = React.createClass({
        getInitialState: function() {
          return { secondsElapsed: 0 }
        },
        tick: function() {
          this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
        },
        componentDidMount: function() {
          this.interval = setInterval(this.tick, 1000)
        },
        componentWillUnmount: function() {
          clearInterval(this.interval)
        },
        render: function() {
          return <div>過去了：{this.state.secondsElapsed}秒</div>
        },
      })

      ReactDOM.render(<Timer />, mountNode)
    </script>
  </body>
</html>
```

這個示例多了好多：

1. `getInitialState` 是一個關鍵的成員屬性，它可以初始化 state，在 render 中可以調用 `this.state.xxx` 就能拿到
2. `tick` 是一個自定義的成員屬性，其中 `this.setState` 是 React 類的關鍵方法，可以修改 state 的值
3. `componentDidMount` 顧名思義，在掛載後執行一些東西，這裡是弄了個定時器
4. `componentWillUnmount` 也顧名思義，將要卸載的時候做點事情，良好的編碼習慣，這裡清除定時

# 示例 3

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Sample 3</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://cdn.bootcss.com/babel-core/5.8.34/browser.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-with-addons.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-dom.js"></script>
    <script type="text/babel">
      var mountNode = document.getElementById('container')

      var TodoList = React.createClass({
        render: function() {
          var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>
          }
          return <ul>{this.props.items.map(createItem)}</ul>
        },
      })
      var TodoApp = React.createClass({
        getInitialState: function() {
          return { items: [], text: '' }
        },
        onChange: function(e) {
          this.setState({ text: e.target.value })
        },
        handleSubmit: function(e) {
          e.preventDefault()
          var nextItems = this.state.items.concat([
            { text: this.state.text, id: Date.now() },
          ])
          var nextText = ''
          this.setState({ items: nextItems, text: nextText })
        },
        render: function() {
          return (
            <div>
              <h3>TODO</h3>
              <TodoList items={this.state.items} />
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.onChange} value={this.state.text} />
                <button>{'Add #' + (this.state.items.length + 1)}</button>
              </form>
            </div>
          )
        },
      })

      ReactDOM.render(<TodoApp />, mountNode)
    </script>
  </body>
</html>
```

關鍵點：

1. 標籤可以嵌套
2. 可以些一些事件，以自定義事件函數體現，不管這裡的是 JavaScript 的事件，並不是 DOM 節點上定義的
3. 列表組件定義的一種推薦寫法：`this.props.items.map` 傳入單個組件

# 示例 4

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Sample 4</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="http://cdn.bootcss.com/babel-core/5.8.34/browser.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-with-addons.js"></script>
    <script src="http://cdn.bootcss.com/react/0.14.7/react-dom.js"></script>
    <script src="http://cdn.bootcss.com/marked/0.3.5/marked.js"></script>
    <script type="text/babel">
      var mountNode = document.getElementById('container')

      var MarkdownEditor = React.createClass({
        getInitialState: function() {
          return { value: 'Type some *markdown* here!' }
        },
        handleChange: function() {
          this.setState({ value: this.refs.textarea.value })
        },
        rawMarkup: function() {
          return { __html: marked(this.state.value, { sanitize: true }) }
        },
        render: function() {
          return (
            <div className="MarkdownEditor">
              <h3>Input</h3>
              <textarea
                onChange={this.handleChange}
                ref="textarea"
                defaultValue={this.state.value}
              />
              <h3>Output</h3>
              <div
                className="content"
                dangerouslySetInnerHTML={this.rawMarkup()}
              />
            </div>
          )
        },
      })

      ReactDOM.render(<MarkdownEditor />, mountNode)
    </script>
  </body>
</html>
```

關鍵點：

1. 可以使用自定義函數用作過濾器，如這裡引入的 `marked.js` 裏的 `marked()`
2. React 中的設置 HTML 的 `APIdangerouslySetInnerHTML，返回含有` `__html` 屬性的 object 即可
3. 使用 `refs` 拿到 DOM？思考一下是不是吧~

> 額外的 Tip：React 還沒有 1.0.0，很多都經常變化，`refs` 在以前不是這麼拿到，哭死我們這些前端小白了~

# 結語

前端之路還很長，React 大法好啊~
