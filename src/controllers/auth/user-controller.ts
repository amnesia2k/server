import { Request, RequestHandler, Response } from "express";
import { db } from "../../db/index";
import { usersTable } from "../../db/userSchema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { generateToken } from "../../helpers/generate-token";
import { comparePasswords, hashPassword } from "../../utils/hash";

type UpdateUserInput = Partial<typeof usersTable.$inferInsert>;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // validate user input
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    // checks if user already exists
    const existingUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUsers.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // TODO: Hash the password before saving it!
    // generate salt
    // const salt = await bcrypt.genSalt(10);

    // hash password
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await hashPassword(password);

    // creates a new user
    const createdUser = await db
      .insert(usersTable)
      .values({
        _id: createId(),
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    const { password: _, ...user } = createdUser[0];

    const token = generateToken(user?._id, user?.role);
    const userRole = createdUser[0]?.role;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      // secure: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("role", userRole, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      // secure: true,
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(201)
      .json({ message: "User created successfully", data: { ...user, token } });

    return;
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).json({ message: "Server error, try again later" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validate user input
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length === 0) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // const isPasswordValid = await bcrypt.compare(password, user[0].password);
    const isPasswordValid = await comparePasswords(password, user[0].password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user[0];

    const token = generateToken(
      userWithoutPassword?._id,
      userWithoutPassword?.role
    );
    const userRole = user[0]?.role;

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      // secure: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("role", userRole, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      // secure: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "User logged in successfully",
      data: { ...userWithoutPassword, token },
    });
    return;
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error, try again later" });
    return;
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(usersTable);

    // Remove password field from each user
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    if (usersWithoutPassword.length === 0) {
      res.status(404).json({ message: "No users found!" });
      return;
    }

    res.status(200).json({
      message: "All Users fetched successfully!",
      data: { users: usersWithoutPassword },
    });
    return;
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error, try again later" });
    return;
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    const requester = req.user; // Assuming the user ID is in the request object
    //  as { id: string; role: string }; // type hint, adjust if needed

    // Check if the requester is authenticated
    if (!requester) {
      res.status(401).json({ message: "User not authenticated!" });
      return;
    }

    const _id = requester._id; // Get the user ID from the requester

    if (!_id) {
      res.status(400).json({ message: "User ID is required!" });
      return;
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable._id, _id));

    if (user.length === 0) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const userWithoutPassword = user.map(({ password, ...user }) => user);

    res.status(200).json({
      message: "User fetched successfully!",
      data: { user: userWithoutPassword[0] },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error, try again later" });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const requester = req.user;

    if (!requester) {
      res.status(401).json({ message: "User not authenticated!" });
      return;
    }

    const _id = requester._id;
    if (!_id) {
      res.status(400).json({ message: "User ID is required!" });
      return;
    }

    const { name, email, bio, image, password } = req.body;

    // Build update object dynamically
    const updateData: UpdateUserInput = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (image) updateData.image = image;
    if (password) {
      // const salt = await bcrypt.genSalt(10);
      // updateData.password = await bcrypt.hash(password, salt);
      updateData.password = await hashPassword(password);
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No fields provided to update!" });
      return;
    }

    const updatedUser = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable._id, _id))
      .returning();

    if (!updatedUser || updatedUser.length === 0) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    // Exclude password from response
    const { password: _, ...safeUser } = updatedUser[0];

    res.status(200).json({
      message: "User updated successfully!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.token) {
      res.status(400).json({ message: "User is not logged in!" });
      return;
    }

    res.clearCookie("token", { path: "/" });
    res.clearCookie("role", { path: "/" });

    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    // Check if the requester is authenticated
    const requester = req.user;
    //  as { id: string; role: string }; // type hint, adjust if needed

    if (!requester) {
      res.status(401).json({ message: "User not authenticated!" });
      return;
    }

    const _id = requester._id;

    if (!_id) {
      res.status(400).json({ message: "User ID is required!" });
      return;
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable._id, _id));

    if (user.length === 0) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await db.delete(usersTable).where(eq(usersTable._id, _id));

    // Clear cookies
    res.clearCookie("token", { path: "/" });
    res.clearCookie("role", { path: "/" });

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

export const adminDeleteUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // const { id } = req.params;
    const { _id } = req.body; // Assuming the ID of the user to be deleted is passed in the request body

    // Check if the requester is authenticated
    const requester = req.user;
    //  as { id: string; role: string }; // type hint, adjust if needed

    console.log(requester);

    if (!requester || requester.role !== "admin") {
      res.status(403).json({ message: "Only admins can delete users" });
      return;
    }

    if (!_id) {
      res.status(400).json({ message: "User ID is required!" });
      return;
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable._id, _id));

    if (user.length === 0) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await db.delete(usersTable).where(eq(usersTable._id, _id));

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error, try again later" });
  }
};
