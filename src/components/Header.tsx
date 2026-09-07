function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <a className="logo" href="/">
          Jobly
        </a>

        <nav className="nav">
          <a href="#jobs">Jobs</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
