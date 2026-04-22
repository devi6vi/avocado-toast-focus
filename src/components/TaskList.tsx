import { forwardRef, useImperativeHandle, useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type TaskListHandle = {
  /** Mark the first not-done task as completed. Returns the task text, or null if none. */
  checkTopTask: () => string | null;
};

export const TaskList = forwardRef<TaskListHandle>((_props, ref) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Sketch out app ideas", done: false },
    { id: "2", text: "Read 10 pages 📖", done: true },
  ]);
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (!t) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text: t, done: false }]);
    setInput("");
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  useImperativeHandle(ref, () => ({
    checkTopTask: () => {
      let checked: string | null = null;
      setTasks((prev) => {
        const idx = prev.findIndex((t) => !t.done);
        if (idx === -1) return prev;
        checked = prev[idx].text;
        return prev.map((t, i) => (i === idx ? { ...t, done: true } : t));
      });
      return checked;
    },
  }));

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="chunky-card p-6 bg-cream">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-forest">Today's Crunch 🥑</h2>
        <span className="font-bold text-sm text-forest/70">
          {completed}/{tasks.length} done
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="What's on your toast today?"
          className="border-[3px] border-forest rounded-2xl h-12 bg-background placeholder:text-forest/50 font-medium focus-visible:ring-carrot"
        />
        <Button
          onClick={add}
          className="chunky-btn h-12 w-12 p-0 bg-carrot text-cream hover:bg-carrot/90"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {tasks.length === 0 && (
          <li className="text-center text-forest/50 py-6 italic">No tasks yet — add one above!</li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border-[2.5px] border-forest bg-background p-3 transition-all",
              task.done && "bg-kiwi/20"
            )}
          >
            <button
              onClick={() => toggle(task.id)}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2.5px] border-forest transition-all",
                task.done ? "bg-kiwi" : "bg-background hover:bg-sunshine/40"
              )}
            >
              {task.done && <Check className="h-4 w-4 text-forest" strokeWidth={3} />}
            </button>
            <span
              className={cn(
                "flex-1 font-medium text-forest break-words",
                task.done && "line-through opacity-60"
              )}
            >
              {task.text}
            </span>
            <button
              onClick={() => remove(task.id)}
              className="opacity-0 group-hover:opacity-100 text-tomato hover:scale-110 transition-all"
              aria-label="Remove task"
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
TaskList.displayName = "TaskList";