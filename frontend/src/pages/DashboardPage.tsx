import { useListUsers } from "../hooks/useListUsers";
import { PaginatedTable, type TableHeader } from "../components/PaginatedTable";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import { usePagination } from "../hooks/usePagination";
import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { formatMoney } from "../utils";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    page,
    rowsPerPage,
    sortBy,
    sortOrder,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();

  const { data, isLoading, isRefetching, error } = useListUsers(
    page,
    rowsPerPage,
    sortBy,
    sortOrder
  );

  const userTableHeaderCells = useMemo<TableHeader[]>(
    () => [
      {
        id: "username",
        numeric: false,
        label: "Name",
        supportSorting: true,
        width: 120,
      },
      {
        id: "accountBalance",
        numeric: true,
        label: "Account Balance",
        supportSorting: true,
      },
      {
        id: "totalWagerAmount",
        numeric: true,
        label: () => (
          <Stack alignItems="center">
            <Typography>Wager amount</Typography>
            <Typography variant="caption">(Last 30 days)</Typography>
          </Stack>
        ),
        supportSorting: true,
      },
      {
        id: "lastLogin",
        numeric: true,
        label: "Last Login",
        supportSorting: true,
      },
      {
        id: "edit",
        numeric: true,
        label: "",
      },
    ],
    []
  );

  if (error) {
    return null;
  }

  return (
    <Stack
      sx={{
        maxWidth: "1000px",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5">Users</Typography>
      <PaginatedTable
        data={data?.users}
        isLoading={isLoading || isRefetching}
        page={page}
        rowsPerPage={rowsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        pageCount={data?.count}
        dataTotalRows={data?.total}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        headers={userTableHeaderCells}
        tableRowRender={(row) => (
          <TableRow key={row.id}>
            <TableCell
              component="th"
              scope="row"
              sx={{ width: "120px", whiteSpace: "nowrap" }}
            >
              {row.firstName} {row.lastName}
            </TableCell>
            <TableCell align="right">
              {formatMoney(row.accountBalance)}
            </TableCell>
            <TableCell align="right">
              {formatMoney(row.totalWagerAmount)}
            </TableCell>
            <TableCell align="right">
              {row.lastLogin ? new Date(row.lastLogin).toDateString() : ""}
            </TableCell>
            <TableCell
              onClick={() => navigate(`/user/${row.id}`)}
              style={{ width: 100 }}
            >
              <IconButton aria-label="see">
                <PersonIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      />
    </Stack>
  );
}
