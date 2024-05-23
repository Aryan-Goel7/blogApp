import conf from "../conf/conf";
import { Client, Databases, Storage, ID, Query } from "appwrite";

class Service {
  client = new Client();
  storage;
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteURL)
      .setProject(conf.appWriteProjectID);
    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);
  }

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    author,
  }) {
    try {
      const postCreated = await this.databases.createDocument(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        slug,
        { title, content, featuredImage, status, userId, author }
      );
      console.log("Post Created Successfully ");
      return postCreated;
    } catch (err) {
      console.log("Error in Create Post : ", err.message);
    }
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const updatedPost = await this.databases.updateDocument(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        slug,
        { title, content, featuredImage, status }
      );
    } catch (error) {
      console.log("Appwrite Service :: updatePost : ", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        slug
      );
      console.log("Post Deleted Successfully");
    } catch (error) {
      console.log("Appwrite Service :: deletePost :: ", error);
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        slug
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async getPosts(queries = [Query.equal("status", [true])]) {
    try {
      const posts = await this.databases.listDocuments(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        queries
      );
      return posts;
    } catch (error) {
      console.log("Appwrite Service :: getPosts :", error);
    }
  }
  async getUserPosts(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseID,
        conf.appWriteCollectionID,
        [Query.equal("userId", userId)]
      );
    } catch (err) {
      console.log("Error Occured in getUserPost :: ", err.message);
    }
  }

  // File Service

  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        conf.appWriteBucketID,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite Service :: uploadFile : ", error);
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(conf.appWriteBucketID, fileId);
    } catch (error) {}
  }

  getFilePreview(fileId) {
    try {
      return this.storage.getFilePreview(conf.appWriteBucketID, fileId);
    } catch (error) {
      console.log("Appwrite Service :: getFilePreview ", error);
    }
  }
}

const appwriteService = new Service();

export default appwriteService;
