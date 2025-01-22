import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    let pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    let passBcrypt = await bcrypt.hash(pass, salt);

    const newUser = await User.create({
      ...req.body,
      password: passBcrypt,
    });

    return res.status(200).json({
      errCode: 0,
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return next(createError(404, "username don't exits!"));
    } else {
      const passUser = req.body.password;

      const checkPass = await bcrypt.compare(passUser, user.password);

      const { password, ...info } = user._doc;
      if (checkPass) {
        const token = jwt.sign(
          {
            id: user._id,
            isSeller: user.isSeller,
          },
          process.env.JWT_KEY
        );
        return res
          .cookie("accessToken", token, {
            httpOnly: true,
          })
          .status(200)
          .send(info);
      } else {
        next(createError(500, " Please , Enter again password"));
      }
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSITE: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
