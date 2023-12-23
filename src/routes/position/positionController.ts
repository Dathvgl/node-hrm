import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { fieldLookup, positionCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { ListResult } from "types/base";
import { BaseMongo } from "types/mongo";
import {
  PositionAllGetType,
  PositionPostType,
  PositionType,
  PositionsGetType,
} from "types/position";
import { momentNowTS } from "utils/date";

export default class PositionController {
  async getPositionAll(req: Request, res: Response) {
    const { id } = req.params;

    const data = await positionCollection
      .aggregate<PositionAllGetType>([
        { $match: { department: id } },
        { $sort: { name: 1 } },
        { $addFields: { id: { $toObjectId: "$_id" } } },
        { $project: { id: 1, stt: 1, name: 1 } },
      ])
      .toArray();

    res.json(data);
  }

  async getPositions(req: Request, res: Response) {
    const query = req.query as { page?: string; limit?: string };
    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await positionCollection
      .aggregate<ListResult<PositionsGetType>>([
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

  async postPosition(req: Request, res: Response) {
    const body = req.body as PositionPostType;

    const obj = {
      ...body,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await positionCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await positionCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async deletePosition(req: Request, res: Response) {
    const { id } = req.params;

    const data = (await positionCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<PositionType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi delete position", 500);
    }

    res.json({ id: data._id, name: data.name });
  }
}
