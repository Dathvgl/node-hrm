import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { timesheetCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { ListResult } from "types/base";
import { BaseMongo } from "types/mongo";
import {
  TimesheetPostType,
  TimesheetTimeGetType,
  TimesheetType,
  TimesheetsGetType,
} from "types/timesheet";
import { momentNowTS } from "utils/date";

export default class TimesheetController {
  async getTimesheetCurrent(req: Request, res: Response) {
    const { id } = req.params;
    const query = req.query as { month?: string; year?: string };

    const today = new Date();
    const month = Number.parseInt(query.month ?? `${today.getMonth() + 1}`);
    const year = Number.parseInt(query.year ?? `${today.getFullYear()}`);

    const data = await timesheetCollection
      .aggregate<TimesheetTimeGetType>([
        { $match: { personnel: id, month, year } },
        { $addFields: { id: { $toObjectId: "$_id" } } },
        { $project: { _id: 0, id: 1, days: 1 } },
      ])
      .toArray();

    if (data.length == 0) {
      res.json(null);
    } else res.json(data[0]);
  }

  async getTimesheets(req: Request, res: Response) {
    const query = req.query as { page?: string; limit?: string };
    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await timesheetCollection
      .aggregate<ListResult<TimesheetsGetType>>([
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

  async postTimesheet(req: Request, res: Response) {
    const body = req.body as TimesheetPostType;

    const obj = {
      ...body,
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await timesheetCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { insertedId } = await timesheetCollection.insertOne({
      ...obj,
      stt: stts.length == 0 ? 1 : stts[0].stt + 1,
    });

    res.json({ ...obj, id: insertedId });
  }

  async putTimesheetDay(req: Request, res: Response) {
    const { id } = req.params;
    const { days } = req.body as { days: string[] };

    await timesheetCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { days: { $each: days } } }
    );

    res.json({ id });
  }

  async deleteTimesheet(req: Request, res: Response) {
    const { id } = req.params;

    const data = (await timesheetCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<TimesheetType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi delete timesheet", 500);
    }

    res.json({ id: data._id });
  }
}
