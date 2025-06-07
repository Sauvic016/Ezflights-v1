import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "@repo/database/client";
import { User, updateUser } from "@repo/types";
import { JWT_KEY } from "../config/user-config";

export default class UserService {
  private createToken(user: { email: string; id: number }) {
    try {
      console.log("jwt", JWT_KEY);
      const result = jwt.sign(user, JWT_KEY, { expiresIn: "1d" });
      return result;
    } catch (error) {
      console.log("Something went wrong in token creation");
      throw error;
    }
  }

  private checkPassword(
    userInputPlainPassword: string,
    encryptedPassword: string,
  ) {
    try {
      return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
    } catch (error) {
      console.log("Something went wrong in password comparison");
      throw error;
    }
  }
  public async createUser(data: User) {
    try {
      let userPassword = data.password;
      const SALT = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(userPassword, SALT);
      userPassword = encryptedPassword;

      const user = await prisma.user.create({
        data: {
          ...data,
          isActive: true,
          emailVerified: false,
          password: userPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          gender: true,
          isActive: true,
          emailVerified: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async loginUser(data: { email: string; password: string }) {
    try {
      const user = await this.getByEmail(data.email);
      if (!user) {
        throw new Error("No users found");
      }
      const passwordsMatch = this.checkPassword(data.password, user.password);
      if (!passwordsMatch) {
        throw new Error("Incorrect Password");
      }
      const newJWT = this.createToken({ email: user.email, id: user.id });

      const { password, createdAt, updatedAt, ...sanitizedUser } = user;
      return { ...sanitizedUser, token: newJWT };
    } catch (error) {
      throw error;
    }
  }

  // async isAuthenticated(token: string) {
  //   try {
  //     const response = this.verifyToken(token);
  //     const user = await this.getById(response.id);
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getById(userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          id: true,
          phone: true,
          gender: true,
          isActive: true,
          emailVerified: true,
        },
      });
      if (!user) {
        throw new Error("No user found with the id");
      }
      return user;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async getByEmail(userEmail: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });
      return user;
    } catch (error) {
      console.log("Something went wrong on repository layer");
      throw error;
    }
  }

  async isAdmin(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          userRoles: true,
        },
      });

      const adminRole = await prisma.role.findFirst({
        where: {
          name: "Admin",
        },
      });
      return user?.userRoles.some((ur) => ur.roleId === adminRole!.id);
    } catch (error) {
      console.log("Something went wrong in the service layer");
      throw error;
    }
  }

  async updateUser(userId: number, data: updateUser) {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...data,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          gender: true,
          isActive: true,
          emailVerified: true,
        },
      });
      const addRole = await prisma.userRole.create({
        data: {
          userId: updatedUser.id,
          roleId: 5,
        },
      });

      return { ...updatedUser, role: addRole };
    } catch (error) {
      throw error;
    }
  }

  async grantRoleToUser(userId: number, roleId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new Error(`User with id=${userId} not found`);
      }
      const role = await prisma.role.findFirst({
        where: {
          id: roleId,
        },
      });
      if (!role) {
        throw new Error(`Role "${roleId}" does not exist`);
      }
      const userRole = await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id,
          },
        },
        update: {
          assignedAt: new Date(),
        },
        create: {
          userId,
          roleId: role.id,
        },
      });
      return userRole;
    } catch (error) {
      throw error;
    }
  }

  // async verifyEmailToken(token:string) {
  //   try {
  //     const user = await User.findOne({
  //       where: {
  //         emailToken: token,
  //       },
  //     });
  //     if (!user) {
  //       throw new UserNotFoundError();
  //     }
  //     user.userStatus = "Active";
  //     await user.save();
  //     return user;
  //   } catch (error) {
  //     console.log("Something went wrong on repository layer");
  //     throw error;
  //   }
  // }

  // async grantRole(userId, roleId) {
  //   try {
  //     const user = await User.findByPk(userId);
  //     if (!user) {
  //       throw new UserNotFoundError();
  //     }
  //     const role = await Role.findByPk(roleId);
  //     if (!role) {
  //       throw new AppError(
  //         "RoleNotFoundError",
  //         "User role does not exist",
  //         "Invalid roleId",
  //       );
  //     }
  //     user.addRole(role);
  //     return true;
  //   } catch (error) {
  //     console.log("Something went wrong in the repository layer!");
  //     throw error;
  //   }
  // }
}
