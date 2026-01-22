import { getAllRoads, getAllRoadStatuses } from '@/lib/api'
import ClientApp from '@/components/ClientApp'

export const revalidate = 0

export default async function HomePage() {
  const roads = await getAllRoads()
  const statusesMap = await getAllRoadStatuses()

  // Convert Map to plain object for client components
  const statuses = Object.fromEntries(statusesMap)

  return <ClientApp roads={roads} initialStatuses={statuses} />
}
