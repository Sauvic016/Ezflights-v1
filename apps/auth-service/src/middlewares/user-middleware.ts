import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/user-config";
import UserService from "../services/user-service";

type MyToken = {
  email: string;
  id: number;
  iat: number;
  exp: number;
};

const verifyToken = (token: string) => {
  try {
    const response = jwt.verify(token, JWT_KEY) as MyToken;
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error?.name == "JsonWebTokenError") {
      throw new Error();
    }
    console.log("Something went wrong in token validation");
    throw error;
  }
};
export const verifyUserRequest: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  // split off “Bearer `
  try {
    const jwtToken = authHeader.slice(7);
    req.body.user = verifyToken(jwtToken);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};

export const checkIfAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = req.body.user;
    if (!user || !user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const userService = new UserService();
    const isAdmin = await userService.isAdmin(user.id);

    if (!isAdmin) {
      res.status(403).json({ error: "Access denied. Admins only." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
