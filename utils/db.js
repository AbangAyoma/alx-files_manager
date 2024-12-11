#!/usr/bin/node

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


class DBClient {
    constructor() {
      const host = process.env.DB_HOST || 'localhost';
      const port = process.env.DB_PORT || 27017;
      const database = process.env.DB_DATABASE || 'files_manager';

      const url = `mongodb://${host}:${port}`;

      this.client = new MongoClient(url);
      this.db = null;

      this.client.connect()
        .then(() => {
          console.log("Successfully logged into MongoDB");
          this.db = this.client.db(database);
        }
      ).catch((error) => {
        console.error(`Login failed: ${error}`);
      });
    }

    isAlive() {
      return this.client.isOpen();
    }

    async nbUsers() {
      try {
        const count = await this.db.collection('users').countDocuments();
        return count;
      } catch (error) {
        console.error(`Failed to fetch users: ${error}`);
        return 0;
      };
    }

    async nbFiles() {
      try {
        const count = await this.client.collection('files');
        return count;
      } catch (error) {
        console.error(`Failed to fetch files: ${error.message}`);
        return 0;
      };
    }
}

const dbClient = new DBClient;

export default dbClient;
