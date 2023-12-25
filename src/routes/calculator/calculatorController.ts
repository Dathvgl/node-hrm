import { Request, Response } from "express";
import { fieldLookup, timesheetCollection } from "models/mongo";
import { ListResult } from "types/base";
import {
  CalculatorSalaryAggregateType,
  CalculatorSalaryType,
} from "types/calculator";
import { dayOfWeek } from "utils/date";

type SalaryTypeCalcProps = CalculatorSalaryAggregateType & {
  month: number;
  year: number;
};

function salaryTypeCalculator({
  year,
  month,
  days,
  salaryType,
  revenues,
  contracts,
  products,
  salaryAllowance = 0,
  salaryBase,
  salaryTypeCalc,
  vacations,
  ...rest
}: SalaryTypeCalcProps): CalculatorSalaryType {
  const saturdays = dayOfWeek(year, month, 6);
  const sundays = dayOfWeek(year, month, 0);
  const dates = new Date(year, month, 0).getDate() - saturdays - sundays;

  switch (salaryTypeCalc) {
    case "contract": {
      const list: { base: number; percentage: number }[] = [];

      if (!contracts) {
        return {
          ...rest,
          vacations,
          salaryBase,
          salaryType: "contract",
          salaryTypeName: salaryType,
          info: { salaries: list },
          salaryAllowance,
          salaryCalc: salaryBase + salaryAllowance,
        };
      }

      let sum = salaryBase + salaryAllowance;
      const { length: lengthArray } = contracts;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = contracts[index];
        list.push(...salaries);

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { base, percentage } = salaries[index];
          sum += (base * percentage) / 100;
        }
      }

      return {
        ...rest,
        vacations,
        salaryBase,
        salaryType: "contract",
        salaryTypeName: salaryType,
        info: { salaries: list },
        salaryAllowance,
        salaryCalc: Math.ceil(sum / 1000) * 1000,
      };
    }
    case "product": {
      const list: { base: number; quantity: number }[] = [];

      if (!products) {
        return {
          ...rest,
          vacations,
          salaryBase,
          salaryType: "product",
          salaryTypeName: salaryType,
          info: { salaries: list },
          salaryAllowance,
          salaryCalc: salaryBase + salaryAllowance,
        };
      }

      let sum = salaryBase + salaryAllowance;
      const { length: lengthArray } = products;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = products[index];
        list.push(...salaries);

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { base, quantity } = salaries[index];
          sum += base * quantity;
        }
      }

      return {
        ...rest,
        vacations,
        salaryBase,
        salaryType: "product",
        salaryTypeName: salaryType,
        info: { salaries: list },
        salaryAllowance,
        salaryCalc: Math.ceil(sum / 1000) * 1000,
      };
    }
    case "revenue": {
      const list: { revenue: number; percentage: number }[] = [];

      if (!revenues) {
        return {
          ...rest,
          vacations,
          salaryBase,
          salaryType: "revenue",
          salaryTypeName: salaryType,
          info: { salaries: list },
          salaryAllowance,
          salaryCalc: salaryBase + salaryAllowance,
        };
      }

      let sum = salaryBase + salaryAllowance;
      const { length: lengthArray } = revenues;
      for (let index = 0; index < lengthArray; index++) {
        const { salaries } = revenues[index];
        list.push(...salaries);

        const { length: lengthList } = salaries;
        for (let index = 0; index < lengthList; index++) {
          const { revenue, percentage } = salaries[index];
          sum += (revenue * percentage) / 100;
        }
      }

      return {
        ...rest,
        vacations,
        salaryBase,
        salaryType: "revenue",
        salaryTypeName: salaryType,
        info: { salaries: list },
        salaryAllowance,
        salaryCalc: Math.ceil(sum / 1000) * 1000,
      };
    }
    case "time":
    default: {
      return {
        ...rest,
        vacations,
        salaryBase,
        salaryType: "time",
        salaryTypeName: salaryType,
        info: { days },
        salaryAllowance,
        salaryCalc:
          Math.ceil(
            (((salaryBase + salaryAllowance) / dates) *
              (days.length + (vacations?.length ?? 0))) /
              1000
          ) * 1000,
      };
    }
  }
}

export default class calculatorController {
  async getCalculatorSalary(req: Request, res: Response) {
    const query = req.query as {
      month?: string;
      year?: string;
      page?: string;
      limit?: string;
      department?: string;
    };

    const today = new Date();
    const month = Number.parseInt(query.month ?? `${today.getMonth() + 1}`);
    const year = Number.parseInt(query.year ?? `${today.getFullYear()}`);

    const page: number = Number.parseInt(query.page ?? "1");
    const limit: number = Number.parseInt(query.limit ?? "10");

    const departmentHandle = () => {
      const list: any[] = [
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
      ];

      if (query.department && query.department != "all") {
        list.push({
          $match: { department: query.department },
        });
      }

      return list;
    };

    const data = await timesheetCollection
      .aggregate<ListResult<CalculatorSalaryAggregateType>>([
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
            id: {
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
        ...departmentHandle(),
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
        {
          $lookup: {
            from: "vacation",
            localField: "id",
            foreignField: "personnel",
            pipeline: [
              { $match: { status: "accept" } },
              { $project: { _id: 0, offDays: 1 } },
              {
                $match: {
                  offDays: {
                    $regex: `${month < 10 ? `0${month}` : month}/${year}`,
                  },
                },
              },
            ],
            as: "vacations",
          },
        },
        {
          $addFields: {
            vacations: {
              $let: {
                vars: { props: { $first: "$vacations" } },
                in: "$$props.offDays",
              },
            },
          },
        },
        {
          $facet: {
            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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
        list.data.push(salaryTypeCalculator({ ...array[index], month, year }));
      }

      res.json(list);
    } else {
      res.json(null);
    }
  }
}
