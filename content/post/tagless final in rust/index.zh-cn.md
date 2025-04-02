---
title: Tagless Final in Rust
slug: tagless-final-in-rust
date: 2020-07-18
author: Edward Elric
image: rust_programming_crab_sea.png
tags:
  - rust
  - tagless final
secret: false
categories:
  - Programming Languages
---

总所周知学习 Java 逃不开对各类设计模式的理解运用。今天千里冰封介绍了一个全新的设计模式——"Tagless Final" Style, 它可以用 `trait` 在 Rust 中模拟子类型。

## 第一步实现目标

实现一个 expr 范型方法，可以根据类型执行。如下方代码，可以已 `u32` 或者 `String` 的类型返回

```rust
fn main() {
    fn expr<T: Expr>() -> T {
        Expr::add(
            Expr::div(Expr::lit(100), Expr::lit(10)),
            Expr::sub(Expr::lit(223), Expr::lit(23)),
        )
    }
    println!("{}", expr::<u32>());
    println!("{}", expr::<String>());
}
```

output:

```shell script
/Users/edward/.cargo/bin/cargo run --color=always --package tagless --bin tagless
   Compiling tagless v0.1.0 (/Users/edward/github/SASUKE40/tagless)
    Finished dev [unoptimized + debuginfo] target(s) in 0.39s
     Running `target/debug/tagless`
210
((100 / 10) + (223 - 23))
```

## 基础的 Expr trait 定义

这个最基础的 `trait` 是外部引入，不能更改的。

```rust
pub(crate) trait Expr {
    fn lit(i: u32) -> Self;
    fn add(lhs: Self, rhs: Self) -> Self;
    fn sub(lhs: Self, rhs: Self) -> Self;
    fn mul(lhs: Self, rhs: Self) -> Self;
    fn div(lhs: Self, rhs: Self) -> Self;
}
```

## 实现 String 和 u32 的 impl

```rust

impl Expr for u32 {
    fn lit(i: u32) -> Self {
        i
    }
    fn add(lhs: Self, rhs: Self) -> Self {
        lhs + rhs
    }
    fn sub(lhs: Self, rhs: Self) -> Self {
        lhs - rhs
    }
    fn mul(lhs: Self, rhs: Self) -> Self {
        lhs * rhs
    }
    fn div(lhs: Self, rhs: Self) -> Self {
        lhs / rhs
    }
}

impl Expr for String {
    fn lit(i: u32) -> Self {
        i.to_string()
    }
    fn add(lhs: Self, rhs: Self) -> Self {
        format!("({} + {})", lhs, rhs)
    }
    fn sub(lhs: Self, rhs: Self) -> Self {
        format!("({} - {})", lhs, rhs)
    }
    fn mul(lhs: Self, rhs: Self) -> Self {
        format!("({} * {})", lhs, rhs)
    }
    fn div(lhs: Self, rhs: Self) -> Self {
        format!("({} / {})", lhs, rhs)
    }
}
```

以上的内容都单独抽出放入到 `expr.rs` 中。

## 给 expr 增加 exp 方法

因为 Expr trait 不可被更改，所以新增一个 `trait` 的 TypeParamBounds[^https://doc.rust-lang.org/reference/items/traits.html]: Rust traits

```
Syntax
Trait :
   unsafe? trait IDENTIFIER  Generics? ( : TypeParamBounds? )? WhereClause? {
     TraitItem*
   }
```

定义一个新的 `ExprWithExp` trait，并实现 `u32` 和 `String` 类型的 `exp` 方法：

```rust
trait ExprWithExp: Expr {
    fn exp(lhs: Self, rhs: Self) -> Self;
}

impl ExprWithExp for u32 {
    fn exp(lhs: Self, rhs: Self) -> Self {
        lhs.pow(rhs)
    }
}

impl ExprWithExp for String {
    fn exp(lhs: Self, rhs: Self) -> Self {
        format!("({} ^ {})", lhs, rhs)
    }
}
```

这样就可以给 `u32` 和 `String` 拓展出 `exp` 方法

```rust
fn main() {
    // snippet
    fn expr2<T: ExprWithExp>() -> T {
        ExprWithExp::exp(expr(), Expr::lit(2))
    }

    println!("{}", expr2::<u32>());
    println!("{}", expr2::<String>());
}
```

output:

```
/Users/edward/.cargo/bin/cargo run --color=always --package tagless --bin tagless
   Compiling tagless v0.1.0 (/Users/edward/github/SASUKE40/tagless)
    Finished dev [unoptimized + debuginfo] target(s) in 0.56s
     Running `target/debug/tagless`
210
((100 / 10) + (223 - 23))
44100
(((100 / 10) + (223 - 23)) ^ 2)
```
