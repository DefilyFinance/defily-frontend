import { Redirect } from 'react-router-dom'

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }) {
  return <Redirect to={{ ...location, pathname: '/swap' }} />
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToSwap(props) {
  const {
    location,
    location: { search },
    match: {
      params: { outputCurrency },
    },
  } = props

  return (
    <Redirect
      to={{
        ...location,
        pathname: '/swap',
        search:
          search && search.length > 1
            ? `${search}&outputCurrency=${outputCurrency}`
            : `?outputCurrency=${outputCurrency}`,
      }}
    />
  )
}
