export default (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { stripUnknown: true, convert: true });
  if (error) {
    error.status = 400;
    return next(error);
  }
  
  req[property] = value;
  next();
};
