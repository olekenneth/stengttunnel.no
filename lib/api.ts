import type { IRoad, IRoadStatus } from './types'

const API_BASE = 'https://api.stengttunnel.no'

export async function getAllRoads(): Promise<IRoad[]> {
  const res = await fetch(`${API_BASE}/roads.json`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch roads')
  }

  return res.json()
}

export async function getRoadStatus(urlFriendly: string): Promise<IRoadStatus> {
  const res = await fetch(`${API_BASE}/${urlFriendly}/status.json`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch status for ${urlFriendly}`)
  }

  return res.json()
}

export async function getAllRoadStatuses(): Promise<Map<string, IRoadStatus>> {
  const roads = await getAllRoads()
  const statuses = new Map<string, IRoadStatus>()

  // Fetch all statuses in parallel
  const statusPromises = roads.map(async (road) => {
    try {
      const status = await getRoadStatus(road.urlFriendly)
      statuses.set(road.urlFriendly, status)
    } catch (error) {
      console.error(`Error fetching ${road.urlFriendly}:`, error)
    }
  })

  await Promise.all(statusPromises)
  return statuses
}
