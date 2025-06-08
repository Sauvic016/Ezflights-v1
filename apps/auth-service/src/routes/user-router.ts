import express from "express";
import {
  isAdmin,
  registerUser,
  signinUser,
  getUserById,
  updateUserDetails,
  promoteUser,
} from "../controllers/user-controller";
import {
  verifyUserRequest,
  checkIfAdmin,
} from "../middlewares/user-middleware";

const router = express.Router();

router.post("/create", registerUser);
router.post("/login", signinUser);
router.get("/users/:id", getUserById);
router.put("/update", verifyUserRequest, updateUserDetails);
router.get("/isAdmin", isAdmin);
router.post("/grantrole", verifyUserRequest, checkIfAdmin, promoteUser);

export default router;
