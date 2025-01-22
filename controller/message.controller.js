import createError from "../utils/createError.js";
import Message from "../model/Message.model.js";
import Conversation from "../model/Conversation.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc.trim(),
    });
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );
    res.status(201).send(savedMessage);
  } catch (error) {
    next(createError(error));
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (error) {
    next(createError(error));
  }
};
