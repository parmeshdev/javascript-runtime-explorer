import { Play, Pause, RotateCcw, SkipForward, Gauge } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";

type Props = {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  speed: number;
  onSpeedChange: (v: number) => void;
  progress: { current: number; total: number };
};

export function Controls({
  playing,
  onPlay,
  onPause,
  onReset,
  onStep,
  speed,
  onSpeedChange,
  progress,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
      {playing ? (
        <Button onClick={onPause} variant="secondary" size="sm">
          <Pause className="mr-1.5 h-4 w-4" /> Pause
        </Button>
      ) : (
        <Button
          onClick={onPlay}
          size="sm"
          className="bg-[color:var(--runtime-js)] text-background hover:opacity-90"
        >
          <Play className="mr-1.5 h-4 w-4" /> Play
        </Button>
      )}
      <Button onClick={onStep} variant="outline" size="sm">
        <SkipForward className="mr-1.5 h-4 w-4" /> Step
      </Button>
      <Button onClick={onReset} variant="ghost" size="sm">
        <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
      </Button>

      <div className="ml-2 flex min-w-[180px] items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[speed]}
          onValueChange={(v) => onSpeedChange(v[0])}
          min={0.25}
          max={3}
          step={0.25}
          className="flex-1"
        />
        <span className="w-10 text-right font-mono text-xs text-muted-foreground">{speed}×</span>
      </div>

      <div className="ml-auto font-mono text-xs text-muted-foreground">
        Step <span className="text-foreground">{progress.current}</span>
        <span className="mx-1">/</span>
        {progress.total}
      </div>
    </div>
  );
}
