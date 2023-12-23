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
export const positionCollection = mongoDB.collection("position");
export const roleCollection = mongoDB.collection("role");

type FieldLookup = {
  document: string;
  as?: string;
  field?: string;
  inField: string;
  project?: { $project: Record<string, any> };
};

export function fieldLookup({
  document,
  as,
  field,
  inField,
  project,
}: FieldLookup) {
  const pipeline: any[] = [
    {
      $match: {
        $expr: { $eq: [{ $toString: "$_id" }, `$$${field ?? document}`] },
      },
    },
  ];

  if (project) pipeline.push(project);

  return [
    {
      $lookup: {
        from: document,
        let: { [field ?? document]: `$${field ?? document}` },
        pipeline,
        as: as ?? document,
      },
    },
    {
      $addFields: {
        [as ?? document]: {
          $let: {
            vars: { props: { $first: `$${as ?? document}` } },
            in: `$$props.${inField}`,
          },
        },
      },
    },
  ];
}
