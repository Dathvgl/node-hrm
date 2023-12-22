import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { authFB } from "models/firebase/firebaseConfig";
import { personnelCollection } from "models/mongo";
import { ObjectId } from "mongodb";
import { BaseMongo } from "types/mongo";
import {
  PersonnelCurrentType,
  PersonnelPostType,
  PersonnelType,
} from "types/personnel";
import { momentNowTS } from "utils/date";

export default class PersonnelController {
  async getPersonnels(req: Request, res: Response) {
    const query = req.query as {
      type?: string;
      page?: string;
      limit?: string;
      company?: string;
      name?: string;
      phone?: string;
      position?: string;
    };

    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    await personnelCollection.createIndex({ name: "text" });

    const handleProject = () => {
      if (query.type) {
        switch (query.type) {
          case "company":
            return [{ $project: { _id: 1, name: 1, email: 1 } }];
          case "role":
            return [{ $project: { _id: 1, name: 1, roles: 1 } }];
          case "management":
          default:
            return [{ $project: { roles: 0 } }];
        }
      } else return [{ $project: { roles: 0 } }];
    };

    const aggregate: any[] = [
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            ...handleProject(),
            { $addFields: { id: { $toObjectId: "$_id" } } },
            { $project: { _id: 0 } },
          ],
          totalPage: [{ $count: "total" }],
        },
      },
      { $addFields: { currentPage: page } },
      {
        $project: {
          totalData: { $size: "$data" },
          totalPage: {
            $let: {
              vars: { props: { $first: "$totalPage" } },
              in: "$$props.total",
            },
          },
          currentPage: 1,
          canPrev: { $not: { $eq: ["$currentPage", 1] } },
          data: 1,
        },
      },
      {
        $addFields: {
          totalPage: { $ceil: { $divide: ["$totalPage", limit] } },
        },
      },
      {
        $addFields: {
          canNext: {
            $and: [
              { $not: { $eq: ["$currentPage", "$totalPage"] } },
              { $not: { $eq: [null, "$totalPage"] } },
            ],
          },
        },
      },
    ];

    if (query.company && query.company != "all") {
      aggregate.unshift({ $match: { company: query.company } });
    }

    if (query.name) {
      aggregate.unshift({ $match: { $text: { $search: query.name } } });
    }

    if (query.phone) {
      aggregate.unshift({ $match: { phone: query.phone } });
    }

    if (query.position) {
      aggregate.unshift({ $match: { position: query.position } });
    }

    aggregate.unshift({ $sort: { createdAt: -1 } });

    const data = await personnelCollection.aggregate(aggregate).next();

    res.json(data);
  }

  async getPersonnelCurrent(req: Request, res: Response) {
    const { id } = req.params;

    const data = await personnelCollection.findOne<
      Omit<PersonnelCurrentType, "id"> & { _id: string }
    >(
      {
        _id: new ObjectId(id),
      },
      { projection: { _id: 1, name: 1, email: 1, roles: 1 } }
    );

    if (!data) {
      throw new CustomError("Không tồn tại người này", 500);
    }

    const { _id, ...rest } = data;

    res.json({ ...rest, id: _id });
  }

  async postPersonnel(req: Request, res: Response) {
    const body = req.body as PersonnelPostType;

    const exist = await personnelCollection.findOne({ email: body.email });

    if (exist) {
      throw new CustomError("Đã tồn tại email này", 500);
    }

    const obj = {
      ...body,
      company: "",
      createdAt: momentNowTS(),
      updatedAt: momentNowTS(),
    };

    const stts = await personnelCollection
      .find<{ stt: number }>({}, { projection: { stt: 1 } })
      .sort({ stt: -1 })
      .limit(1)
      .toArray();

    const { uid } = await authFB.createUser({
      email: obj.email,
      password: "123456",
      phoneNumber: obj.phone,
      displayName: obj.name,
      emailVerified: false,
    });

    const { insertedId } = await personnelCollection.insertOne({
      ...obj,
      roles: [],
      stt: stts.length == 0 ? 10 : stts[0].stt + 1,
      _id: new ObjectId(uid),
    });

    res.json({ ...obj, id: insertedId });
  }

  async putPersonnelCompany(req: Request, res: Response) {
    const { id } = req.params;
    const { company } = req.body as { company: string };

    const data = (await personnelCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { company },
      { returnDocument: "after" }
    )) as (BaseMongo & Omit<PersonnelType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi update company", 500);
    } else {
      res.json({ id: data._id, name: data.name, email: data.email, company });
    }
  }

  async putPersonnelRoles(req: Request, res: Response) {
    const { id } = req.params;
    const { roles } = req.body as { roles: string[] };

    const data = (await personnelCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { roles },
      { returnDocument: "after" }
    )) as (BaseMongo & Omit<PersonnelType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi update company", 500);
    } else {
      res.json({ id: data._id, name: data.name, roles });
    }
  }

  async deletePersonnel(req: Request, res: Response) {
    const { id } = req.params;

    await authFB.deleteUser(id);

    const data = (await personnelCollection.findOneAndDelete({
      _id: new ObjectId(id),
    })) as (BaseMongo & Omit<PersonnelType, "id">) | null;

    if (!data) {
      throw new CustomError("Lỗi update company", 500);
    } else {
      res.json({ id: data._id, name: data.name, email: data.email });
    }
  }
}
