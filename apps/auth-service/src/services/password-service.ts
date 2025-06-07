import bcrypt from "bcryptjs";
import prisma from "@repo/database/client";

export class PasswordService {
  private otpStore: Record<string, string> = {};

  async generateOTP(email: string) {
    const otp = Math.floor(100_000 + Math.random() * 900_000).toString(); //generate a 6-digit otp
    this.otpStore[email] = otp;

    // ideally send an email here
    return otp;
  }

  async verifyOTP(otp: string, email: string) {
    if (this.otpStore[email] === otp) {
      delete this.otpStore[email];
      return true;
    }
    return false;
  }

  async resetPassword(email: string, newPassword: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      });
      const { password, ...userdetails } = user;
      return { message: "Password reset successfully" };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw new Error("Failed to reset password");
    }
  }
}
