const nodemailer = require('nodemailer')
const prisma = require('../prismaClient')
const crypto = require('crypto')

//send verification email
async function sendVerificationEmail(user, req) {
  // generate token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      // create transporter
  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })
     //send email
  const verifyUrl = `http://localhost:8600/server/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'verify you email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify you email.</p>`,
  })
}

module.exports = { sendVerificationEmail }
