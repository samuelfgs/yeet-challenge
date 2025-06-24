import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination, {
  type TablePaginationProps,
} from "@mui/material/TablePagination";
import { type TablePaginationActionsProps } from "@mui/material/TablePaginationActions";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useRef, type ReactNode } from "react";

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();

  const totalPages = Math.ceil(count / rowsPerPage) - 1;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick: IconButtonProps["onClick"] = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick: IconButtonProps["onClick"] = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick: IconButtonProps["onClick"] = (event) => {
    onPageChange(event, Math.max(0, totalPages));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= totalPages}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export type TableHeader = {
  id: string;
  label: string | (() => ReactNode);
  numeric: boolean;
  width?: number;
  supportSorting?: boolean;
};

export type PaginatedTableProps<T> = {
  data: T[] | undefined;
  headers: TableHeader[];
  page: number;
  rowsPerPage: number;
  isLoading: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pageCount?: number;
  dataTotalRows?: number;
  tableRowRender: (row: T) => React.ReactNode;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

export function PaginatedTable<T>(props: PaginatedTableProps<T>) {
  const {
    data,
    headers,
    page,
    rowsPerPage,
    isLoading,
    sortBy,
    sortOrder,
    pageCount,
    dataTotalRows,
    onSortChange,
    onPageChange,
    onRowsPerPageChange,
    tableRowRender,
  } = props;

  const tableHeadRef = useRef<HTMLTableSectionElement>(null);
  const emptyRows =
    page > 0 && pageCount ? Math.max(0, rowsPerPage - pageCount) : 0;

  const handleChangeRowsPerPage: TablePaginationProps["onRowsPerPageChange"] = (
    event
  ) => {
    tableHeadRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  const handlePageChange: TablePaginationProps["onPageChange"] = (_, page) => {
    tableHeadRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    onPageChange(page);
  };

  const renderLabel = (label: TableHeader["label"]) => {
    if (typeof label === "function") {
      return label();
    } else {
      return <Typography>{label}</Typography>;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead ref={tableHeadRef}>
          <TableRow>
            {headers.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? "right" : "left"}
                sortDirection={sortBy === headCell.id ? sortOrder : undefined}
                style={{ width: headCell.width }}
              >
                {onSortChange && headCell.supportSorting ? (
                  <TableSortLabel
                    active={sortBy === headCell.id}
                    direction={sortBy === headCell.id ? sortOrder : "asc"}
                    onClick={() => {
                      const isAsc =
                        sortBy === headCell.id && sortOrder === "asc";
                      onSortChange(headCell.id, isAsc ? "desc" : "asc");
                    }}
                  >
                    {renderLabel(headCell.label)}
                  </TableSortLabel>
                ) : (
                  renderLabel(headCell.label)
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading && data ? (
            <>
              {data.map((row) => tableRowRender(row))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </>
          ) : (
            Array.from({ length: rowsPerPage }).map((_, index) => (
              <TableRow key={index} style={{ height: 53 }}>
                <TableCell colSpan={6} align="center">
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              colSpan={3}
              count={data && dataTotalRows ? dataTotalRows : -1}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                },
              }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
