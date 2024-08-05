import React, { useEffect } from "react";
import { Box, Typography, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [eikenLevel, setEikenLevel] = React.useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lastName = formData.get("lastName") as string;
    const firstName = formData.get("firstName") as string;
    const age = formData.get("age") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      toast.loading("Signing Up", { id: "signup" });
      await auth?.signup(firstName, lastName, parseInt(age, 10), parseInt(eikenLevel, 10), email, password);
      toast.success("Signed Up Successfully", { id: "signup" });
    } catch (error) {
      console.log(error);
      //@ts-ignore
      toast.error(error.response.data.message || error.response.data.errors[0].msg, { id: "signup" });
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
              {t('signup')}
            </Typography>
            <CustomizedInput type="text" name="firstName" label={t("firstname")} />
            <CustomizedInput type="text" name="lastName" label={t("lastname")} />
            <CustomizedInput type="number" name="age" label={t("age")} />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="eiken-level-label">{t("level")}</InputLabel>
              <Select
                labelId="eiken-level-label"
                id="eiken-level"
                value={eikenLevel}
                label="Eiken Level"
                onChange={(e) => setEikenLevel(e.target.value)}
                sx={{ color: "white" }}
              >
                <MenuItem value={1} sx={{ color: "black" }}>1 Beginner</MenuItem>
                <MenuItem value={2} sx={{ color: "black" }}>2</MenuItem>
                <MenuItem value={3} sx={{ color: "black" }}>3</MenuItem>
                <MenuItem value={4} sx={{ color: "black" }}>4</MenuItem>
                <MenuItem value={5} sx={{ color: "black" }}>5</MenuItem>
              </Select>
            </FormControl>
            <CustomizedInput type="email" name="email" label={t("email")} />
            <CustomizedInput type="password" name="password" label={t("password")} />
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
              {t('signup')}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
