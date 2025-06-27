const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const Joi = require('joi')

// Get all employees
async function getEmployees(req, res) {
  const employees = await prisma.user.findMany({ where: { role: 'employee' } })
  res.json({ employees })
}

// Add employee
async function addEmployee(req, res) {
  // Validate input
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).required(),
    department: Joi.string().min(2).max(100).required(),
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })
  const { email, name, password, department } = req.body

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser)
    return res.status(409).json({ error: 'User already exists' })

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create employee
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      department,
      role: 'employee',
    },
  })
  res.status(201).json({ message: 'Employee added.' })
}

//  Edit employee
async function editEmployee(req, res) {
  const { id } = req.params
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    department: Joi.string().min(2).max(100),
  })
  const { error } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })
  const { name, department } = req.body
  await prisma.user.update({
    where: { id: Number(id), role: 'employee' },
    data: { name, department },
  })
  res.json({ message: 'Employee updated.' })
}

//Delete employee
async function deleteEmployee(req, res) {
  const { id } = req.params
  await prisma.user.delete({ where: { id: Number(id), role: 'employee' } })
  res.json({ message: 'Employee deleted.' })
}

module.exports = { getEmployees, addEmployee, editEmployee, deleteEmployee }
