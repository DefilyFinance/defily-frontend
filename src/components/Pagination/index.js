import ReactPaginate from 'react-paginate'
import PropsTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'react-feather'

import 'styles/invest.scss'

const Pagination = ({ pageCount, onChangePage, currentPage }) => {
  function handleChangePage({ selected }) {
    if (selected + 1 !== currentPage) {
      onChangePage(selected)
    }
  }

  return (
    <div className="flex justify-center items-center">
      <ReactPaginate
        previousLabel={<ChevronLeft size={16} />}
        nextLabel={<ChevronRight size={16} />}
        breakLabel="..."
        breakClassName="break-me"
        pageCount={pageCount}
        initialPage={currentPage - 1}
        forcePage={currentPage - 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handleChangePage}
        containerClassName="flex pagination"
        pageClassName="custom__pagination__item"
        previousClassName="custom__pagination__item"
        nextClassName="custom__pagination__item"
        subContainerClassName="pages pagination"
        activeClassName="custom__pagination__item custom__pagination__item--active"
      />
    </div>
  )
}

Pagination.propTypes = {
  pageCount: PropsTypes.number.isRequired,
  onChangePage: PropsTypes.func.isRequired,
  currentPage: PropsTypes.number.isRequired,
}

export default Pagination
