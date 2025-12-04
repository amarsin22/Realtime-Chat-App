const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();

router.post("/get-or-create", async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [user1, user2] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [user1, user2]
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
