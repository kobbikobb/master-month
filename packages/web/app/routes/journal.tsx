import { Link } from "react-router";
import { useEffect, useState } from "react";
import type { JournalEntry } from "../types";
import { getJournalEntries } from "../api";

export default function Journal() {
    // Get current month in YYYY-MM format
    const today = new Date();
    const currentMonthString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // State
    const [allJournalEntries, setAllJournalEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const entries = await getJournalEntries();
                setAllJournalEntries(entries);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filter journal entries for current month (by date)
    const journalEntries = allJournalEntries.filter((e) => e.date.startsWith(currentMonthString));

    const sortedEntries = [...journalEntries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

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
                            Journal Entries
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Your daily reflections and progress
                        </p>
                    </div>
                    <Link
                        to="/journal/new"
                        className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                    >
                        New Entry
                    </Link>
                </div>

                {sortedEntries.length === 0 ? (
                    <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No journal entries yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start your reflection journey by writing your first entry.
                        </p>
                        <Link
                            to="/journal/new"
                            className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                        >
                            Write First Entry
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                            >
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        {new Date(entry.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                                            What went well
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {entry.wentWell}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                                            What did not go well
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {entry.didNotGoWell}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">
                                            What I'll do differently
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {entry.willDoDifferently}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
