import { useEffect, useState } from 'react'
import type { Job } from './types/Job'

import Header from './components/Header'
import SearchBar from './components/SearchBar'
import JobCard from './components/JobCard'

function App() {
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchJobs() {
      try {
        // Start loading before the API request
        setLoading(true)

        // Make a GET request to the jobs REST API
        const response = await fetch(
          'https://www.arbeitnow.com/api/job-board-api'
        )

        // Check if the server returned an error status
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        // Convert the response body from JSON into JavaScript data
        const data = await response.json()

        // Store the jobs returned by the API
        setJobs(data.data)
      } catch {
        // Store the error state if the request fails
        setError(true)
      } finally {
        // Stop loading whether the request succeeds or fails
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  async function fetchJobs() {
  try {
    // Start loading before the API request
    setLoading(true)

    // Reset the previous error
    setError(false)

    // Make a GET request to the jobs REST API
    const response = await fetch(
      'https://www.arbeitnow.com/api/job-board-api'
    )

    // Check if the server returned an error status
    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }

    // Convert the response body from JSON into JavaScript data
    const data = await response.json()

    // Store the jobs returned by the API
    setJobs(data.data)
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

  // Stores what the user types in the job search input
  const [search, setSearch] = useState('')

  // Stores what the user types in the location input
  const [location, setLocation] = useState('')

  // Stores the job type selected by the user
  const [type, setType] = useState('')

  // Filters the jobs using all active search criteria
  const filteredJobs = jobs.filter((job) => {
    // Check if the title matches the search text
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase())

    // Check if the location matches the location text
    const matchesLocation = job.location
      .toLowerCase()
      .includes(location.toLowerCase())

    // If no type is selected, every type is accepted
    const matchesType = type === '' || job.type === type

    // The job must match all active filters
    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="container">
            <p className="eyebrow">Find your next opportunity</p>
            <h1>Find a job you’ll love.</h1>

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
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Opportunities</p>
                <h2>Available jobs</h2>
              </div>

              <span className="results-count">
                {filteredJobs.length}{' '}
                {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>

            {error ? (
              <div className="error-state">
                <h3>Something went wrong</h3>
                <p>We couldn't load the jobs. Please try again.</p>
              </div>
            ) : loading ? (
              <div className="loading-state">
                <p>Loading jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Try changing your search or filter.</p>
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container">
            <p className="eyebrow">About Jobly</p>

            <h2>
              A learning project focused on modern frontend development.
            </h2>

            <p>
              Jobly is being built with React, TypeScript and REST API
              integration, with a focus on search, filters, pagination and
              useful UI states.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default App