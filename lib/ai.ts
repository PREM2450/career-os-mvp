import User from "@/models/User";
import Goal from "@/models/Goal";
import Task from "@/models/Task";

export async function buildAIContext(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    return "";
  }

  const goals = await Goal.find({ userId });

  const goalIds = goals.map((goal) => goal._id);

  const tasks = await Task.find({
    goalId: { $in: goalIds },
  });

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);

  const goalText =
    goals.length === 0
      ? "No goals added."
      : goals
          .map(
            (goal, index) => `
${index + 1}. ${goal.title}
Company: ${goal.company || "Not specified"}
Level: ${goal.level}
Daily Hours: ${goal.dailyHours}
Deadline: ${new Date(goal.deadline).toDateString()}
`
          )
          .join("\n");

  const pendingTaskText =
    pendingTasks.length === 0
      ? "No pending tasks."
      : pendingTasks.map((task) => `- ${task.title}`).join("\n");

  return `
Current User

Name: ${user.name}

Goal: ${user.goal || "Not specified"}

XP: ${user.xp}

Level: ${user.level}

Current Streak: ${user.streak}

Goals

${goalText}

Overall Progress

Total Tasks: ${tasks.length}

Completed Tasks: ${completedTasks.length}

Pending Tasks: ${pendingTasks.length}

Completion: ${completionRate}%

Pending Tasks

${pendingTaskText}
`;
}