exports.badRequestHandler = (res, message, data = {}) => {
	console.log(message);

	res.status(400);

	data.message = message;

	return res.json(data);
};

exports.serverErrorHandler = (res, message, error, data = {}) => {
	console.log(error);

	res.status(500);

	data.message = message;
	data.error = error;

	return res.json(data);
};

exports.forbiddenClientHandler = (res, message, error) => {
	const data = {
		success: false,
		message
	};

	console.log(message);

	res.status(403);

	if (error) {
		data.error = error;
	}

	return res.json(data);
};
