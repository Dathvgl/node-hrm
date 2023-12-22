import { envs } from "index";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(envs.MONGO_URL ?? "");
mongoClient.connect().then(() => console.log("MongoDB connect"));
export const mongoDB = mongoClient.db(envs.MONGO_DB);

export const personnelCollection = mongoDB.collection("personnel");
export const companyCollection = mongoDB.collection("company");
export const departmentCollection = mongoDB.collection("department");
export const vacationCollection = mongoDB.collection("vacation");
export const salaryCollection = mongoDB.collection("salary");
