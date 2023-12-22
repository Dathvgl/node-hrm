import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { departmentCollection, personnelCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { CompanyPostType, CompanyType } from "types/company";
import { BaseMongo } from "types/mongo";
import { momentNowTS } from "utils/date";

export default class DepartmentController {
  async getDepartments(req: Request, res: Response) {
    const data = await departmentCollection.find().sort({ name: 1 }).toArray();
    res.json(data);
  }

  async postCompany(req: Request, res: Response) {
    const body = req.body as CompanyPostType;

    const exist = await departmentCollection.findOne({ code: body.code });

    if (exist) {
      throw new CustomError("Đã tồn tại mã công ty này", 500);
    }

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
