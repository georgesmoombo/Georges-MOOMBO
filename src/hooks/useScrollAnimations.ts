import { useEffect, useState } from 'react';

/**
 * Hook to manage scroll-triggered reveal animations via IntersectionObserver
 * and track scroll progress.
 * Adheres strictly to performance best practices and respects prefers-reduced-motion.
 */
export function useScrollAnimations() {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll-reveal classes
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const selectors = [
      '.scroll-reveal',
      '.fade-in-up',
      '.fade-in-down',
      '.fade-in-left',
      '.fade-in-right',
      '.zoom-in',
      '.stagger-children'
    ].join(', ');

    const elements = document.querySelectorAll<HTMLElement>(selectors);

    if (prefersReducedMotion) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve after initial reveal so animation is permanent and doesn't re-trigger abruptly
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -25px 0px',
      }
    );

    elements.forEach((el) => {
      // If the element is already above or within the initial viewport fold, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { scrollProgress };
}
