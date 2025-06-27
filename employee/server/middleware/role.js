// Role-based access control middleware
module.exports = {
  requireManager: (req, res, next) => {
    if (req.user && req.user.role === 'manager') return next()
    return res.status(403).json({ error: 'Manager access required.' })
  },
  requireEmployee: (req, res, next) => {
    if (req.user && req.user.role === 'employee') return next()
    return res.status(403).json({ error: 'Employee access required.' })
  },
  requireManagerOrEmployee: (req, res, next) => {
    if (
      req.user &&
      (req.user.role === 'manager' || req.user.role === 'employee')
    )
      return next()
    return res.status(403).json({ error: 'Access denied.' })
  },
}
