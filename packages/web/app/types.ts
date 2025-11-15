export interface Goal {
    id: string;
    title: string;
    completed: boolean;
    targetMonth: string; // e.g., "2025-01" for January 2025
}

export interface JournalEntry {
    id: string;
    date: string; // ISO date format (e.g., "2025-01-15")
    wentWell: string;
    didNotGoWell: string;
    willDoDifferently: string;
}

export interface MasterMonth {
    id: string;
    month: string; // e.g., "2025-01" for January 2025
    theme: string;
}
