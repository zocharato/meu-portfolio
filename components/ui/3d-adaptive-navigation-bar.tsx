'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useSpring } from 'framer-motion'

interface NavItem {
  label: string
  id: string
}

export const PillBase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickingRef = useRef(false)
  const activeSectionRef = useRef('home')

  const navItems: NavItem[] = useMemo(
    () => [
      { label: 'Início', id: 'home' },
      { label: 'Sobre', id: 'sobre' },
      { label: 'Habilidades', id: 'habilidades' },
      { label: 'Hobbies', id: 'hobbies' },
      { label: 'Contato', id: 'contato' },
    ],
    []
  )

  const pillWidth = useSpring(148, {
    stiffness: 240,
    damping: 30,
    mass: 0.95,
  })

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return

      tickingRef.current = true

      requestAnimationFrame(() => {
        const sections = navItems
          .map((item) => document.getElementById(item.id))
          .filter(Boolean) as HTMLElement[]

        const scrollPosition = window.scrollY + 140
        let nextActive = activeSectionRef.current

        for (const section of sections) {
          const top = section.offsetTop
          const height = section.offsetHeight

          if (scrollPosition >= top && scrollPosition < top + height) {
            nextActive = section.id
            break
          }
        }

        if (nextActive !== activeSectionRef.current) {
          activeSectionRef.current = nextActive
          setActiveSection(nextActive)
        }

        tickingRef.current = false
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  useEffect(() => {
    if (hovering) {
      setExpanded(true)
      pillWidth.set(460)

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setExpanded(false)
        pillWidth.set(148)
      }, 180)
    }

    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [hovering, pillWidth])

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    activeSectionRef.current = sectionId

    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    setHovering(false)
  }

  const activeItem = navItems.find((item) => item.id === activeSection)

  return (
    <motion.nav
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="fixed top-6 left-1/2 z-[999] -translate-x-1/2 rounded-full"
      style={{
        width: pillWidth,
        height: '58px',
        maxWidth: 'calc(100vw - 24px)',
        background:
          'linear-gradient(180deg, rgba(16,18,28,0.9) 0%, rgba(10,12,20,0.82) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: expanded
          ? '0 12px 35px rgba(0,0,0,0.45), 0 0 24px rgba(109,95,166,0.14)'
          : '0 10px 28px rgba(0,0,0,0.38)',
        overflow: 'hidden',
        willChange: 'width',
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        animate={{
          opacity: expanded ? 1 : 0.65,
          x: expanded ? 6 : 0,
        }}
        transition={{ duration: 0.28 }}
        style={{
          background:
            'linear-gradient(90deg, rgba(109,95,166,0.16), rgba(109,95,166,0.04), transparent)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        animate={{
          opacity: expanded ? 1 : 0.75,
        }}
        transition={{ duration: 0.25 }}
        style={{
          background:
            'radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-center gap-2 px-4">
        {!expanded && (
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.span
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-[15px] font-semibold text-white"
                >
                  {activeItem.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center gap-2"
          >
            {navItems.map((item, index) => {
              const isActive = item.id === activeSection

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03,
                  }}
                  whileHover={{
                    y: -1,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.985 }}
                  className="rounded-full px-3 py-2 text-[15px] font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? '#ffffff' : '#98a2b3',
                    background: isActive ? 'rgba(109,95,166,0.22)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(167,139,250,0.30)'
                      : '1px solid transparent',
                    boxShadow: isActive
                      ? '0 0 14px rgba(109,95,166,0.14)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#98a2b3'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}