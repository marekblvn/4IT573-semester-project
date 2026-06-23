import fs from "node:fs";
import bcrypt from "bcryptjs";
import { DB_FILE_PATH } from "./config";

export interface User {
  username: string;
  passwordHash: string;
  gamesPlayed: number;
  gamesWon: number;
  createdAt: string;
}

interface DatabaseSchema {
  users: Record<string, User>;
}

class Database {
  private data: DatabaseSchema = { users: {} };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(
          DB_FILE_PATH,
          "utf-8",
        );
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (error) {
      console.error(
        "Error loading database, initializing empty database:",
        error,
      );
      this.data = { users: {} };
    }
  }

  private save() {
    try {
      fs.writeFileSync(
        DB_FILE_PATH,
        JSON.stringify(this.data, null, 2),
        "utf-8",
      );
    } catch (error) {
      console.error("Error saving database:", error);
    }
  }

  public getUser(username: string): User | undefined {
    return this.data.users[username.toLowerCase()];
  }

  public async createUser(
    username: string,
    passwordPlain: string,
  ): Promise<User> {
    const lowerUsername = username.toLowerCase();
    if (this.data.users[lowerUsername]) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(
      passwordPlain,
      salt,
    );

    const user: User = {
      username: username, // Keep original casing for display
      passwordHash,
      gamesPlayed: 0,
      gamesWon: 0,
      createdAt: new Date().toISOString(),
    };

    this.data.users[lowerUsername] = user;
    this.save();
    return user;
  }

  public incrementUserStats(
    username: string,
    won: boolean,
  ) {
    const user = this.getUser(username);
    if (user) {
      user.gamesPlayed += 1;
      if (won) {
        user.gamesWon += 1;
      }
      this.data.users[username.toLowerCase()] = user;
      this.save();
    }
  }

  public getAllUsers(): User[] {
    return Object.values(this.data.users).map(
      ({ passwordHash, ...rest }) => rest as User,
    );
  }
}

export const db = new Database();
