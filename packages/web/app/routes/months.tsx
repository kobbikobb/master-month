import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { MasterMonth, Goal, JournalEntry } from "../types";
import { getMasterMonths, getGoals, getJournalEntries, createMasterMonth } from "../api";

export default function Months() {
    // State
    const [months, setMonths] = useState<MasterMonth[]>([]);
    const [allGoals, setAllGoals] = useState<Goal[]>([]);
    const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newMonth, setNewMonth] = useState({
        month: "",
        theme: "",
    });

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [fetchedMonths, goals, entries] = await Promise.all([
                    getMasterMonths(),
                    getGoals(),
                    getJournalEntries(),
                ]);
                setMonths(fetchedMonths);
                setAllGoals(goals);
                setAllJournalEntries(entries);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const sortedMonths = [...months].sort(
        (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
    );

    const handleCreateMonth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMonth.month && newMonth.theme) {
            const createdMonth = await createMasterMonth(newMonth.month, newMonth.theme);
            setMonths([...months, createdMonth]);
            setNewMonth({ month: "", theme: "" });
            setIsCreating(false);
        }
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

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                            Master Months
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            View and manage your monthly themes and progress
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                    >
                        Create New Month
                    </button>
                </div>

                {/* Create New Month Form */}
                {isCreating && (
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Create New Master Month
                        </h3>
                        <form onSubmit={handleCreateMonth} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="month"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Month
                                </label>
                                <input
                                    id="month"
                                    type="month"
                                    value={newMonth.month}
                                    onChange={(e) =>
                                        setNewMonth({
                                            ...newMonth,
                                            month: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="theme"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Theme
                                </label>
                                <input
                                    id="theme"
                                    type="text"
                                    value={newMonth.theme}
                                    onChange={(e) =>
                                        setNewMonth({
                                            ...newMonth,
                                            theme: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Health & Wellness, Career Growth, Financial Freedom..."
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewMonth({ month: "", theme: "" });
                                    }}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Months List */}
                <div className="grid gap-6 md:grid-cols-2">
                    {sortedMonths.map((month) => {
                        // Filter goals and journal entries for this specific month (by month string)
                        const monthGoals = allGoals.filter((g) => g.targetMonth === month.month);
                        const monthJournalEntries = allJournalEntries.filter((e) => e.date.startsWith(month.month));

                        const completedGoals = monthGoals.filter(
                            (g) => g.completed
                        ).length;
                        const totalGoals = monthGoals.length;
                        const completionRate =
                            totalGoals > 0
                                ? Math.round((completedGoals / totalGoals) * 100)
                                : 0;

                        return (
                            <Link
                                key={month.id}
                                to={`/months/${month.id}`}
                                className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                            >
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                        {new Date(month.month).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {month.theme}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Goals Progress
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {completedGoals}/{totalGoals} ({completionRate}
                                            %)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                        <div
                                            className="bg-gray-900 dark:bg-gray-100 h-2 rounded-full transition-all"
                                            style={{ width: `${completionRate}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Journal Entries
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {monthJournalEntries.length}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
