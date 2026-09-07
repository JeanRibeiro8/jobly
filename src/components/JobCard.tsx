import type { Job } from '../types/Job'

interface JobCardProps {
  // Job object received from the parent component
  job: Job
}

function JobCard({ job }: JobCardProps) {
  // Remove HTML tags from the API description
  const cleanDescription = job.description.replace(/<[^>]*>/g, ' ')

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div>
          <h2>{job.title}</h2>
          <p className="company">{job.company}</p>
        </div>

        <span className="job-type">{job.type}</span>
      </div>

      <p className="job-location">{job.location}</p>

      <p className="job-description">
        {cleanDescription}
      </p>
      
<a
  href={job.url}
  target="_blank"
  rel="noopener noreferrer"
  className="apply-button"
>
  View job
</a>

    </article>
  )
}

export default JobCard