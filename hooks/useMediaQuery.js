import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design that detects if a media query matches
 * @param {string} query - The media query to check
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Set initial value
      setMatches(media.matches);

      // Define listener function
      const listener = (event) => {
        setMatches(event.matches);
      };

      // Add listener for changes
      media.addEventListener('change', listener);

      // Clean up listener on unmount
      return () => {
        media.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
}