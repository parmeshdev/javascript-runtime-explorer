/**
 * Predefined examples with pre-computed execution traces.
 * Each step describes one frame of the visualization.
 */

export type AreaKey = "stack" | "webapi" | "micro" | "macro" | "network" | "console";

export type Step = {
  /** 1-indexed line in the example source */
  line: number;
  /** Human-readable description shown beneath controls */
  label: string;
  /** Action: where a token enters/leaves */
  action:
    | { type: "push"; area: AreaKey; id: string; text: string; color?: string }
    | { type: "pop"; area: AreaKey; id: string }
    | { type: "move"; from: AreaKey; to: AreaKey; id: string; text: string; color?: string }
    | { type: "log"; text: string }
    | { type: "tick" };
};

export type Example = {
  id: string;
  title: string;
  blurb: string;
  code: string;
  steps: Step[];
};

const COLORS = {
  js: "var(--runtime-js)",
  api: "var(--runtime-api)",
  micro: "var(--runtime-micro)",
  macro: "var(--runtime-macro)",
  net: "var(--runtime-network)",
  log: "var(--runtime-console)",
};

export const EXAMPLES: Example[] = [
  {
    id: "event-loop",
    title: "Event Loop · setTimeout vs Promise",
    blurb: "See why microtasks always win the race against macrotasks.",
    code: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");`,
    steps: [
      {
        line: 1,
        label: "Push console.log('A') onto Call Stack",
        action: {
          type: "push",
          area: "stack",
          id: "logA",
          text: "console.log('A')",
          color: COLORS.js,
        },
      },
      { line: 1, label: "Output A → Console", action: { type: "log", text: "A" } },
      { line: 1, label: "Pop frame", action: { type: "pop", area: "stack", id: "logA" } },
      {
        line: 3,
        label: "setTimeout handed off to Browser APIs",
        action: { type: "push", area: "webapi", id: "to1", text: "Timer 0ms", color: COLORS.api },
      },
      {
        line: 7,
        label: "Promise.then registers a microtask",
        action: {
          type: "push",
          area: "micro",
          id: "mt1",
          text: "() => log('C')",
          color: COLORS.micro,
        },
      },
      {
        line: 11,
        label: "Push console.log('D')",
        action: {
          type: "push",
          area: "stack",
          id: "logD",
          text: "console.log('D')",
          color: COLORS.js,
        },
      },
      { line: 11, label: "Output D → Console", action: { type: "log", text: "D" } },
      { line: 11, label: "Pop frame", action: { type: "pop", area: "stack", id: "logD" } },
      {
        line: 3,
        label: "Timer elapsed → callback to Macrotask Queue",
        action: {
          type: "move",
          from: "webapi",
          to: "macro",
          id: "to1",
          text: "() => log('B')",
          color: COLORS.macro,
        },
      },
      { line: 7, label: "Event loop drains microtasks first", action: { type: "tick" } },
      {
        line: 8,
        label: "Microtask → Call Stack",
        action: {
          type: "move",
          from: "micro",
          to: "stack",
          id: "mt1",
          text: "() => log('C')",
          color: COLORS.micro,
        },
      },
      { line: 8, label: "Output C → Console", action: { type: "log", text: "C" } },
      { line: 8, label: "Pop microtask frame", action: { type: "pop", area: "stack", id: "mt1" } },
      {
        line: 4,
        label: "Now macrotask runs → Call Stack",
        action: {
          type: "move",
          from: "macro",
          to: "stack",
          id: "to1",
          text: "() => log('B')",
          color: COLORS.macro,
        },
      },
      { line: 4, label: "Output B → Console", action: { type: "log", text: "B" } },
      { line: 4, label: "Pop macrotask frame", action: { type: "pop", area: "stack", id: "to1" } },
    ],
  },
  {
    id: "fetch",
    title: "fetch() · Network round-trip",
    blurb: "Follow a request from Call Stack to Network Layer and back as a microtask.",
    code: `console.log("start");

fetch("/api/users")
  .then(res => res.json())
  .then(data => {
    console.log("got", data);
  });

console.log("end");`,
    steps: [
      {
        line: 1,
        label: "console.log('start')",
        action: { type: "push", area: "stack", id: "s1", text: "log('start')", color: COLORS.js },
      },
      { line: 1, label: "Output → Console", action: { type: "log", text: "start" } },
      { line: 1, label: "Pop", action: { type: "pop", area: "stack", id: "s1" } },
      {
        line: 3,
        label: "fetch() invoked",
        action: {
          type: "push",
          area: "stack",
          id: "f1",
          text: "fetch('/api/users')",
          color: COLORS.js,
        },
      },
      {
        line: 3,
        label: "Handed off to Browser APIs",
        action: {
          type: "move",
          from: "stack",
          to: "webapi",
          id: "f1",
          text: "fetch handle",
          color: COLORS.api,
        },
      },
      {
        line: 3,
        label: "Browser opens HTTP connection",
        action: {
          type: "move",
          from: "webapi",
          to: "network",
          id: "f1",
          text: "GET /api/users",
          color: COLORS.net,
        },
      },
      {
        line: 9,
        label: "Synchronous code keeps running",
        action: { type: "push", area: "stack", id: "e1", text: "log('end')", color: COLORS.js },
      },
      { line: 9, label: "Output → Console", action: { type: "log", text: "end" } },
      { line: 9, label: "Pop", action: { type: "pop", area: "stack", id: "e1" } },
      {
        line: 3,
        label: "Server responds 200 OK",
        action: {
          type: "move",
          from: "network",
          to: "webapi",
          id: "f1",
          text: "Response",
          color: COLORS.api,
        },
      },
      {
        line: 4,
        label: "Promise resolves → microtask",
        action: {
          type: "move",
          from: "webapi",
          to: "micro",
          id: "f1",
          text: ".then(res => res.json())",
          color: COLORS.micro,
        },
      },
      {
        line: 4,
        label: "Microtask → Call Stack",
        action: {
          type: "move",
          from: "micro",
          to: "stack",
          id: "f1",
          text: "res.json()",
          color: COLORS.micro,
        },
      },
      {
        line: 4,
        label: "json() returns a Promise",
        action: {
          type: "move",
          from: "stack",
          to: "micro",
          id: "f2",
          text: ".then(data => ...)",
          color: COLORS.micro,
        },
      },
      { line: 4, label: "Pop", action: { type: "pop", area: "stack", id: "f1" } },
      {
        line: 5,
        label: "Next .then microtask runs",
        action: {
          type: "move",
          from: "micro",
          to: "stack",
          id: "f2",
          text: "data => log(...)",
          color: COLORS.micro,
        },
      },
      { line: 6, label: "Output → Console", action: { type: "log", text: "got { users: [...] }" } },
      { line: 6, label: "Pop", action: { type: "pop", area: "stack", id: "f2" } },
    ],
  },
  {
    id: "async-await",
    title: "async / await",
    blurb: "Await suspends the function and resumes it as a microtask.",
    code: `async function load() {
  console.log("1");
  const x = await Promise.resolve(42);
  console.log("2", x);
}

load();
console.log("3");`,
    steps: [
      {
        line: 7,
        label: "Call load()",
        action: { type: "push", area: "stack", id: "load", text: "load()", color: COLORS.js },
      },
      { line: 2, label: "log('1')", action: { type: "log", text: "1" } },
      {
        line: 3,
        label: "await suspends load — schedules continuation",
        action: {
          type: "move",
          from: "stack",
          to: "micro",
          id: "cont",
          text: "resume load (x=42)",
          color: COLORS.micro,
        },
      },
      {
        line: 7,
        label: "load() returns a Promise — pop frame",
        action: { type: "pop", area: "stack", id: "load" },
      },
      {
        line: 8,
        label: "log('3')",
        action: { type: "push", area: "stack", id: "l3", text: "log('3')", color: COLORS.js },
      },
      { line: 8, label: "Output → Console", action: { type: "log", text: "3" } },
      { line: 8, label: "Pop", action: { type: "pop", area: "stack", id: "l3" } },
      {
        line: 4,
        label: "Microtask resumes load",
        action: {
          type: "move",
          from: "micro",
          to: "stack",
          id: "cont",
          text: "load (resume)",
          color: COLORS.micro,
        },
      },
      { line: 4, label: "Output → Console", action: { type: "log", text: "2 42" } },
      { line: 4, label: "Pop", action: { type: "pop", area: "stack", id: "cont" } },
    ],
  },
  {
    id: "closure",
    title: "Closures · counter factory",
    blurb: "Inner functions keep the outer scope alive on the heap.",
    code: `function makeCounter() {
  let n = 0;
  return () => ++n;
}

const c = makeCounter();
console.log(c());
console.log(c());`,
    steps: [
      {
        line: 6,
        label: "Call makeCounter()",
        action: { type: "push", area: "stack", id: "mc", text: "makeCounter()", color: COLORS.js },
      },
      {
        line: 2,
        label: "Allocate { n: 0 } in closure",
        action: {
          type: "push",
          area: "webapi",
          id: "env",
          text: "[[Scope]] { n: 0 }",
          color: COLORS.api,
        },
      },
      {
        line: 3,
        label: "Return inner fn (captures scope)",
        action: { type: "pop", area: "stack", id: "mc" },
      },
      {
        line: 7,
        label: "c()",
        action: { type: "push", area: "stack", id: "c1", text: "c()  // n: 0→1", color: COLORS.js },
      },
      { line: 7, label: "Output → Console", action: { type: "log", text: "1" } },
      { line: 7, label: "Pop", action: { type: "pop", area: "stack", id: "c1" } },
      {
        line: 8,
        label: "c() again — same closure",
        action: { type: "push", area: "stack", id: "c2", text: "c()  // n: 1→2", color: COLORS.js },
      },
      { line: 8, label: "Output → Console", action: { type: "log", text: "2" } },
      { line: 8, label: "Pop", action: { type: "pop", area: "stack", id: "c2" } },
    ],
  },
  {
    id: "raf",
    title: "requestAnimationFrame",
    blurb: "rAF callbacks fire just before the browser paints the next frame.",
    code: `console.log("schedule");

requestAnimationFrame(() => {
  console.log("paint frame");
});

console.log("done");`,
    steps: [
      { line: 1, label: "log('schedule')", action: { type: "log", text: "schedule" } },
      {
        line: 3,
        label: "rAF handed to Browser APIs",
        action: {
          type: "push",
          area: "webapi",
          id: "raf",
          text: "rAF callback",
          color: COLORS.api,
        },
      },
      { line: 7, label: "log('done')", action: { type: "log", text: "done" } },
      {
        line: 3,
        label: "Browser ready to paint — queue rAF",
        action: {
          type: "move",
          from: "webapi",
          to: "macro",
          id: "raf",
          text: "rAF (pre-paint)",
          color: COLORS.macro,
        },
      },
      {
        line: 4,
        label: "Event loop picks it up",
        action: {
          type: "move",
          from: "macro",
          to: "stack",
          id: "raf",
          text: "() => log('paint frame')",
          color: COLORS.macro,
        },
      },
      { line: 4, label: "Output → Console", action: { type: "log", text: "paint frame" } },
      { line: 4, label: "Pop", action: { type: "pop", area: "stack", id: "raf" } },
    ],
  },
];
