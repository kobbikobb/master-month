import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { MasterMonth, Goal } from "../types";
import { getMasterMonths, getGoals, createGoal, toggleGoal as apiToggleGoal, deleteGoal as apiDeleteGoal } from "../api";

export default function Goals() {
    // Get current month in YYYY-MM format
    const today = new Date();
    const currentMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // State
    const [allMasterMonths, setAllMasterMonths] = useState<MasterMonth[]>([]);
    const [allGoals, setAllGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalTargetMonth, setNewGoalTargetMonth] = useState(currentMonthString);
    const [isAddingGoal, setIsAddingGoal] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [months, goals] = await Promise.all([
                    getMasterMonths(),
                    getGoals(),
                ]);
                setAllMasterMonths(months);
                setAllGoals(goals);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Find current month's MasterMonth (if it exists)
    const currentMonth = allMasterMonths.find((m) => m.month === currentMonthString);

    // Filter goals for current month
    const monthGoals = allGoals.filter((goal) => goal.targetMonth === currentMonthString);

    const handleToggleGoal = async (goalId: string) => {
        const updatedGoal = await apiToggleGoal(goalId);
        setAllGoals((prev) =>
            prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
        );
    };

    const handleAddGoal = async () => {
        if (newGoalTitle.trim() && newGoalTargetMonth) {
            const newGoal = await createGoal(newGoalTitle, newGoalTargetMonth);
            setAllGoals((prev) => [...prev, newGoal]);
            setNewGoalTitle("");
            setNewGoalTargetMonth(currentMonthString);
            setIsAddingGoal(false);
        }
    };

    const handleDeleteGoal = async (goalId: string) => {
        await apiDeleteGoal(goalId);
        setAllGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4">
                <div className="py-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const completedGoals = monthGoals.filter((g) => g.completed).length;
    const totalGoals = monthGoals.length;

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                        {new Date(currentMonthString).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h1>
                    {currentMonth ? (
                        <p className="text-2xl text-gray-600 dark:text-gray-400 mb-6">
                            {currentMonth.theme}
                        </p>
                    ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            <Link to="/months" className="underline hover:text-gray-900 dark:hover:text-gray-100">
                                Create a Master Month
                            </Link>{" "}
                            to set a theme for this month
                        </p>
                    )}

                    {/* Progress Overview */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Overall Progress
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {totalGoals > 0
                                        ? Math.round(
                                              (completedGoals / totalGoals) * 100
                                          )
                                        : 0}
                                    %
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {completedGoals}/{totalGoals}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Goals completed
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                            <div
                                className="bg-gray-900 dark:bg-gray-100 h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Goals List */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Your Goals
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsAddingGoal(true)}
                            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                        >
                            Add Goal
                        </button>
                    </div>

                    {/* Add Goal Form */}
                    {isAddingGoal && (
                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <div className="mb-3">
                                <label
                                    htmlFor="goalTitle"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Goal Title
                                </label>
                                <input
                                    id="goalTitle"
                                    type="text"
                                    value={newGoalTitle}
                                    onChange={(e) => setNewGoalTitle(e.target.value)}
                                    placeholder="Enter goal title..."
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddGoal();
                                        if (e.key === "Escape") {
                                            setIsAddingGoal(false);
                                            setNewGoalTitle("");
                                            setNewGoalTargetMonth(currentMonthString);
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="targetMonth"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Target Month
                                </label>
                                <input
                                    id="targetMonth"
                                    type="month"
                                    value={newGoalTargetMonth}
                                    onChange={(e) => setNewGoalTargetMonth(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddGoal}
                                    className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingGoal(false);
                                        setNewGoalTitle("");
                                        setNewGoalTargetMonth(currentMonthString);
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Goals */}
                    <div className="space-y-3">
                        {monthGoals.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No goals yet. Click "Add Goal" to create your
                                    first goal!
                                </p>
                            </div>
                        ) : (
                            monthGoals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleGoal(goal.id)}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={goal.completed}
                                                onChange={() => {}}
                                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 cursor-pointer"
                                            />
                                        </button>
                                        <span
                                            className={`text-gray-900 dark:text-gray-100 flex-1 ${
                                                goal.completed
                                                    ? "line-through opacity-50"
                                                    : ""
                                            }`}
                                        >
                                            {goal.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {goal.completed && (
                                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                Completed
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
