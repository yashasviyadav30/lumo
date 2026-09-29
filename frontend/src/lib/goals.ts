import { api } from './api'

export type Topic = { id: string; name: string; query: string }

export type Goal = {
  id: string
  text: string
  field: string | null
  field_label: string
  level: string | null
  level_label: string | null
  topic_id: string | null
  language: string
  did_you_mean: Array<{ index: number; label: string }>
  minor_signals: string[]
  query: string | null
  topics: Topic[]
}

export const getActiveGoal = () => api<Goal | null>('/api/goals/active')
export const setGoal = (text: string) => api<Goal>('/api/goals', { method: 'POST', body: JSON.stringify({ text }) })
export const chooseMeaning = (goalId: string, index: number) =>
  api<Goal>(`/api/goals/${goalId}/choose`, { method: 'POST', body: JSON.stringify({ index }) })

// One plain line describing how the app understood the goal: "CMA · CMA Intermediate · Paper 8: Cost Accounting".
export function goalSummary(goal: Goal): string {
  if (!goal.field) return goal.field_label
  const topic = goal.topics.find((t) => t.id === goal.topic_id)
  return [goal.field_label.split(' (')[0], goal.level_label, topic?.name].filter(Boolean).join(' · ')
}
