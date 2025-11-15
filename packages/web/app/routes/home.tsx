import { Link } from "react-router";
import { useEffect, useState } from "react";
import type { MasterMonth, Goal, JournalEntry } from "../types";
import { getMasterMonths, getGoals, getJournalEntries } from "../api";

export default function Home() {
    // Get current month in YYYY-MM format
    const today = new Date();
    const currentMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // State
    const [allMasterMonths, setAllMasterMonths] = useState<MasterMonth[]>([]);
    const [allGoals, setAllGoals] = useState<Goal[]>([]);
    const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [months, goals, entries] = await Promise.all([
                    getMasterMonths(),
                    getGoals(),
                    getJournalEntries(),
                ]);
                setAllMasterMonths(months);
                setAllGoals(goals);
                setAllJournalEntries(entries);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Find current month's MasterMonth (if it exists)
    const currentMonth = allMasterMonths.find((m) => m.month === currentMonthString);

    // Filter goals and journal entries for current month
    const monthGoals = allGoals.filter((goal) => goal.targetMonth === currentMonthString);
    const monthJournalEntries = allJournalEntries.filter((entry) => entry.date.startsWith(currentMonthString));

    const completedGoals = monthGoals.filter((g) => g.completed).length;
    const totalGoals = monthGoals.length;
    const journalStreak = 7; // Mock data

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4">
                <div className="py-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

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
                        <p className="text-2xl text-gray-600 dark:text-gray-400">
                            {currentMonth.theme}
                        </p>
                    ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            <Link to="/months" className="underline hover:text-gray-900 dark:hover:text-gray-100">
                                Create a Master Month
                            </Link>{" "}
                            to set a theme for this month
                        </p>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-12">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Goals Progress
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {completedGoals}/{totalGoals}
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div
                                className="bg-gray-900 dark:bg-gray-100 h-2 rounded-full"
                                style={{
                                    width: `${(completedGoals / totalGoals) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Journal Entries
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {monthJournalEntries.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            This month
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Current Streak
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {journalStreak} days
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Keep it going!
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link
                            to="/journal/new"
                            className="p-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            <div className="text-xl font-semibold mb-2">
                                Write Today's Entry
                            </div>
                            <div className="text-sm opacity-90">
                                Reflect on your day and plan for tomorrow
                            </div>
                        </Link>

                        <Link
                            to="/goals"
                            className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                        >
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Manage Goals
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Update progress or add new goals
                            </div>
                        </Link>

                        <Link
                            to="/months"
                            className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                        >
                            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                View All Months
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Browse your master month history
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Goals */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Your Goals
                    </h2>
                    <div className="space-y-3">
                        {monthGoals.map((goal) => (
                            <div
                                key={goal.id}
                                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <input
                                        type="checkbox"
                                        checked={goal.completed}
                                        readOnly
                                        className="w-5 h-5 rounded border-gray-300 dark:border-gray-700"
                                    />
                                    <span
                                        className={`text-gray-900 dark:text-gray-100 ${
                                            goal.completed
                                                ? "line-through opacity-50"
                                                : ""
                                        }`}
                                    >
                                        {goal.title}
                                    </span>
                                </div>
                                {goal.completed && (
                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                        Completed
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
