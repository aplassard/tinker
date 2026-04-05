import { useState, useCallback } from "react";

export interface MeditationSession {
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  patternId: string;
  completedAt: string; // ISO timestamp
}

const STORAGE_KEY = "meditation_sessions";

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function loadSessions(): MeditationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MeditationSession[]) : [];
  } catch {
    return [];
  }
}

function computeStats(sessions: MeditationSession[]) {
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  // Build a set of unique days with sessions
  const days = new Set(sessions.map((s) => s.date));

  // Compute current streak (consecutive days ending today or yesterday)
  let currentStreak = 0;
  const today = toDateStr(new Date());
  let cursor = new Date();

  // Start from today; if no session today, start from yesterday
  if (!days.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (days.has(toDateStr(cursor))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Compute longest streak
  if (days.size === 0) {
    return { totalSessions, totalMinutes, currentStreak: 0, longestStreak: 0, days };
  }

  const sortedDays = Array.from(days).sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return { totalSessions, totalMinutes, currentStreak, longestStreak: longest, days };
}

export function useSessionStorage() {
  const [sessions, setSessions] = useState<MeditationSession[]>(loadSessions);

  const recordSession = useCallback((duration: number, patternId: string) => {
    const now = new Date();
    const session: MeditationSession = {
      date: toDateStr(now),
      duration,
      patternId,
      completedAt: now.toISOString(),
    };
    setSessions((prev) => {
      const updated = [...prev, session];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const stats = computeStats(sessions);

  return { sessions, recordSession, stats };
}
