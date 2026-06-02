# JavaScript Runtime & Browser Explorer

> Visualize what happens behind the scenes when JavaScript, Browser APIs, the Event Loop, Rendering Engine, and React execute your code.

---

## Overview

Current Status:

The application currently focuses on visualizing carefully curated JavaScript and browser runtime examples.

Custom code editing and execution are planned for future releases once the simulation engine and visualization accuracy are fully stabilized.

JavaScript developers often learn concepts such as:

* Call Stack
* Event Loop
* Microtasks
* Macrotasks
* Browser APIs
* DOM Updates
* Rendering Pipeline
* React Reconciliation
* React Fiber

through diagrams, blog posts, and videos.

While these explanations are helpful, they are usually static.

**JavaScript Runtime & Browser Explorer** aims to make these concepts interactive by allowing developers to see execution happen step-by-step through motion graphics and animated visualizations.

The goal is simple:

> Don't just read about execution. Watch it happen.

---

## Vision

Most educational tools explain concepts using static diagrams.

This application transforms those concepts into animated experiences.

Users can:

* Explore curated JavaScript examples
* Play execution step-by-step
* Visualize runtime behavior
* Understand browser internals
* Learn React internals visually

The initial version focuses on guided exploration through predefined examples. Custom code editing will be introduced in a future release.

---

## Core Philosophy

The application focuses on:

### Visual Learning

Instead of:

```text
Call Stack
Microtask Queue
Macrotask Queue
```

users see execution moving through the system.

### Motion Graphics

Execution becomes:

```text
Code
↓
Runtime
↓
Queues
↓
Browser APIs
↓
Output
```

through animations.

### Interactive Exploration

Users should be able to:

* Pause
* Resume
* Replay
* Step Forward
* Step Backward
* Slow Down Execution
* Speed Up Execution

---

# Features

## Code Viewer

Users can:

* Select built-in examples
* Inspect source code
* Replay execution
* Observe execution step-by-step

Features:

* Syntax highlighting
* Read-only code view
* Line highlighting
* Execution tracking

The current version intentionally uses predefined examples to provide a consistent learning experience and accurate runtime visualizations. Support for custom JavaScript input is planned for future releases.

---

## JavaScript Runtime Visualizer

Visualizes:

### Call Stack

Shows:

* Function execution
* Execution contexts
* Stack push
* Stack pop

Example:

```js
function a() {
  b();
}

function b() {
  console.log("Hello");
}

a();
```

---

### Event Loop

Visualizes:

* Call Stack
* Event Loop
* Microtasks
* Macrotasks

Example:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

Output:

```text
A
D
C
B
```

---

### Microtask Queue

Visualizes:

* Promise.then
* Promise.catch
* Promise.finally
* queueMicrotask
* async/await continuations

---

### Macrotask Queue

Visualizes:

* setTimeout
* setInterval
* MessageChannel

---

## Browser API Visualizer

Shows how JavaScript interacts with Browser APIs.

Supported APIs:

* fetch
* XMLHttpRequest
* localStorage
* sessionStorage
* navigator
* history
* location
* requestAnimationFrame
* requestIdleCallback

Example:

```js
fetch("/users")
  .then(res => res.json())
  .then(console.log);
```

Visualization:

```text
Call Stack
↓
Browser API
↓
Network
↓
Promise
↓
Microtask Queue
↓
Console
```

---

## DOM Visualizer

Visualizes:

* querySelector
* createElement
* appendChild
* removeChild
* replaceChild

Shows:

```text
DOM Tree
↓
Mutation
↓
Layout
↓
Paint
↓
Composite
```

---

## Rendering Pipeline Visualizer

Explains how browsers render content.

Visualization:

```text
HTML
↓
DOM
↓
CSSOM
↓
Render Tree
↓
Layout
↓
Paint
↓
Composite
```

Topics:

* Reflow
* Repaint
* Layout Thrashing
* Layer Composition

---

## Performance Visualizer

Demonstrates:

### DOM Batching

Example:

```js
element.style.width = "100px";
element.style.width = "200px";
element.style.width = "300px";
```

Visualize:

```text
DOM Changes
↓
Queue Changes
↓
Layout Once
↓
Paint Once
```

---

### Forced Reflow

Example:

```js
element.style.width = "300px";

console.log(element.offsetWidth);
```

Visualize:

```text
Apply Pending Changes
↓
Recalculate Layout
↓
Return Value
```

---

# React Explorer (Future)

## State Updates

Visualize:

```js
setCount(count + 1);
```

Flow:

```text
State Update
↓
Schedule Work
↓
Render Phase
↓
Reconciliation
↓
Commit Phase
↓
DOM Update
```

---

## React Fiber Visualizer

Visualize:

```text
Current Tree
↓
Work-In-Progress Tree
↓
Pause
↓
Resume
↓
Interrupt
↓
Commit
```

Topics:

* Fiber Architecture
* Scheduling
* Priorities
* Concurrent Rendering
* Lanes

---

# Design Principles

The UI should not feel like:

* Admin Dashboard
* Analytics Tool
* IDE

The UI should feel like:

* Motion Graphics
* Interactive Infographic
* Educational Animation
* Technical Storytelling Platform

---

# Technology Stack

Frontend:

* React
* TypeScript
* Tailwind CSS
* Framer Motion

Future:

* Monaco Editor (for custom code execution)
* React Flow
* AST Parser
* AI-powered explanations

---

# Long-Term Goal

Create the most visual and intuitive platform for understanding:

* JavaScript
* Browser Internals
* Rendering Engines
* React
* React Fiber
* Performance Optimization

One animation at a time.

---

## Motto

> Learn by seeing execution, not just reading about it.
