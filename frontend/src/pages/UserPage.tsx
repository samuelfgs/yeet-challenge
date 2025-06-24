import { useParams } from "react-router-dom";
import { useGetUserById } from "../hooks/useGetUserById";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { TypographyWithSkeleton } from "../components/TypographyWithSkeleton";
import Avatar from "@mui/material/Avatar";
import { UserTransactions } from "../components/UserTransactions";
import Button from "@mui/material/Button";
import { BetsChart } from "../components/BetsChart";
import { useState } from "react";
import { BalanceAdjustmentModal } from "../components/BalanceAdjustmentModal";
import { formatMoney } from "../utils";
import Box from "@mui/material/Box";
import { Alert, Snackbar, Typography } from "@mui/material";
import moment from "moment";

export function UserPage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessfulUpdate, setShowSuccessfullUpdate] = useState(false);

  const { data: user, isLoading } = useGetUserById(id);

  const handleCloseModal = (successful: boolean) => {
    setShowModal(false);
    setShowSuccessfullUpdate(successful);
  };
  const handleCloseSnackbar = () => {
    setShowSuccessfullUpdate(false);
  };

  if (!id) {
    throw new Error("Missing user id");
  }

  return (
    <Stack gap={3} width="100%" alignItems="center">
      <Paper
        sx={{
          maxWidth: "800px",
          width: "100%",
          padding: 2,
          marginTop: 2,
          gap: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack flexDirection="row" alignItems="center" gap={2}>
          <Stack>
            {isLoading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <Avatar src={user?.avatar} />
            )}
          </Stack>
          <TypographyWithSkeleton isLoading={isLoading}>
            <Typography>
              {user?.firstName} {user?.lastName}
            </Typography>
          </TypographyWithSkeleton>
        </Stack>
        <TypographyWithSkeleton isLoading={isLoading} label="Email:">
          {user?.email}
        </TypographyWithSkeleton>
        <TypographyWithSkeleton isLoading={isLoading} label="Member since:">
          {user ? moment(user.createdAt).format("DD/MM/YYYY") : ""}
        </TypographyWithSkeleton>
        <TypographyWithSkeleton isLoading={isLoading} label="Last login:">
          {user ? moment(user.lastLogin).format("DD/MM/YYYY") : ""}
        </TypographyWithSkeleton>
        <TypographyWithSkeleton isLoading={isLoading} label="Account balance:">
          {formatMoney(user?.accountBalance)}
        </TypographyWithSkeleton>
        <TypographyWithSkeleton isLoading={isLoading} label="Total deposit:">
          {formatMoney(user?.depositAmount)}
        </TypographyWithSkeleton>
        <TypographyWithSkeleton isLoading={isLoading} label="Total withdraw:">
          {formatMoney(Math.abs(user?.withdrawAmount ?? 0))}
        </TypographyWithSkeleton>
        <Box mt={1}>
          <Button variant="contained" onClick={() => setShowModal(true)}>
            Balance Adjustment
          </Button>
        </Box>
      </Paper>
      <BetsChart userId={id} />
      <UserTransactions userId={id} />
      <BalanceAdjustmentModal
        userId={id}
        open={showModal}
        onClose={handleCloseModal}
      />
      <Snackbar
        open={showSuccessfulUpdate}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Added new transaction successfully
        </Alert>
      </Snackbar>
    </Stack>
  );
}
