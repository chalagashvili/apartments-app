exports.successResponse = (res, msg) => {
  const data = {
    ok: 1,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = (res, msg, data) => {
  const resData = {
    ok: 1,
    message: msg,
    payload: data,
  };
  return res.status(200).json(resData);
};

exports.errorResponse = (res, msg) => {
  const data = {
    ok: 0,
    error: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = (res, msg) => {
  const data = {
    ok: 0,
    error: msg,
  };
  return res.status(404).json(data);
};

exports.validationError = (res, msg) => {
  const resData = {
    ok: 0,
    error: msg,
  };
  return res.status(422).json(resData);
};

exports.validationErrorWithData = (res, msg, data) => {
  const resData = {
    ok: 0,
    error: msg,
    payload: data,
  };
  return res.status(422).json(resData);
};

exports.unauthorizedResponse = (res, msg) => {
  const data = {
    ok: 0,
    error: msg,
  };
  return res.status(403).json(data);
};
