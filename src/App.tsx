import { useEffect, useState } from 'react'
import type { Job, JobType } from './types/Job'

import Header from './components/Header'
import SearchBar from './components/SearchBar'
import JobCard from './components/JobCard'

interface ArbeitnowJob {
  slug: string
  title: string
  company_name: string
  location: string
  job_types: string[]
  description: string
  url: string
  created_at: number
}

// Convert API job types into categories used by our application
function normalizeJobType(types: string[]): JobType {
  const type = types[0]?.toLowerCase() ?? ''

  if (type.includes('full-time') || type.includes('full time')) {
    return 'Full-time'
  }

  if (type.includes('part-time') || type.includes('part time')) {
    return 'Part-time'
  }

  if (type.includes('internship')) {
    return 'Internship'
  }

  if (type.includes('contract')) {
    return 'Contract'
  }

  return 'Unknown'
}


async function loadJobs(): Promise<Job[]> {
  // Load multiple API pages so filters can search more jobs
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const responses = await Promise.all(
    pages.map((pageNumber) =>
      fetch(
        `https://www.arbeitnow.com/api/job-board-api?page=${pageNumber}`
      )
    )
  )

  // Check if any API request failed
  if (responses.some((response) => !response.ok)) {
    throw new Error('Failed to fetch jobs')
  }

  // Convert all responses into JSON
  const data = await Promise.all(
    responses.map((response) => response.json())
  )

  // Combine jobs from all API pages into one array
  const allJobs = data.flatMap((pageData) => pageData.data)

  // Convert API data into data that our application understands
  return allJobs.map((job: ArbeitnowJob) => ({
    id: job.slug,
    title: job.title,
    company: job.company_name,
    location: job.location,
    description: job.description,
    url: job.url,
    createdAt: job.created_at,
    type: normalizeJobType(job.job_types),
  }))
}

function App() {
  // Number of jobs displayed on each page
  const JOBS_PER_PAGE = 10

  // Stores the jobs received from the API
  const [jobs, setJobs] = useState<Job[]>([])

  // Stores the loading state
  const [loading, setLoading] = useState(true)

  // Stores the error state
  const [error, setError] = useState(false)

  // Stores the current page
  const [page, setPage] = useState(1)

  // Stores what the user types in the job search input
  const [search, setSearch] = useState('')

  // Stores what the user types in the location input
  const [location, setLocation] = useState('')

  // Stores the job type selected by the user
  const [type, setType] = useState('')

  async function fetchJobs() {
  try {
    // Start loading before the API request
    setLoading(true)

    // Reset the previous error
    setError(false)

    const normalizedJobs = await loadJobs()

    // Store the normalized jobs
    setJobs(normalizedJobs)
  } catch {
    // Store the error state if the request fails
    setError(true)
  } finally {
    // Stop loading whether the request succeeds or fails
    setLoading(false)
  }
}

  useEffect(() => {
    // Fetch jobs when the component loads
    fetchJobs()
  }, [])

  useEffect(() => {
    // Return to the first page when the search filters change
    setPage(1)
  }, [search, location, type])

  // Filter the jobs using all active search criteria
  const filteredJobs = jobs.filter((job) => {
    // Get the search text without unnecessary spaces
    const searchTerm = search.toLowerCase().trim()

    // Search by job title, company or location
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)

    // Check if the location matches the location filter
    const matchesLocation = job.location
      .toLowerCase()
      .includes(location.toLowerCase().trim())

    // If no type is selected, every type is accepted
    const matchesType = type === '' || job.type === type

    // The job must match all active filters
    return matchesSearch && matchesLocation && matchesType
  })

  // Calculate where the current page starts
  const startIndex = (page - 1) * JOBS_PER_PAGE

  // Take only the jobs that belong to the current page
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  )

  // Calculate the total number of pages
  const totalPages = Math.ceil(
    filteredJobs.length / JOBS_PER_PAGE
  )

  // Move to the next page
  const handleNextPage = () => {
    setPage(page + 1)
  }

  // Move to the previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  // Check if there are more filtered jobs on the next page
  const hasNextPage =
    startIndex + JOBS_PER_PAGE < filteredJobs.length

    const handleClearFilters = () => {
  // Reset all search filters
  setSearch('')
  setLocation('')
  setType('')
  setPage(1)
}
  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container">
            <p className="eyebrow">
              Find your next opportunity
            </p>

            <h1>
              Find a job you’ll love.
            </h1>

            <p className="hero-description">
              Search opportunities by title, location and job type.
            </p>

            <SearchBar
              search={search}
              onSearchChange={setSearch}
              location={location}
              onLocationChange={setLocation}
              type={type}
              onTypeChange={setType}
            />

            <button
  type="button"
  onClick={handleClearFilters}
  className="clear-filters-button"
>
  Clear filters
</button>
            
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  Opportunities
                </p>

                <h2>
                  Available jobs
                </h2>
              </div>

              <span className="results-count">
                {filteredJobs.length}{' '}
                {filteredJobs.length === 1
                  ? 'job found'
                  : 'jobs found'}
              </span>
            </div>

            {error ? (
              <div className="error-state">
                <h3>
                  Something went wrong
                </h3>

                <p>
                  We couldn't load the jobs. Please try again.
                </p>

                <button
                  type="button"
                  onClick={fetchJobs}
                  className="retry-button"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="loading-state">
                <div className="spinner"></div>

                <p>
                  Loading jobs...
                </p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>
                  No jobs found
                </h3>

                <p>
                  We couldn't find any jobs matching your search.
                  Try changing your keywords or filters.
                </p>
              </div>
            )}

            {filteredJobs.length > JOBS_PER_PAGE && (
              <div className="pagination">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container">
            <p className="eyebrow">
              About Jobly
            </p>

            <h2>
              A learning project focused on modern frontend development.
            </h2>

            <p>
              Jobly is being built with React, TypeScript and REST API
              integration, with a focus on search, filters, pagination
              and useful UI states.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default App