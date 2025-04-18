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

As everyone knows, learning Java inevitably involves understanding and applying various design patterns. Today, Tesla Zhang introduced a brand new design pattern—the "Tagless Final" Style, which can simulate subtyping in Rust using `trait`s.

## Step One: Implementation Goal

Implement a generic `expr` function that can execute based on the type. As shown in the code below, it can return results of type `u32` or `String`.

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

## Basic Expr trait definition

This most basic `trait` is imported from an external source and cannot be modified.

```rust
pub(crate) trait Expr {
    fn lit(i: u32) -> Self;
    fn add(lhs: Self, rhs: Self) -> Self;
    fn sub(lhs: Self, rhs: Self) -> Self;
    fn mul(lhs: Self, rhs: Self) -> Self;
    fn div(lhs: Self, rhs: Self) -> Self;
}
```

## Implementations for String and u32

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

All the above content is extracted into `expr.rs`.

## Adding an `exp` method to expr

Since the `Expr` trait cannot be changed, we add a new trait using TypeParamBounds[^https://doc.rust-lang.org/reference/items/traits.html]: Rust traits

```
Syntax
Trait :
   unsafe? trait IDENTIFIER  Generics? ( : TypeParamBounds? )? WhereClause? {
     TraitItem*
   }
```

Define a new `ExprWithExp` trait and implement the `exp` method for `u32` and `String` types:

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

This allows extending `u32` and `String` with the `exp` method.

```rust
fn main() {
    // snippet
    fn expr<T: Expr>() -> T { // Define the original expr function again for context
        Expr::add(
            Expr::div(Expr::lit(100), Expr::lit(10)),
            Expr::sub(Expr::lit(223), Expr::lit(23)),
        )
    }

    fn expr2<T: ExprWithExp>() -> T {
        ExprWithExp::exp(expr(), Expr::lit(2)) // Call the original expr here
    }

    println!("{}", expr::<u32>()); // Original output
    println!("{}", expr::<String>()); // Original output
    println!("{}", expr2::<u32>()); // New output
    println!("{}", expr2::<String>()); // New output
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
