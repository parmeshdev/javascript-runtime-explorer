import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Globe, Zap, Clock, Wifi, Terminal, Sparkles } from "lucide-react";

import { EXAMPLES } from "./lib/examples";
import { useRuntimeSim } from "./lib/useRuntimeSim";
import { CodeEditor } from "./components/runtime/CodeEditor";
import { RuntimeArea } from "./components/runtime/RuntimeArea";
import { EventLoopHub } from "./components/runtime/EventLoopHub";
import { Controls } from "./components/runtime/Controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

export default function App() {
  const [exampleId, setExampleId] = useState(EXAMPLES[0].id);
  const example = EXAMPLES.find((e) => e.id === exampleId)!;
  const [code, setCode] = useState(example.code);

  const sim = useRuntimeSim(example);

  // When user picks new example, swap code shown
  const handleExample = (id: string) => {
    setExampleId(id);
    const next = EXAMPLES.find((e) => e.id === id);
    if (next) setCode(next.code);
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="grid h-9 w-9 place-items-center rounded-md font-display text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--runtime-js), var(--runtime-micro))",
                  color: "var(--background)",
                }}
              >
                JS
              </div>
              <Sparkles className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-[color:var(--runtime-micro)]" />
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-base font-semibold tracking-tight">
                JavaScript Runtime & Browser Explorer
              </h1>
              <p className="text-[11px] text-muted-foreground">
                See the event loop, web APIs and microtasks — animated.
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Topic
            </span>
            <Select value={exampleId} onValueChange={handleExample}>
              <SelectTrigger className="w-[300px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXAMPLES.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Controls + step description */}
      <div className="mx-auto max-w-[1600px] px-6 pt-4">
        <Controls
          playing={sim.playing}
          onPlay={sim.play}
          onPause={sim.pause}
          onReset={sim.reset}
          onStep={sim.step}
          speed={sim.speed}
          onSpeedChange={sim.setSpeed}
          progress={sim.progress}
        />

        <motion.div
          key={sim.progress.current}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-3 text-sm"
        >
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: "color-mix(in oklab, var(--runtime-js) 22%, transparent)",
              color: "var(--runtime-js)",
            }}
          >
            Now
          </span>
          <span className="text-muted-foreground">{sim.currentStep?.label ?? example.blurb}</span>
        </motion.div>
      </div>

      {/* Main */}
      <main className="mx-auto grid max-w-[1600px] gap-4 px-6 py-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        {/* Editor column */}
        <section className="flex h-[calc(100vh-220px)] min-h-[540px] flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Code Editor
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground">
              editable · paste your own JS
            </span>
          </div>
          <CodeEditor code={code} onChange={setCode} activeLine={sim.activeLine} />
        </section>

        {/* Visualization column */}
        <section className="grid grid-cols-12 gap-3">
          {/* Row 1: Call stack | Event loop | Web APIs */}
          <div className="col-span-12 md:col-span-4 min-h-[230px]">
            <RuntimeArea
              title="Call Stack"
              subtitle="LIFO · synchronous execution"
              accent="js"
              variant="stack"
              icon={<Cpu className="h-4 w-4 text-[color:var(--runtime-js)]" />}
              tokens={sim.state.stack}
              className="h-full"
            />
          </div>
          <div className="col-span-12 md:col-span-4 min-h-[230px]">
            <EventLoopHub spinning={sim.playing} />
          </div>
          <div className="col-span-12 md:col-span-4 min-h-[230px]">
            <RuntimeArea
              title="Browser / Web APIs"
              subtitle="Timers · DOM · fetch · observers"
              accent="api"
              icon={<Globe className="h-4 w-4 text-[color:var(--runtime-api)]" />}
              tokens={sim.state.webapi}
              className="h-full"
            />
          </div>

          {/* Row 2: Microtask | Macrotask */}
          <div className="col-span-12 md:col-span-6 min-h-[150px]">
            <RuntimeArea
              title="Microtask Queue"
              subtitle="Promises · queueMicrotask · await continuations"
              accent="micro"
              icon={<Zap className="h-4 w-4 text-[color:var(--runtime-micro)]" />}
              tokens={sim.state.micro}
              className="h-full"
            />
          </div>
          <div className="col-span-12 md:col-span-6 min-h-[150px]">
            <RuntimeArea
              title="Macrotask Queue"
              subtitle="setTimeout · setInterval · I/O · rAF"
              accent="macro"
              icon={<Clock className="h-4 w-4 text-[color:var(--runtime-macro)]" />}
              tokens={sim.state.macro}
              className="h-full"
            />
          </div>

          {/* Row 3: Network | Console */}
          <div className="col-span-12 md:col-span-5 min-h-[180px]">
            <RuntimeArea
              title="Network Layer"
              subtitle="HTTP requests in flight"
              accent="network"
              icon={<Wifi className="h-4 w-4 text-[color:var(--runtime-network)]" />}
              tokens={sim.state.network}
              className="h-full"
            />
          </div>
          <div className="col-span-12 md:col-span-7 min-h-[180px]">
            <RuntimeArea
              title="Console Output"
              subtitle="What the developer sees"
              accent="console"
              variant="log"
              icon={<Terminal className="h-4 w-4 text-[color:var(--runtime-console)]" />}
              tokens={sim.state.console}
              className="h-full"
            />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-[1600px] px-6 pb-8 pt-2 text-center text-[11px] text-muted-foreground">
        Tip — press <span className="font-mono text-foreground">Step</span> to walk one frame at a
        time, or hit Play and watch the system flow.
      </footer>
    </div>
  );
}
