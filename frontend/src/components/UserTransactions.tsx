import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { useGetUserTransactions } from "../hooks/useGetUserTransactions";
import { PaginatedTable, type TableHeader } from "./PaginatedTable";
import Typography from "@mui/material/Typography";
import { usePagination } from "../hooks/usePagination";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { TransactionType } from "../types";
import { useMemo } from "react";
import { formatMoney } from "../utils";

const TransctionTypeToTransactionTypeLabel = {
  [TransactionType.DEPOSIT]: "Deposit",
  [TransactionType.WITHDRAW]: "Withdraw",
  [TransactionType.BONUS]: "Bonus",
  [TransactionType.MANUAL_DEBIT]: "Manual debit",
};

type UserTransactionsProps = {
  userId: string;
};

export function UserTransactions(props: UserTransactionsProps) {
  const { userId } = props;

  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } =
    usePagination();

  const { data, isLoading, isRefetching } = useGetUserTransactions(
    userId,
    page,
    rowsPerPage
  );

  const headerCells = useMemo<TableHeader[]>(
    () => [
      {
        id: "Date",
        numeric: false,
        label: "Date",
        width: 200,
      },
      {
        id: "transactionType",
        numeric: false,
        label: "Transaction Type",
        width: 180,
      },
      {
        id: "comment",
        numeric: false,
        label: "Comment",
      },
      {
        id: "Amount",
        numeric: true,
        label: "Amount",
        width: 150,
      },
    ],
    []
  );

  return (
    <>
      <Typography variant="h5">Transactions</Typography>
      <Paper
        sx={{
          maxWidth: "1000px",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PaginatedTable
          data={data?.transactions}
          isLoading={isLoading || isRefetching}
          page={page}
          rowsPerPage={rowsPerPage}
          pageCount={data?.count}
          dataTotalRows={data?.total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          headers={headerCells}
          tableRowRender={(row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Typography>
                  {moment(row.createdAt).format("DD/MM/YYYY hh:mm")}
                </Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography>
                  {
                    TransctionTypeToTransactionTypeLabel[
                      row.transactionType as TransactionType
                    ]
                  }
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography>{row.comment}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={row.amount >= 0 ? "success" : "error"}>
                  {formatMoney(row.amount)}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </>
  );
}
