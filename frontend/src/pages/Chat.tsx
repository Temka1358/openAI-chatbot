import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';
type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Ref for chat container
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  const handleLevelChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLevel = event.target.value as number;
    try {
      await auth?.updateUserLevel(newLevel);
      toast.success("User level updated successfully");
      const newMessage: Message = {
        role: "user",
        content: `My english level is ${newLevel} now. Please response accordong to my new level from now on`,
      };
      setChatMessages((prev) => [...prev, newMessage]);
      const chatData = await sendChatRequest(newMessage.content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      toast.error("Failed to update user level");
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [auth]);

  useEffect(() => {
    // Scroll to the bottom when chatMessages changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
          </Avatar>
          {/* <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography> */}
          <Box sx={{ mx: "auto", my: 2 }}>
            <Typography>{t('setLevel')}</Typography>
            <FormControl fullWidth sx={{ maxWidth: 200 }}>
              <Select
                id="user-level"
                value={auth?.user?.level || ""}
                //@ts-ignore
                onChange={handleLevelChange}
                sx={{ color: "white" }}
              >
                <MenuItem value={1} sx={{ fontWeight: auth?.user?.level === 1 ? 'bold' : 'normal', color: 'black' }}>1</MenuItem>
                <MenuItem value={2} sx={{ fontWeight: auth?.user?.level === 2 ? 'bold' : 'normal', color: 'black' }}>2</MenuItem>
                <MenuItem value={3} sx={{ fontWeight: auth?.user?.level === 3 ? 'bold' : 'normal', color: 'black' }}>3</MenuItem>
                <MenuItem value={4} sx={{ fontWeight: auth?.user?.level === 4 ? 'bold' : 'normal', color: 'black' }}>4 </MenuItem>
                <MenuItem value={5} sx={{ fontWeight: auth?.user?.level === 5 ? 'bold' : 'normal', color: 'black' }}>5</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
          You can ask any question you want. For example: <br/><span style={{ fontWeight: "bold" }}>Can you explain the past perfect tense?' or 'What are the rules for using articles in English?</span>
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            {t("clearConversation")}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Chat in English Now!
        </Typography>
        <Box
          ref={chatContainerRef}
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
