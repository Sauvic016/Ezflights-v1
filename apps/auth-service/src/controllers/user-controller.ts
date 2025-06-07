import { RequestHandler, Response } from "express";

import UserService from "../services/user-service";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  resetSchema,
} from "@repo/types";
import { PasswordService } from "../services/password-service";

const userService = new UserService();
const passwordService = new PasswordService();

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const validationResult = createUserSchema.safeParse(body);
    console.log("why", validationResult.error);
    if (!validationResult.success) {
      res.status(400).json({
        message: "Invalid user details",
      });
      return;
    }

    const validatedData = validationResult.data;
    const response = await userService.createUser(validatedData);
    res.status(201).json({
      data: response,
      message: "Successfully created User",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};
    res.status(500).json({
      message: "Something went wrong in the server",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};

export const signinUser: RequestHandler = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const validationResult = loginUserSchema.safeParse(body);

    if (!validationResult.success) {
      res.status(400).json({
        message: "Invalid user details",
      });
      return;
    }

    const validatedData = validationResult.data;
    const response = await userService.loginUser(validatedData);
    res.status(201).json({
      data: response,
      message: "Successfully logged in",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};
    res.status(500).json({
      message: "Something went wrong in the server",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};

export const isAdmin: RequestHandler = async (req, res) => {
  const data = req.body;
  const response = await userService.isAdmin(data.id);
  res.status(200).json({
    message: response,
  });
};
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await userService.getById(Number(userId));

    res.status(200).json({
      message: response,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the user",
    });
  }
};
export const updateUserDetails: RequestHandler = async (req, res) => {
  if (req.body.password) {
    res.status(400).json({
      message: "Please use forgot password to update your password",
    });
    return;
  }
  const { user, ...detailsToUpdate } = req.body;
  const validatedDetails = updateUserSchema.safeParse(detailsToUpdate);
  if (!validatedDetails.success) {
    res.status(400).json({
      message: "Failed to updated user details",
      error: validatedDetails.error,
    });
    return;
  }

  try {
    const updateuser = await userService.updateUser(
      Number(user.id),
      validatedDetails.data!,
    );
    res.status(200).json({
      message: "Successfully updated the user details",
      user: updateuser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error, Please try again after a few minutes",
      error,
    });
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  // 1) validate payload
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, otp, newPassword } = parsed.data;

  try {
    // 2) verify that this OTP was *actually* generated for that email
    const ok = await passwordService.verifyOTP(otp, email);
    if (!ok) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    // 3) now—and only now—update the password
    const user = await passwordService.resetPassword(email, newPassword);
    res.json({ message: "Password reset successful", user });
    return;
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to reset Password",
      error: err,
    });
  }
};

export const promoteUser: RequestHandler = async (req, res) => {
  const targetUserId = Number(req.body.userId);
  const roleId = Number(req.body.roleId);
  try {
    const ur = await userService.grantRoleToUser(targetUserId, roleId);
    res.json({ message: "User promoted", userRole: ur });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
