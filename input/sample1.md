# Variables

Variables store values for later use.

### c-a-r-d

## Variables — Quick

Variables hold data. Use meaningful names.

- Declare with let/const (JS), var is older.

Example:

```js
let count = 5;
console.log(count); // 5
```

**Quiz:** What keyword should you use for a value that doesn't change? _Answer: const_

### c-a-r-d

## Data Types

Common types: number, string, boolean, null, undefined.

- Strings use quotes: "hello"
- Numbers: 42, 3.14

Example:

```js
const name = "Alex";
const age = 30;
```

### c-a-r-d

## Operators

Operators perform actions: arithmetic, comparison, logical.

- - - - / %
- ===, !==, >, <

Example:

```js
const sum = 2 + 3; // 5
const ok = sum === 5; // true
```

### c-a-r-d

## Control Flow

Control which code runs: if, else, loops.

Example:

```js
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
```

### c-a-r-d

## Functions

Functions bundle reusable logic.

```js
function greet(name) {
  return `Hi, ${name}`;
}
```

**Tip:** Keep functions small and focused.

### c-a-r-d

## Arrays

Arrays store ordered lists.

```js
const nums = [1, 2, 3];
nums.push(4);
```

**Quiz:** How do you get the first item? _Answer: nums[0]_

### c-a-r-d

## Objects

Objects store key-value pairs.

```js
const user = { name: "Sam", age: 25 };
console.log(user.name); // 'Sam'
```

### c-a-r-d

## Async (Promises)

Promises handle async results.

```js
fetch("/api/data")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**Tip:** Use async/await for clearer flow.

### c-a-r-d

## Summary

Practice small examples, one idea per card. Keep cards short so learners read on one screen.

Good luck and keep coding!
