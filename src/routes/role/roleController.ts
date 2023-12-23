import { Request, Response } from "express";
import { roleCollection } from "models/mongo";
import { RoleGetAllType } from "types/role";

export default class RoleController {
  async getRoleAll(req: Request, res: Response) {
    const data = await roleCollection
      .aggregate<RoleGetAllType>([
        { $sort: { name: 1 } },
        { $addFields: { id: { $toObjectId: "$_id" } } },
        { $project: { id: 1, stt: 1, name: 1 } },
      ])
      .toArray();

    res.json(data);
  }
}
