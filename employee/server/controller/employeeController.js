const prisma = require('../prismaClient')

// Employee: See all employees
async function getEmployees(req, res) {
  const employees = await prisma.user.findMany({ where: { role: 'employee' } })
  res.json({ employees })
}

module.exports = { getEmployees }
