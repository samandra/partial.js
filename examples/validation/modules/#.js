var utils = require('partial.js/utils');

// Global validation
// this delegate replace framework.onValidation
exports.onValidation = function(name, value) {
	switch (name) {
		case 'Email':
			return utils.isEmail(value);
		case 'Age':
			return utils.isValid(utils.parseInt(value) > 0, 'Fill fucking age');
		case 'Terms':
			return value === '1';
		case 'FirstName':
		case 'LastName':
			return value.length > 0;
	};
};