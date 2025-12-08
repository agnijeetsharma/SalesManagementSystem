import { searchSales } from "../services/salesService.js";
import { StatusCodes } from "http-status-codes";

const toArray = (v) => (v ? v.split(",") : []);

export async function getSales(req, res, next) {
  try {
    const params = {
      q: req.query.q,
      customerRegions: req.query.customerRegions,
      genders: req.query.genders,
      ageMin: req.query.ageMin,
      ageMax: req.query.ageMax,
      productCategories: req.query.productCategories,
      tags: req.query.tags,
      paymentMethods: req.query.paymentMethods,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy,
      sortDir: req.query.sortDir,
      page: req.query.page,
      pageSize: req.query.pageSize,
    };

    const result = await searchSales(params);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
}
