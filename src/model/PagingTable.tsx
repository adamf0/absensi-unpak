interface PagingTable {
  totalData: number,
  totalPage: number,
  currentPage: number,
  start: number,
  end: number,
  prevPage: number | null,
  nextPage: number | null,
}

export default PagingTable;