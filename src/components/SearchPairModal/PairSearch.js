import Input from 'components/Input/Input'
import useKardiachain from 'hooks/useKardiachain'
import { useCallback, useMemo, useRef, useState } from 'react'
import useDebounce from 'hooks/useDebounce'
import { isAddress } from 'utils/index'
import CommonBases from 'components/SearchPairModal/CommonBases'
import PairList from 'components/SearchPairModal/PairList'
import { filterTokens, useSortedTokensByQuery } from 'components/SearchPairModal/filtering'
import useTokenComparator from 'components/SearchPairModal/sorting'

function PairSearch({ selectedPair, onPairSelect, otherSelectedPair, pairs }) {
  const { chainId } = useKardiachain()

  // refs for fixed size lists
  const fixedList = useRef()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState(false)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens = useMemo(() => {
    return filterTokens(Object.values(pairs), debouncedQuery)
  }, [pairs, debouncedQuery])

  const sortedTokens = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const handlePairSelect = useCallback(
    (pair) => {
      onPairSelect(pair)
    },
    [onPairSelect],
  )

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

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
            />
          </div>
          <CommonBases pairs={pairs} chainId={chainId} onSelect={handlePairSelect} />
        </div>
        {filteredSortedTokens?.length > 0 ? (
          <div>
            <PairList
              height={390}
              currencies={filteredSortedTokens}
              onPairSelect={handlePairSelect}
              otherSelectedPair={otherSelectedPair}
              selectedPair={selectedPair}
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

export default PairSearch
