interface SearchBarProps {
  // Current text in the job search input
  search: string

  // Function used to change the search text
  onSearchChange: (value: string) => void

  // Current text in the location input
  location: string

  // Function used to change the location
  onLocationChange: (value: string) => void

  // Current selected job type
  type: string

  // Function used to change the selected job type
  onTypeChange: (value: string) => void
}

function SearchBar({
  search,
  onSearchChange,
  location,
  onLocationChange,
  type,
  onTypeChange,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="field">
        <label htmlFor="job-search">Job title</label>
        <input
          id="job-search"
          type="text"
          placeholder="Job title, keyword..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="location-search">Location</label>
        <input
          id="location-search"
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="type-filter">Job type</label>
<select
  value={type}
  onChange={(event) => onTypeChange(event.target.value)}
>
  <option value="">All job types</option>
  <option value="Full-time">Full-time</option>
  <option value="Part-time">Part-time</option>
  <option value="Internship">Internship</option>
  <option value="Contract">Contract</option>
</select>

      </div>
    </div>
  )
}

export default SearchBar
