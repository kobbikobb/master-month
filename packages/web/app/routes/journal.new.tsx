import { useState } from "react";
import { useNavigate } from "react-router";
import type { JournalEntry } from "../types";
import { createJournalEntry } from "../api";

export default function NewJournalEntry() {
    const navigate = useNavigate();
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const [entry, setEntry] = useState<Partial<JournalEntry>>({
        date: todayString,
        wentWell: "",
        didNotGoWell: "",
        willDoDifferently: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (entry.date && entry.wentWell && entry.didNotGoWell && entry.willDoDifferently) {
            await createJournalEntry({
                date: entry.date,
                wentWell: entry.wentWell,
                didNotGoWell: entry.didNotGoWell,
                willDoDifferently: entry.willDoDifferently,
            });
            navigate("/journal");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4">
            <div className="py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                        Daily Journal Entry
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {new Date(entry.date || today).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="wentWell"
                            className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
                        >
                            What went well today?
                        </label>
                        <textarea
                            id="wentWell"
                            value={entry.wentWell}
                            onChange={(e) =>
                                setEntry({ ...entry, wentWell: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                            placeholder="Reflect on the positive moments and achievements of your day..."
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="didNotGoWell"
                            className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
                        >
                            What did not go well?
                        </label>
                        <textarea
                            id="didNotGoWell"
                            value={entry.didNotGoWell}
                            onChange={(e) =>
                                setEntry({ ...entry, didNotGoWell: e.target.value })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                            placeholder="Be honest about challenges and setbacks..."
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="willDoDifferently"
                            className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3"
                        >
                            What will you do differently tomorrow?
                        </label>
                        <textarea
                            id="willDoDifferently"
                            value={entry.willDoDifferently}
                            onChange={(e) =>
                                setEntry({
                                    ...entry,
                                    willDoDifferently: e.target.value,
                                })
                            }
                            rows={4}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
                            placeholder="Plan your improvements and actions for tomorrow..."
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                        >
                            Save Entry
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
