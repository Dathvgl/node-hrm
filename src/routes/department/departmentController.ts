import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { departmentCollection, personnelCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { ListResult } from "types/base";
import { CompanyPostType, CompanyType } from "types/company";
import { DepartmentAllGetType, DepartmentsGetType } from "types/department";
import { BaseMongo } from "types/mongo";
import { momentNowTS } from "utils/date";

export default class DepartmentController {
  async getDepartmentAll(req: Request, res: Response) {
    const data = await departmentCollection
      .aggregate<DepartmentAllGetType>([
        { $sort: { name: 1 } },
        { $addFields: { id: { $toObjectId: "$_id" } } },
        { $project: { id: 1, stt: 1, name: 1 } },
      ])
      .toArray();

    res.json(data);
  }

  async getDepartments(req: Request, res: Response) {
    const query = req.query as { page?: string; limit?: string };
    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await departmentCollection
      .aggregate<ListResult<DepartmentsGetType>>([
        {
          $facet: {
            data: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $sort: { createdAt: -1 } },
              { $addFields: { id: { $toObjectId: "$_id" } } },
              { $project: { _id: 0 } },
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

  async postDepartment(req: Request, res: Response) {
    const body = req.body as CompanyPostType;

    const obj = {
      ...body,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await departmentCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await departmentCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async deleteDepartment(req: Request, res: Response) {
    const { id } = req.params;

    const data = (await departmentCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<CompanyType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi update company", 500);
    } else {
      await personnelCollection.updateMany(
        { company: data._id },
        { company: "" }
      );

      res.json({ id: data._id, code: data.code, name: data.name });
    }
  }
}
