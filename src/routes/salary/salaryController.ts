import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { fieldLookup, salaryCollection, salaryContractCollection, salaryProductCollection, salaryRevenueCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { ListResult } from "types/base";
import { BaseMongo } from "types/mongo";
import {
  SalariesGetType,
  SalaryAllGetType,
  SalaryContractPostType,
  SalaryPostType,
  SalaryProductPostType,
  SalaryRevenuePostType,
  SalaryType,
} from "types/salary";
import { momentNowTS } from "utils/date";

export default class SalaryController {
  async getSalaryAll(req: Request, res: Response) {
    const data = await salaryCollection
      .aggregate<SalaryAllGetType>([
        { $sort: { name: 1 } },
        { $addFields: { id: { $toObjectId: "$_id" } } },
        { $project: { id: 1, stt: 1, name: 1 } },
      ])
      .toArray();

    res.json(data);
  }

  async getSalaries(req: Request, res: Response) {
    const query = req.query as { page?: string; limit?: string };
    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await salaryCollection
      .aggregate<ListResult<SalariesGetType>>([
        {
          $facet: {
            data: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $sort: { createdAt: -1 } },
              { $addFields: { id: { $toObjectId: "$_id" } } },
              { $project: { _id: 0 } },
              ...fieldLookup({
                document: "department",
                inField: "name",
                project: { $project: { _id: 0, name: 1 } },
              }),
            ],
            totalPage: [{ $count: "total" }],
          },
        },
        { $addFields: { currentPage: page } },
        {
          $project: {
            totalAll: {
              $let: {
                vars: { props: { $first: "$totalPage" } },
                in: "$$props.total",
              },
            },
            currentPage: 1,
            data: 1,
          },
        },
      ])
      .next();

    res.json(data);
  }

  async postSalary(req: Request, res: Response) {
    const body = req.body as SalaryPostType;

    const obj = {
      ...body,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await salaryCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await salaryCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async postSalaryRevenue(req: Request, res: Response) {
    const { id } = req.params;
    const body = req.body as SalaryRevenuePostType;

    const obj = {
      ...body,
      personnel: id,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await salaryRevenueCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await salaryRevenueCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async postSalaryContract(req: Request, res: Response) {
    const { id } = req.params;
    const body = req.body as SalaryContractPostType;

    const obj = {
      ...body,
      personnel: id,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await salaryContractCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await salaryContractCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async postSalaryProduct(req: Request, res: Response) {
    const { id } = req.params;
    const body = req.body as SalaryProductPostType;

    const obj = {
      ...body,
      personnel: id,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await salaryProductCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await salaryProductCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async deleteSalary(req: Request, res: Response) {
    const { id } = req.params;

    const data = (await salaryCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<SalaryType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi delete Salary", 500);
    }

    res.json({ id: data._id, name: data.name });
  }
}
