import { Paper, Stack, Typography } from "@mui/material";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error?.message ?? "Unknown error" };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Stack sx={{ width: "100%", alignItems: "center" }}>
          <Paper
            sx={{
              padding: 4,
              mt: 8,
              gap: 4,
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="error">
              An internal error has occurred. Please try again later.
            </Typography>
            <Typography variant="h6" color="error">
              If the problem persists, contact support for assistance.
            </Typography>
          </Paper>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
