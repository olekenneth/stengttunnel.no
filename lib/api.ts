import type { IRoad, IRoadStatus } from './types'

const API_BASE = 'https://api.stengttunnel.no'

export async function getAllRoads(): Promise<IRoad[]> {
  try {
    const res = await fetch(`${API_BASE}/roads.json`, {
      cache: 'force-cache',
      // Add timeout and retry logic for build resilience
      signal: AbortSignal.timeout(10000)
    })

    if (!res.ok) {
      console.error('Failed to fetch roads:', res.status, res.statusText)
      return []
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching roads:', error)
    // Return empty array as fallback for build resilience
    return []
  }
}

export async function getRoadStatus(urlFriendly: string): Promise<IRoadStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/${urlFriendly}/status.json`, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(10000)
    })

    if (!res.ok) {
      console.error(`Failed to fetch status for ${urlFriendly}:`, res.status, res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching status for ${urlFriendly}:`, error)
    return null
  }
}

export async function getAllRoadStatuses(): Promise<Map<string, IRoadStatus>> {
  const roads = await getAllRoads()
  const statuses = new Map<string, IRoadStatus>()

  // Fetch all statuses in parallel
  const statusPromises = roads.map(async (road) => {
    try {
      const status = await getRoadStatus(road.urlFriendly)
      if (status) {
        statuses.set(road.urlFriendly, status)
      }
    } catch (error) {
      console.error(`Error fetching ${road.urlFriendly}:`, error)
    }
  })

  await Promise.all(statusPromises)
  return statuses
}
