import type { Goal, JournalEntry, MasterMonth } from "./types";

// Mock data - replace with real API calls later
const MOCK_MASTER_MONTHS: MasterMonth[] = [
    {
        id: "1",
        month: "2025-01",
        theme: "Health & Wellness",
    },
    {
        id: "2",
        month: "2024-12",
        theme: "Career Growth",
    },
];

const MOCK_GOALS: Goal[] = [
    { id: "1", title: "Exercise 5 times per week", completed: false, targetMonth: "2025-01" },
    { id: "2", title: "Meditate daily for 10 minutes", completed: true, targetMonth: "2025-01" },
    { id: "3", title: "Read 2 books", completed: false, targetMonth: "2025-01" },
    { id: "4", title: "Complete online course", completed: true, targetMonth: "2024-12" },
    { id: "5", title: "Network with 5 professionals", completed: true, targetMonth: "2024-12" },
    { id: "6", title: "Update portfolio", completed: false, targetMonth: "2024-12" },
];

const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
    {
        id: "1",
        date: "2025-01-15",
        wentWell: "Completed morning workout and meditated for 15 minutes.",
        didNotGoWell: "Didn't drink enough water throughout the day.",
        willDoDifferently: "Set hourly reminders to drink water.",
    },
    {
        id: "2",
        date: "2025-01-16",
        wentWell: "Great workout session and finished reading a chapter.",
        didNotGoWell: "Stayed up too late working on a project.",
        willDoDifferently: "Set a strict bedtime alarm.",
    },
    {
        id: "3",
        date: "2025-01-17",
        wentWell: "Completed all my morning routines and had a productive work session.",
        didNotGoWell: "Skipped my evening walk due to bad weather.",
        willDoDifferently: "Do indoor exercise when weather is bad.",
    },
];

// Simulate network delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export async function getMasterMonths(): Promise<MasterMonth[]> {
    await delay();
    return MOCK_MASTER_MONTHS;
}

export async function createMasterMonth(month: string, theme: string): Promise<MasterMonth> {
    await delay();
    const newMonth: MasterMonth = {
        id: Date.now().toString(),
        month,
        theme,
    };
    MOCK_MASTER_MONTHS.push(newMonth);
    return newMonth;
}

export async function getGoals(): Promise<Goal[]> {
    await delay();
    return MOCK_GOALS;
}

export async function createGoal(title: string, targetMonth: string): Promise<Goal> {
    await delay();
    const newGoal: Goal = {
        id: Date.now().toString(),
        title,
        completed: false,
        targetMonth,
    };
    MOCK_GOALS.push(newGoal);
    return newGoal;
}

export async function toggleGoal(goalId: string): Promise<Goal> {
    await delay();
    const goal = MOCK_GOALS.find((g) => g.id === goalId);
    if (!goal) throw new Error("Goal not found");
    goal.completed = !goal.completed;
    return goal;
}

export async function deleteGoal(goalId: string): Promise<void> {
    await delay();
    const index = MOCK_GOALS.findIndex((g) => g.id === goalId);
    if (index !== -1) {
        MOCK_GOALS.splice(index, 1);
    }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
    await delay();
    return MOCK_JOURNAL_ENTRIES;
}

export async function createJournalEntry(
    entry: Omit<JournalEntry, "id">
): Promise<JournalEntry> {
    await delay();
    const newEntry: JournalEntry = {
        id: Date.now().toString(),
        ...entry,
    };
    MOCK_JOURNAL_ENTRIES.push(newEntry);
    return newEntry;
}
