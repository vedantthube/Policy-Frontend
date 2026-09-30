import { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  //   Checkbox,
  //   FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
// import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  // const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const getlocalstorage = localStorage.getItem("authToken");
  if (getlocalstorage) {
    navigate("/policyCalculation");
  }
  //login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default page refresh
    // setErrorMsg("");
    setLoading(true);

    try {
      // 1. Call Backend API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      // import.meta.env.API_BASE_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      // 2. Extract Token and User Data from Response
      const { token, user } = response.data;
      console.log(response.data);
      // 3. Save JWT Token and User Info to LocalStorage / SessionStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful!", response.data.message);
      navigate("/policyCalculation");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle server error response
      if (error.response && error.response.data) {
        console.log(error.response.data.message);
        // setErrorMsg(error.response.data.message || "Invalid credentials.");
      }
      // else {
      //   // setErrorMsg("Network error. Please try again later.");
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return loading ? (
    <div
      style={{
        display: "flex",
        // flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                borderRadius: "50%",
                p: 1.5,
                mb: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LockOutlined />
            </Box>

            <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
              Sign In
            </Typography>

            <Box
              component="form"
              onSubmit={handleLogin}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: "bold" }}
              >
                Sign In
              </Button>

              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    href="#"
                    variant="body2"
                    underline="hover"
                    sx={{ fontWeight: "bold" }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/register");
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
