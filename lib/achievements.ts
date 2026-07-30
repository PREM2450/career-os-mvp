import Achievement from "@/models/Achievement";
import User from "@/models/User";
import Goal from "@/models/Goal";
import Task from "@/models/Task";

export async function checkAchievements(userId: string) {
  try {
    console.log("\n========== CHECKING ACHIEVEMENTS ==========");

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    const goalIds = (
      await Goal.find({ userId }).select("_id")
    ).map((g) => g._id);

    const completedTasks = await Task.countDocuments({
      completed: true,
      goalId: { $in: goalIds },
    });

    const completedGoals = await Goal.countDocuments({
      userId,
      completed: true,
    });

    console.log("User XP:", user.xp);
    console.log("User Level:", user.level);
    console.log("User Streak:", user.streak);
    console.log("Resume Uploaded:", user.resumeUploadedAt);
    console.log("Completed Tasks:", completedTasks);
    console.log("Completed Goals:", completedGoals);

    console.log(
      "Achievement Enum:",
      (Achievement.schema.path("category") as any).options.enum
    );

    const achievements = [
      {
        key: "resume-uploaded",
        title: "Resume Uploaded",
        description: "Uploaded your first resume.",
        icon: "📄",
        category: "Resume",
        xpReward: 100,
        condition: !!user.resumeUploadedAt,
      },

      {
        key: "first-task",
        title: "First Step",
        description: "Completed your first task.",
        icon: "🥇",
        category: "Mission",
        xpReward: 100,
        condition: completedTasks >= 1,
      },

      {
        key: "100xp",
        title: "100 XP Club",
        description: "Earned 100 XP.",
        icon: "⚡",
        category: "XP",
        xpReward: 100,
        condition: user.xp >= 100,
      },

      {
        key: "level5",
        title: "Level 5",
        description: "Reached Level 5.",
        icon: "🏆",
        category: "Level",
        xpReward: 200,
        condition: user.level >= 5,
      },

      {
        key: "7day",
        title: "7 Day Streak",
        description: "Maintained a 7-day streak.",
        icon: "🔥",
        category: "Streak",
        xpReward: 300,
        condition: user.streak >= 7,
      },

      {
        key: "50tasks",
        title: "Task Master",
        description: "Completed 50 tasks.",
        icon: "📚",
        category: "Mission",
        xpReward: 500,
        condition: completedTasks >= 50,
      },

      {
        key: "goal1",
        title: "Goal Crusher",
        description: "Completed your first goal.",
        icon: "🎯",
        category: "Goal",
        xpReward: 300,
        condition: completedGoals >= 1,
      },
    ];

    for (const achievement of achievements) {
      if (!achievement.condition) continue;

      console.log("\nTrying to unlock:");
      console.log(achievement);

      const exists = await Achievement.findOne({
        userId,
        key: achievement.key,
      });

      if (exists) {
        console.log("Already exists:", achievement.key);
        continue;
      }

      try {
        const created = await Achievement.create({
          userId,
          key: achievement.key,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          xpReward: achievement.xpReward,
          unlocked: true,
          unlockedAt: new Date(),
        });

        console.log("✅ Created:", created.key);

      } catch (err) {
        console.error("❌ CREATE ERROR");
        console.error(err);
        throw err;
      }
    }

    console.log("========== DONE ==========\n");

  } catch (err) {
    console.error("🔥 Achievement Engine Error");
    console.error(err);
    throw err;
  }
}