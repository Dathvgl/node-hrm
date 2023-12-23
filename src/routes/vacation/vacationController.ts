import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { fieldLookup, vacationCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { ListResult } from "types/base";
import { BaseMongo } from "types/mongo";
import {
  VacationPostType,
  VacationStatusType,
  VacationType,
  VacationsGetType,
} from "types/vacation";
import { momentNowTS } from "utils/date";

export default class vacationController {
  async getVacations(req: Request, res: Response) {
    const query = req.query as { page?: string; limit?: string };
    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await vacationCollection
      .aggregate<ListResult<VacationsGetType>>([
        {
          $facet: {
            data: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $sort: { createdAt: -1 } },
              { $addFields: { id: { $toObjectId: "$_id" } } },
              { $project: { _id: 0 } },
              {
                $lookup: {
                  from: "personnel",
                  localField: "personnel",
                  foreignField: "id",
                  pipeline: [{ $project: { _id: 0, name: 1 } }],
                  as: "personnel",
                },
              },
              {
                $addFields: {
                  personnel: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.name",
                    },
                  },
                },
              },
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

  async postVacation(req: Request, res: Response) {
    const body = req.body as VacationPostType;

    const obj = {
      ...body,
      status: "pending",
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await vacationCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await vacationCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async putVacationStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.query as { status: VacationStatusType };

    const data = (await vacationCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    )) as (BaseMongo & Omit<VacationType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi update vacation status", 500);
    } else {
      res.json({ id: data._id, status });
    }
  }

  async deleteVacation(req: Request, res: Response) {
    const { id } = req.params;

    const data = (await vacationCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<VacationType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi delete vacation", 500);
    }

    res.json({ id: data._id });
  }
}
