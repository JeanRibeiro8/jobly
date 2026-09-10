export type JobType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Contract'
  | 'Unknown'

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  description: string
  url: string
  createdAt: number
}