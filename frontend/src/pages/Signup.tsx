import React, { useEffect } from "react";
import { Box, Typography, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [eikenLevel, setEikenLevel] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const age = formData.get("age") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Debugging: Log each value to ensure they're being correctly parsed
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Age:", age);
    console.log("Eiken Level:", eikenLevel);
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(firstName, lastName, parseInt(age, 10), parseInt(eikenLevel, 10), email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error.response.data.message, { id: "signup" });
    }
  };

  useEffect(() => {
    if (auth?.user) {
      navigate("/chat");
    }
  }, [auth, navigate]);

  return (
    <Box width={"100%"} height={"100%"} display="flex" flex={1}>
      <Box
        display={"flex"}
        flex={{ xs: 1, md: 0.5 }}
        justifyContent={"center"}
        alignItems={"center"}
        padding={2}
        ml={"auto"}
        mt={16}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            margin: "auto",
            padding: "30px",
            boxShadow: "10px 10px 20px #000",
            borderRadius: "10px",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              padding={2}
              fontWeight={600}
            >
              Signup
            </Typography>
            <CustomizedInput type="text" name="firstName" label="First Name" />
            <CustomizedInput type="text" name="lastName" label="Last Name" />
            <CustomizedInput type="number" name="age" label="Age" />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="eiken-level-label">English Level</InputLabel>
              <Select
                labelId="eiken-level-label"
                id="eiken-level"
                value={eikenLevel}
                label="Eiken Level"
                onChange={(e) => setEikenLevel(e.target.value)}
                sx={{ color: "white" }}
              >
                <MenuItem value={1} sx={{ color: "black" }}>Beginner</MenuItem>
                <MenuItem value={2} sx={{ color: "black" }}>Elementary</MenuItem>
                <MenuItem value={3} sx={{ color: "black" }}>Intermediate</MenuItem>
                <MenuItem value={4} sx={{ color: "black" }}>Upper Intermediate</MenuItem>
                <MenuItem value={5} sx={{ color: "black" }}>Advanced</MenuItem>
              </Select>
            </FormControl>
            <CustomizedInput type="email" name="email" label="Email" />
            <CustomizedInput type="password" name="password" label="Password" />
            <Button
              type="submit"
              sx={{
                px: 2,
                py: 1,
                mt: 2,
                width: "400px",
                borderRadius: 2,
                bgcolor: "#004d56",
                color: "white",
                fontSize: "18px",
                ":hover": {
                  bgcolor: "white",
                  color: "black",
                },
              }}
            >
              Signup
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
