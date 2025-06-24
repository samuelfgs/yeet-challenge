import { useState } from "react";
import type { PaginatedTableProps } from "../components/PaginatedTable";

export function usePagination() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange: PaginatedTableProps<unknown>["onSortChange"] = (
    newSortBy,
    newSortOrder
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(0);
  };

  const handlePageChange: PaginatedTableProps<unknown>["onPageChange"] = (
    newPage
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange: PaginatedTableProps<unknown>["onRowsPerPageChange"] =
    (newRowsPerPage) => {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    };

  return {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  };
}
