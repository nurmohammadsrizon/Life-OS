import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logoImage from '../assets/ChatGPT Image Sep 3, 2026, 08_38_37 PM.png'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Download', path: '/download' },
  { label: 'Docs', path: '/docs' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function withCacheBust(url) {
  if (!url) return null
  return `${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`
}

function Navber({ isLoggedIn, onLogout }) {
  const navigate = useNavigate()
  const [profilePicture, setProfilePicture] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      setProfilePicture(null)
      return undefined
    }

    async function loadProfilePicture() {
      try {
        const identifier = localStorage.getItem('user_id') || localStorage.getItem('email') || localStorage.getItem('user_name')
        if (!identifier) return

        const response = await fetch(`http://127.0.0.1:8000/profile/${encodeURIComponent(identifier)}`)
        const data = await response.json()
        setProfilePicture(withCacheBust(data?.profile?.profile_picture))
      } catch (error) {
        console.error('Failed to load profile picture:', error)
      }
    }

    function handleProfileUpdated(event) {
      setProfilePicture(withCacheBust(event.detail?.profile_picture))
    }

    loadProfilePicture()
    window.addEventListener('lifeos:profile-updated', handleProfileUpdated)

    return () => window.removeEventListener('lifeos:profile-updated', handleProfileUpdated)
  }, [isLoggedIn])

  function handleAuthClick(event) {
    if (isLoggedIn) {
      event.preventDefault()
      onLogout?.()
    }
  }

  function handleProfileClick() {
    setMenuOpen(false)
    if (isLoggedIn) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  const renderedLinks = [...links]
  if (isLoggedIn) {
    renderedLinks.splice(3, 0, { label: 'Dashboard', path: '/dashboard' })
  }

  return (
    <header className="navbar-shell">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink className="brand" to="/">
          <img className="brand-mark brand-logo" src={logoImage} alt="LifeOS logo" />
          <span>LifeOS</span>
        </NavLink>

        <button
          className={`nav-menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links${menuOpen ? ' is-open' : ''}`}>
          {renderedLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button className="profile-btn" type="button" aria-label="Profile" onClick={handleProfileClick}>
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-btn-image" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            )}
          </button>
          {isLoggedIn ? (
            <button className="login-btn" type="button" onClick={handleAuthClick}>
              Logout
            </button>
          ) : (
            <NavLink className="login-btn" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navber
