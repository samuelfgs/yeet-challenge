import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
} from "@mui/material";
import { Formik, type FormikConfig } from "formik";
import { useBalanceAdjustment } from "../hooks/useBalanceAdjustment";

type AdminTransactionModalProps = {
  userId: string;
  open: boolean;
  onClose: (added: boolean) => void;
};

type NewTransactionData = {
  amount: string;
  comment: string;
  transactionType: "credit" | "debit";
};

export function BalanceAdjustmentModal({
  userId,
  open,
  onClose,
}: AdminTransactionModalProps) {
  const { mutateAsync, reset, isError, error } = useBalanceAdjustment(userId);

  const handleSumbit: FormikConfig<NewTransactionData>["onSubmit"] = async (
    values
  ) => {
    await mutateAsync({
      type: values.transactionType,
      amount: Math.floor(+values.amount * 100),
      comment: values.comment,
    });
    onClose(true);
  };

  return (
    <>
      <Modal open={open} onClose={() => onClose(false)}>
        <Stack
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            gap: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Admin Balance Adjustment
          </Typography>
          <Formik<NewTransactionData>
            initialValues={{
              amount: "",
              comment: "",
              transactionType: "credit",
            }}
            onSubmit={handleSumbit}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <form
                onSubmit={handleSubmit}
                style={{
                  gap: "inherit",
                  display: "inherit",
                  flexDirection: "inherit",
                }}
              >
                <FormControl>
                  <FormLabel id="transcation-type">Transaction Type</FormLabel>
                  <RadioGroup
                    aria-labelledby="transcation-type"
                    defaultValue="credit"
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="credit"
                      control={<Radio />}
                      label="Credit"
                    />
                    <FormControlLabel
                      value="debit"
                      control={<Radio />}
                      label="Debit"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="amount">Amount</InputLabel>
                  <Input
                    id="amount"
                    value={values.amount}
                    onChange={handleChange}
                    type="number"
                  />
                </FormControl>
                <FormControl variant="filled">
                  <InputLabel htmlFor="comment">Comment</InputLabel>
                  <Input
                    id="comment"
                    value={values.comment}
                    onChange={handleChange}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ mt: 4 }}
                  type="submit"
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </Stack>
      </Modal>
      <Snackbar
        open={isError}
        onClose={reset}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
          key={error?.message}
        >
          Failed to add a new transaction: {error?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
