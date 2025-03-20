import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/PageLoadingSpinner/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis/index'

function AccountVerification() {
  const [searchParams] = useSearchParams()
  //cách 1 lấy từng query para từ url ra ,nếu nhiều sẽ lâu
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  //cách 2 lấy nhiều query para một lúc
  const { email, token } = Object.fromEntries(searchParams)
  const [verified, setVerified] = useState(false)

  //Gọi API xác thực tài khoản
  useEffect(() => {
    if ( email && token)
      verifyUserAPI({ email, token }).then(() => setVerified(true))
  }, [email, token])


  //Nếu ko tồn tại một trong hai token hoặc email đá về 404
  if ( !email || !token )
    return <Navigate to="/404" />

  //Nếu đang trong quá trình xác thực thì chỉ hiện thị loading verified
  if ( !verified )
    return <PageLoadingSpinner content="Verifying your account..."/>

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification