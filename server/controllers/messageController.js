const Message = require("../models/Message");

// --------------------------------------
// Save Message (used by socket)
// --------------------------------------
exports.saveMessage = async (data) => {
  const msg = new Message({
    chatId: data.chatId,
    sender: data.sender,
    text: data.text,
  });

  const saved = await msg.save();
  return saved.populate("sender", "name avatar");
};

// --------------------------------------
// Get Messages by Chat ID
// --------------------------------------
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
