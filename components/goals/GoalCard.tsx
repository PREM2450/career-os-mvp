"use client";

import AddTask from "./AddTask";
import ProgressBar from "./ProgressBar";
import TaskList from "./TaskList";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  xp: number;
}

interface Goal {
  _id: string;
  title: string;
  deadline: string;
}

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onToggleTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onTaskAdded: (goalId: string) => void;
}

export default function GoalCard({
  goal,
  tasks,
  onToggleTask,
  onDeleteTask,
  onDeleteGoal,
  onTaskAdded,
}: GoalCardProps) {
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-xl">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            🎯 {goal.title}
          </h2>

          <p className="text-gray-400 mt-1">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => onDeleteGoal(goal._id)}
          className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-500 transition"
        >
          Delete Goal
        </button>

      </div>

      <div className="mt-6">
        <ProgressBar
          completed={completedTasks}
          total={tasks.length}
        />
      </div>

      <TaskList
        tasks={tasks}
        onToggle={onToggleTask}
        onDelete={onDeleteTask}
      />

      <AddTask
        goalId={goal._id}
        onTaskAdded={() => onTaskAdded(goal._id)}
      />

    </div>
  );
}