import { body } from 'express-validator';

export const clockInClockOutValidators = [
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .bail()
        .isString()
        .withMessage('Location must be a valid string'),
];

export const listSubAdminAttendanceSheetValidators = [
    body('start')
        .notEmpty()
        .withMessage('Datatable offset is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid offset value'),

    body('length')
        .notEmpty()
        .withMessage('Datatable limit is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid limit value'),

    body('draw')
        .notEmpty()
        .withMessage('Datatable draw is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid draw value'),

    body('search')
        .notEmpty()
        .notEmpty()
        .withMessage('Search is required')
        .bail()
        .isObject()
        .withMessage('Search must be an object')
        .bail()
        .custom((value) => value.hasOwnProperty('value'))
        .withMessage('Search object must contain a value key'),

    body('columns')
        .notEmpty()
        .withMessage('Columns is required')
        .bail()
        .isArray()
        .withMessage('Columns must contain an array')
        .bail()
        .custom((value) => value[0].hasOwnProperty('data'))
        .withMessage('Column array must conatin object wiht data key'),

    body('order')
        .notEmpty()
        .withMessage('Order key is required')
        .bail()
        .isArray()
        .withMessage('Order key must contain an array')
        .bail()
        .custom((value) => {
            const [firstOrder] = value;
            return (
                firstOrder.hasOwnProperty('column') &&
                firstOrder.hasOwnProperty('dir')
            );
        })
        .withMessage('Order arrat must contain object with column and dir key'),
];
