
import Joi from 'joi';

const listOrString = Joi.alternatives().try(
  Joi.array().items(Joi.string().trim()).min(1),
  Joi.string().allow('', null)
).optional();

export default Joi.object({
  q: Joi.string().allow('', null),
  customerRegions: listOrString,
  genders: listOrString,
  ageMin: Joi.number().integer().min(0).optional().allow(null, ''),
  ageMax: Joi.number().integer().min(0).optional().allow(null, ''),
  productCategories: listOrString,
  tags: listOrString,
  paymentMethods: listOrString,
  dateFrom: Joi.date().iso().optional().allow(null, ''),
  dateTo: Joi.date().iso().optional().allow(null, ''),
  sortBy: Joi.string().valid('date','quantity','customerName','relevance').default('date'),
  sortDir: Joi.string().valid('asc','desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10)
});
