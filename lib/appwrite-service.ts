import { Account, Client, ID, Databases, Storage } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string);

export const appwrite = {
  client,
  account: new Account(client),
  ID,
  databases: new Databases(client),
  storage: new Storage(client),
};
