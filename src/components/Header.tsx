function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <a href="#" className="logo">
          Jobly
        </a>

        <nav className="nav" aria-label="Main navigation">
          <a href="#jobs">Jobs</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  )
}

export default Header