import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  //   Link,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  //   FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
  });
  interface FormErrors {
    // name?: string;
    // email?: string;
    // phone?: string;
    // gender?: string;
    // dob?: string;
    // password?: string;
    err?: string;
  }
  const [errors, setErrors] = useState<FormErrors>({});
  // const [apiError, setApiError] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // if (errors[name as keyof FormErrors]) {
    //   setErrors((prev) => ({ ...prev, [name]: "" }));
    // }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const validateForm = (): FormErrors => {
      const newErrors: FormErrors = {};

      if (!formData.name.trim()) {
        newErrors.err = "Name is required";
        return newErrors;
      }

      if (!formData.email.trim()) {
        newErrors.err = "Email is required";
        return newErrors;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.err = "Enter a valid email address";
        return newErrors;
      }
      if (formData.phone.length != 10 || formData.phone == "") {
        newErrors.err = "Enter correct phone number";
        return newErrors;
      }
      if (formData.dob == "") {
        newErrors.err = "Enter correct DOB";
        return newErrors;
      }
      if (formData.gender == "") {
        newErrors.err = "Choose Gender ";
        return newErrors;
      }
      if (!formData.password) {
        newErrors.err = "Password is required";
        return newErrors;
      } else if (formData.password.length < 6) {
        newErrors.err = "Password must be at least 6 characters";
        return newErrors;
      }
      console.log("newErrors", newErrors);
      return newErrors;

      // Form is valid if no error keys exist
      //   return Object.keys(newErrors).length === 0;
    };
    const err = validateForm();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      return;
    }

    console.log("Form Data:", formData);
    // Add logic here (e.g., send data to API)
    // setLoading(true);
    const saveUser = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save user");
        }

        // Successful submit: Navigate to policy calculation page
        navigate("/login  ");
      } catch (err) {
        // setApiError(err.message);
        console.log(err);
      } finally {
        // setLoading(false);
      }
    };
    saveUser();
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const saveUser = () => {};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
            Sign Up
          </Typography>
          {errors.err != "" && <p style={{ color: "red" }}>{errors.err}</p>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            {/*Name*/}
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Enter Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            {/* Email Field */}
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

            {/* 10-Digit Phone Number */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              //   error={Boolean(phoneError)}
              //   helperText={phoneError}
              slotProps={{
                htmlInput: { maxLength: 10 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                },
              }}
            />

            {/* Date of Birth Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="dob"
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              slotProps={{
                inputLabel: {
                  shrink: true, // keeps label floating above date picker
                },
              }}
            />

            {/* Gender Selection */}
            <FormControl margin="normal" component="fieldset" fullWidth>
              <FormLabel id="gender-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="gender-radio-buttons-group-label"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>

            {/* Password Field */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: "bold" }}
              onClick={saveUser}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
