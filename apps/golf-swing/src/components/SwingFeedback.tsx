"use client";

import { useState } from "react";
import type { SwingAnalysis, CategoryAnalysis } from "@/lib/types";

function scoreColor(score: number): string {
  if (score <= 3) return "text-red-600";
  if (score <= 6) return "text-yellow-600";
  return "text-green-600";
}

function barColor(score: number): string {
  if (score <= 3) return "bg-red-500";
  if (score <= 6) return "bg-yellow-500";
  return "bg-green-500";
}

function badgeStyle(estimate: string): string {
  switch (estimate) {
    case "beginner":
      return "bg-blue-100 text-blue-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "advanced":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  grip: "Grip",
  stance: "Stance",
  backswing: "Backswing",
  downswing: "Downswing",
  follow_through: "Follow-through",
};

function CategoryRow({
  name,
  category,
}: {
  name: string;
  category: CategoryAnalysis;
}) {
  const [open, setOpen] = useState(false);
  const label = CATEGORY_LABELS[name] ?? name;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <span className="w-28 shrink-0 text-sm font-medium text-gray-700">
          {label}
        </span>
        <div className="flex-1">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className={`h-2.5 rounded-full ${barColor(category.score)}`}
              style={{ width: `${category.score * 10}%` }}
            />
          </div>
        </div>
        <span
          className={`w-8 text-right text-sm font-bold ${scoreColor(category.score)}`}
        >
          {category.score}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <ul className="pb-3 pl-4 space-y-1.5">
          {category.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600">
              <span className="shrink-0 text-gray-400">&bull;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SwingFeedback({
  analysis,
}: {
  analysis: SwingAnalysis;
}) {
  return (
    <div className="space-y-5">
      {/* Top priority fix */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          Top Priority
        </p>
        <p className="mt-1 text-sm text-amber-900">
          {analysis.top_priority_fix}
        </p>
      </div>

      {/* Overall score + handicap */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span
            className={`text-5xl font-extrabold ${scoreColor(analysis.overall_score)}`}
          >
            {analysis.overall_score}
          </span>
          <span className="mt-0.5 text-xs text-gray-500">/ 10</span>
        </div>
        <div>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStyle(analysis.handicap_estimate)}`}
          >
            {analysis.handicap_estimate}
          </span>
        </div>
      </div>

      {/* Category scores */}
      <div className="rounded-lg border border-gray-200 bg-white px-4">
        {Object.entries(analysis.categories).map(([name, category]) => (
          <CategoryRow key={name} name={name} category={category} />
        ))}
      </div>
    </div>
  );
}
