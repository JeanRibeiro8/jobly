export interface Job {
  id: number
  title: string
  company: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract'
  description: string
  url: string // URL where the user can view and apply for the job
}