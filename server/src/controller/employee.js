const { mysqlPool } = require("../database/mysql");

exports.getStaffWithSchedule = async (req, res) => {
  try {
    // Query to fetch staff details
    const [staff] = await mysqlPool.query(`
      SELECT staff_id AS id, name, email, phone_number, role 
      FROM Staff
    `);

    // Query to fetch schedules
    const [schedules] = await mysqlPool.query(`
      SELECT schedule_id AS id, staff_id, shift_start, shift_end 
      FROM Staff_Schedule
    `);

    // Combine staff and their schedules
    const staffWithSchedules = staff.map((staffMember) => {
      const memberSchedule = schedules.filter(
        (schedule) => schedule.staff_id === staffMember.id
      );
      return { ...staffMember, schedule: memberSchedule };
    });

    res.status(200).json(staffWithSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching staff and schedules' });
  }
};
