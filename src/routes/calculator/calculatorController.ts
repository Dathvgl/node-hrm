import { Request, Response } from "express";
import { fieldLookup, timesheetCollection } from "models/mongo";
import { ListResult } from "types/base";
import {
  CalculatorSalaryAggregateType,
  CalculatorSalaryContract,
  CalculatorSalaryProduct,
  CalculatorSalaryRevenue,
  CalculatorSalaryType,
} from "types/calculator";
import { SalaryTypeType } from "types/salary";
import { dayOfWeek } from "utils/date";

type SalaryTypeCalcProps = {
  type: SalaryTypeType;
  base: number;
  days: number[];
  month: number;
  year: number;
  allowance?: number;
  revenues?: CalculatorSalaryRevenue[];
  contracts?: CalculatorSalaryContract[];
  products?: CalculatorSalaryProduct[];
};

function salaryTypeCalculator({
  type,
  base,
  allowance,
  days,
  month,
  year,
  revenues,
  contracts,
  products,
}: SalaryTypeCalcProps) {
  const saturdays = dayOfWeek(year, month, 6);
  const sundays = dayOfWeek(year, month, 0);
  const dates = new Date(year, month, 0).getDate() - saturdays - sundays;

  switch (type) {
    case "contract": {
      if (!contracts) return base + (allowance ?? 0);

      let sum = base + (allowance ?? 0);
      const { length: lengthArray } = contracts;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = contracts[index];

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { base, percentage } = salaries[index];
          sum += (base * percentage) / 100;
        }
      }

      return Math.ceil(sum / 1000) * 1000;
    }
    case "product": {
      if (!products) return base + (allowance ?? 0);

      let sum = base + (allowance ?? 0);
      const { length: lengthArray } = products;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = products[index];

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { base, quantity } = salaries[index];
          sum += base * quantity;
        }
      }

      return Math.ceil(sum / 1000) * 1000;
    }
    case "revenue": {
      if (!revenues) return base + (allowance ?? 0);

      let sum = base + (allowance ?? 0);
      const { length: lengthArray } = revenues;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = revenues[index];

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { revenue, percentage } = salaries[index];
          sum += (revenue * percentage) / 100;
        }
      }

      return Math.ceil(sum / 1000) * 1000;
    }
    case "time":
    default:
      return (
        Math.ceil((((base + (allowance ?? 0)) / dates) * days.length) / 1000) *
        1000
      );
  }
}

export default class calculatorController {
  async getCalculatorSalary(req: Request, res: Response) {
    const query = req.query as {
      month?: string;
      year?: string;
      page?: string;
      limit?: string;
    };

    const today = new Date();
    const month = Number.parseInt(query.month ?? `${today.getMonth() + 1}`);
    const year = Number.parseInt(query.year ?? `${today.getFullYear()}`);

    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const data = await timesheetCollection
      .aggregate<ListResult<CalculatorSalaryAggregateType>>([
        {
          $facet: {
            data: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $match: { month, year } },
              { $project: { _id: 0, personnel: 1, days: 1 } },
              {
                $lookup: {
                  from: "personnel",
                  localField: "personnel",
                  foreignField: "id",
                  as: "personnel",
                },
              },
              {
                $addFields: {
                  stt: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.id",
                    },
                  },
                },
              },
              {
                $addFields: {
                  stt: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.stt",
                    },
                  },
                },
              },
              {
                $addFields: {
                  name: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.name",
                    },
                  },
                },
              },
              {
                $addFields: {
                  position: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.position",
                    },
                  },
                },
              },
              {
                $addFields: {
                  department: {
                    $let: {
                      vars: { props: { $first: "$personnel" } },
                      in: "$$props.department",
                    },
                  },
                },
              },
              ...fieldLookup({
                document: "department",
                as: "salaryType",
                inField: "salary",
                project: { $project: { _id: 0, salary: 1 } },
              }),
              ...fieldLookup({
                document: "salary",
                field: "salaryType",
                as: "salaryTypeCalc",
                inField: "type",
                project: { $project: { _id: 0, type: 1 } },
              }),
              ...fieldLookup({
                document: "salary",
                field: "salaryType",
                as: "salaryType",
                inField: "name",
                project: { $project: { _id: 0, name: 1 } },
              }),
              ...fieldLookup({
                document: "department",
                inField: "name",
                project: { $project: { _id: 0, name: 1 } },
              }),
              ...fieldLookup({
                document: "position",
                as: "salaryBase",
                inField: "salary",
                project: { $project: { _id: 0, salary: 1 } },
              }),
              ...fieldLookup({
                document: "position",
                as: "salaryAllowance",
                inField: "allowance",
                project: { $project: { _id: 0, allowance: 1 } },
              }),
              ...fieldLookup({
                document: "position",
                inField: "name",
                project: { $project: { _id: 0, name: 1 } },
              }),
              {
                $lookup: {
                  from: "salaryRevenue",
                  localField: "id",
                  foreignField: "personnel",
                  pipeline: [
                    { $match: { year, month } },
                    { $project: { _id: 0, salaries: 1 } },
                  ],
                  as: "revenues",
                },
              },
              {
                $lookup: {
                  from: "salaryContract",
                  localField: "id",
                  foreignField: "personnel",
                  pipeline: [
                    { $match: { year, month } },
                    { $project: { _id: 0, salaries: 1 } },
                  ],
                  as: "contracts",
                },
              },
              {
                $lookup: {
                  from: "salaryProduct",
                  localField: "id",
                  foreignField: "personnel",
                  pipeline: [
                    { $match: { year, month } },
                    { $project: { _id: 0, salaries: 1 } },
                  ],
                  as: "products",
                },
              },
              { $project: { personnel: 0 } },
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

    if (data) {
      const { data: array, ...rest } = data;

      const list: ListResult<CalculatorSalaryType> = {
        ...rest,
        data: [],
      };

      const { length } = array;
      for (let index = 0; index < length; index++) {
        const { days, salaryTypeCalc, ...rest } = array[index];

        list.data.push({
          ...rest,
          salaryCalc: salaryTypeCalculator({
            type: salaryTypeCalc,
            base: rest.salaryBase,
            allowance: rest.salaryAllowance,
            days,
            month,
            year,
          }),
          salaryBonus: 0,
        });
      }
      res.json(list);
    } else {
      res.json(null);
    }
  }
}
