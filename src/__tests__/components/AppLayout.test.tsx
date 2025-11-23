import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AppLayout from '../../components/Layout/AppLayout'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.dashboard': 'Dashboard',
        'nav.create': 'Create Carousel',
        'nav.history': 'History',
        'nav.settings': 'Settings',
        'nav.logout': 'Logout',
      }
      return translations[key] || key
    },
  }),
}))

// Mock AuthContext
const mockLogout = vi.fn()
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
    isAuthenticated: true,
    isLoading: false,
    logout: mockLogout,
  }),
}))

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children content', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test Content</div>
        </AppLayout>
      </BrowserRouter>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render all navigation links', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // Check for navigation links (they appear in both desktop and mobile)
    const dashboardLinks = screen.getAllByText('Dashboard')
    expect(dashboardLinks.length).toBeGreaterThan(0)

    const createLinks = screen.getAllByText('Create Carousel')
    expect(createLinks.length).toBeGreaterThan(0)

    const historyLinks = screen.getAllByText('History')
    expect(historyLinks.length).toBeGreaterThan(0)

    const settingsLinks = screen.getAllByText('Settings')
    expect(settingsLinks.length).toBeGreaterThan(0)
  })

  it('should display user email', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    const emailElements = screen.getAllByText('test@example.com')
    expect(emailElements.length).toBeGreaterThan(0)
  })

  it('should render logo', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    const logoElements = screen.getAllByText('ApexCarousel')
    expect(logoElements.length).toBeGreaterThan(0)
  })

  it('should toggle mobile menu when hamburger is clicked', () => {
    const { container } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // Find hamburger button (has aria-label)
    const hamburgerButton = screen.getByLabelText('Toggle menu')

    // Find mobile menu by looking for the slide-out drawer
    const mobileMenu = container.querySelector('.lg\\:hidden.fixed.top-0.left-0.bottom-0')
    expect(mobileMenu).toBeInTheDocument()
    expect(mobileMenu).toHaveClass('-translate-x-full')

    // Click to open
    fireEvent.click(hamburgerButton)
    expect(mobileMenu).toHaveClass('translate-x-0')

    // Click again to close
    fireEvent.click(hamburgerButton)
    expect(mobileMenu).toHaveClass('-translate-x-full')
  })

  it('should call logout when logout button is clicked', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // Get all logout buttons (desktop and mobile)
    const logoutButtons = screen.getAllByText('Logout')

    // Click the first logout button
    fireEvent.click(logoutButtons[0])

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should close mobile menu when a navigation link is clicked', () => {
    const { container } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // Open mobile menu
    const hamburgerButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(hamburgerButton)

    const mobileMenu = container.querySelector('.lg\\:hidden.fixed.top-0.left-0.bottom-0')
    expect(mobileMenu).toHaveClass('translate-x-0')

    // Click a navigation link in mobile menu
    const dashboardLinks = screen.getAllByText('Dashboard')
    fireEvent.click(dashboardLinks[0])

    // Menu should close
    expect(mobileMenu).toHaveClass('-translate-x-full')
  })

  it('should close mobile menu when overlay is clicked', () => {
    const { container } = render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // Open mobile menu
    const hamburgerButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(hamburgerButton)

    const mobileMenu = container.querySelector('.lg\\:hidden.fixed.top-0.left-0.bottom-0')
    expect(mobileMenu).toHaveClass('translate-x-0')

    // Find and click overlay
    const overlay = container.querySelector('.bg-black.bg-opacity-50')
    expect(overlay).toBeInTheDocument()
    fireEvent.click(overlay!)

    // Menu should close
    expect(mobileMenu).toHaveClass('-translate-x-full')
  })

  it('should display user initial in avatar', () => {
    render(
      <BrowserRouter>
        <AppLayout>
          <div>Test</div>
        </AppLayout>
      </BrowserRouter>
    )

    // User email is test@example.com, so initial should be 'T'
    const avatarInitials = screen.getAllByText('T')
    expect(avatarInitials.length).toBeGreaterThan(0)
  })
})
