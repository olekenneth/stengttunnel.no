import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

interface Props {
  slug: string
}

const Slug: FC<Props> = ({ slug }) => {
  const router = useRouter()

  useEffect(() => {
    Promise.resolve(localStorage.getItem('favorites') || '[]')
      .then((r) => JSON.parse(r))
      .then((storedFavorites) => {
        if (storedFavorites.indexOf(slug) <= 0) {
          storedFavorites.push(slug)
          localStorage.setItem('favorites', JSON.stringify(storedFavorites))
        }

        router.push('/')
      })
  }, [router, slug])

  {
    /* Add a loading indicator / spinner? */
  }
  return <></>
}

export default Slug

// TODO: Clean this mess up. Move HTTP call to util, not use `any`, etc
export async function getStaticPaths() {
  const paths: Array<any> = []
  await fetch('https://api.stengttunnel.no/roads.json')
    .then((r) => r.json())
    .then((roads) => {
      roads.forEach((road: any) => {
        paths.push({ params: { slug: road.urlFriendly } })
      })
    })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }: any) {
  return {
    props: { slug: params.slug },
  }
}
