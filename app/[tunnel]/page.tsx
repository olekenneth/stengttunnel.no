import { getAllRoads, getRoadStatus, getAllRoadStatuses } from '@/lib/api'
import { notFound } from 'next/navigation'
import ClientApp from '@/components/ClientApp'

// Fallback list of common tunnels in case API is unavailable during build
const FALLBACK_TUNNELS = [
  'oslofjordtunnelen',
  'atlanterhavstunnelen',
  'blindheimstunnelen',
  'bjorgatunnelen',
  'bragernestunnelen',
]

// Generate static params for all tunnels
export async function generateStaticParams() {
  const roads = await getAllRoads()

  // If API is down, use fallback list to ensure at least some pages are generated
  if (roads.length === 0) {
    return FALLBACK_TUNNELS.map((tunnel) => ({
      tunnel,
    }))
  }

  return roads.map((road) => ({
    tunnel: road.urlFriendly,
  }))
}

// Generate metadata for each tunnel page
export async function generateMetadata({ params }: { params: { tunnel: string } }) {
  const roads = await getAllRoads()
  const road = roads.find((r) => r.urlFriendly === params.tunnel)

  if (!road) {
    return {
      title: 'Tunnel ikke funnet - Stengt tunnel',
    }
  }

  const status = await getRoadStatus(params.tunnel)

  if (!status) {
    return {
      title: `${road.roadName} - Stengt tunnel`,
      description: `Informasjon om ${road.roadName}`,
      openGraph: {
        title: `${road.roadName} - Stengt tunnel`,
        description: `Informasjon om ${road.roadName}`,
      },
    }
  }

  return {
    title: status.statusMessage,
    description: status.statusMessage,
    openGraph: {
      title: status.statusMessage,
      description: `Status for ${road.roadName}`,
    },
  }
}

export default async function TunnelPage({ params }: { params: { tunnel: string } }) {
  const roads = await getAllRoads()
  const road = roads.find((r) => r.urlFriendly === params.tunnel)

  if (!road) {
    notFound()
  }

  // Fetch all statuses for consistency
  const statusesMap = await getAllRoadStatuses()
  const statuses = Object.fromEntries(statusesMap)

  return <ClientApp roads={roads} initialStatuses={statuses} initialPath={params.tunnel} />
}
