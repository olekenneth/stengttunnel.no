'use client'

import { useEffect } from 'react'
import ReactDOM from 'react-dom'

// Client component to load the findDOMNode polyfill for Semantic UI React compatibility
export default function ReactDomPolyfill() {
  useEffect(() => {
    // Polyfill for findDOMNode to support Semantic UI React with React 18
    // This is needed because Semantic UI React uses an outdated dependency
    // that relies on the deprecated findDOMNode API

    if (typeof window !== 'undefined') {
      if (!(ReactDOM as any).findDOMNode) {
        // @ts-ignore - Adding polyfill for legacy API
        (ReactDOM as any).findDOMNode = (component: any) => {
          if (component == null) {
            return null
          }

          // If it's a DOM element, return it directly
          if (component.nodeType === 1) {
            return component
          }

          // For React components, try to get the underlying DOM node
          // This is a simplified version that works for most cases
          if (component._reactInternals?.child?.stateNode) {
            return component._reactInternals.child.stateNode
          }

          // Fallback: return null
          console.warn('findDOMNode polyfill: Could not find DOM node for component')
          return null
        }
      }
    }
  }, [])

  return null
}
