import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    clockInClockOutControllers,
    listClockInClockOutTimesControllers,
    listSubAdminAttendanceSheetControllers,
} from './attendance.controllers';
import {
    clockInClockOutValidators,
    listSubAdminAttendanceSheetValidators,
} from './attendance.validators';

const router = express.Router();

router.post(
    '/admin/attendance/clockin/clockout',
    clockInClockOutValidators,
    isAdmin('Attendance', 'A'),
    clockInClockOutControllers,
);

router.get(
    '/admin/list/attendance/records',
    isAdmin('Attendance', 'V'),
    listClockInClockOutTimesControllers,
);

router.post(
    '/admin/list/sub/admin/attendance',
    listSubAdminAttendanceSheetValidators,
    isAdmin('Attendance', 'V'),
    listSubAdminAttendanceSheetControllers,
);

export default router;
