import React from 'react'
import './restPassword.scss'

const RestPassword = () => {
  return (
    <div className="resetPassword">
      <div className="resetContainer">
        <h2>Reset Password</h2>
        <form>
          <div className="inputForm">
            <label>
              <input
                type="password"
                name="password"
                placeholder="New password"
                className="resetInput"
                aria-label="New password"
              />
            </label>
          </div>
          <div className="inputForm">
            <label>
              <input
                type="password"
                placeholder="Confrim Password"
                className="resetInput"
                aria-label="Confirm Password"
              />
            </label>
          </div>
          <button type="submit">Rest Password</button>
        </form>
      </div>
    </div>
  )
}

export default RestPassword
