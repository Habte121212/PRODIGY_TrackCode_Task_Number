// gmail verify
const prisma = require('../prismaClient')
module.exports = {
  async verifyEmail(req, res) {
    // Extract token
    const { token } = req.query

    // check token is exist
    if (!token) return res.status(400).json({ error: 'Token required.' })
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    })

    // check token is valid or expired
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }
    // update user email verified
    await prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    })

    // delete token
    await prisma.emailVerificationToken.delete({ where: { token } })

    // redirect to login
    return res.redirect(process.env.REDIRECT_LOGIN)
  },
}
