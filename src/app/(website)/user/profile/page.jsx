import SubBanner from '@/components/Main/SubBanner'
import UserProfileDashboard from '@/components/Main/UserProfileDashboard'
import React from 'react'

const UserAccountPage = () => {
  return (
    <section>
      <div>
        <SubBanner title={"Your Profile"} pageName={"Profile"} />
      </div>
      <div className="container">
        <div>
          <UserProfileDashboard />
        </div>
      </div>
    </section>
  )
}

export default UserAccountPage
