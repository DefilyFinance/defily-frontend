import Input from 'components/Input/Input'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Currency, ETHER } from 'defily-v2-sdk'
import useDebounce from 'hooks/useDebounce'
import { useAllTokens } from 'hooks/Tokens'
import { isAddress } from '../../utils'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import useTokenComparator from './sorting'

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  listHideTokens,
}) {
  const { chainId } = useKardiachain()

  // refs for fixed size lists
  const fixedList = useRef()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState(false)

  const allTokens = useAllTokens()

  const showETH = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'k' || s === 'ka' || s === 'kai'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens = useMemo(() => {
    let tokens = filteredTokens
    if (listHideTokens) {
      tokens = filteredTokens.filter(
        (token) => !listHideTokens.find((tokenFilter) => token.address === tokenFilter.address),
      )
    }

    return tokens.sort(tokenComparator)
  }, [filteredTokens, listHideTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect],
  )

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'kai') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  )

  return (
    <>
      <div>
        <div>
          <div>
            <Input
              id="token-search-input"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </div>
          {showCommonBases && (
            <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
          )}
        </div>
        {filteredSortedTokens?.length > 0 ? (
          <div>
            <CurrencyList
              height={390}
              showETH={showETH}
              currencies={filteredSortedTokens}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
            />
          </div>
        ) : (
          <div>
            <p>No results found.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default CurrencySearch
