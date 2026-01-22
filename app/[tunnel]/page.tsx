import { getAllRoads, getRoadStatus, getAllRoadStatuses } from '@/lib/api'
import { notFound } from 'next/navigation'
import ClientApp from '@/components/ClientApp'

export const revalidate = 0

// Generate static params for all tunnels
export async function generateStaticParams() {
  const roads = await getAllRoads()

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
    title: `${road.roadName} - ${status.statusMessage}`,
    description: `Status for ${road.roadName}: ${status.statusMessage}`,
    openGraph: {
      title: `${road.roadName} - ${status.statusMessage}`,
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
