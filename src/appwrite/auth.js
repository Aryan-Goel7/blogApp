import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteURL)
      .setProject(conf.appWriteProjectID);
    this.account = new Account(this.client);
  }

  async signUp({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        this.logIn({ email, password });
      } else {
      }
    } catch (error) {
      console.log("Error in :: signUp ", error);
    }
  }
  async logIn({ email, password }) {
    try {
      // console.log(email, password);
      return await this.account.createEmailPasswordSession(email, password);
    } catch (err) {
      console.log("Error :: logIn", err);
    }
  }
  async getCurrentUser() {
    try {
      const currentUser = await this.account.get();
      return currentUser;
    } catch (error) {
      console.log("Error in :: getCurrentUser ", error);
      throw error; // Re-throw the error to handle it in the caller function
    }
  }
  async logOut() {
    try {
      this.account.deleteSessions();
    } catch (error) {
      console.log("Error in :: LogOut ", error);
    }
  }
}

const authService = new AuthService();

export default authService;
