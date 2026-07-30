"use client";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  xp: number;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-slate-600 p-5 text-center text-gray-400">
        No tasks yet. Add your first task 🚀
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center justify-between rounded-xl bg-slate-800/60 border border-slate-700 p-4"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                onToggle(task._id, !task.completed)
              }
              className="w-5 h-5 cursor-pointer"
            />

            <div>
              <p
                className={`font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-white"
                }`}
              >
                {task.title}
              </p>

              <p className="text-xs text-cyan-400">
                +{task.xp} XP
              </p>
            </div>
          </div>

          <button
            onClick={() => onDelete(task._id)}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}