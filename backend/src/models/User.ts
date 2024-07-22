
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { openaiSystemMessage } from "../config/openai-configs.js";

const chatSchema = new mongoose.Schema({
    id : {
        type: String,
        default: () => randomUUID(),
    },
    role: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    eikenLevel: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    chat: {
        type: [chatSchema],
    }

})


userSchema.pre('save', function(next){
    if(this.isNew){
      this.chat.push({
        role: "system",
        content: openaiSystemMessage(this.eikenLevel)
      })
    }
    next();
})

export default mongoose.model('User', userSchema);