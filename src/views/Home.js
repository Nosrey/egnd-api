import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from 'services/Requests'
import { setUser } from 'store/auth/userSlice'

function Home() {
  const [currencyInfo, setCurrencyInfo] = useState()
  const dispatch = useDispatch()
  const currentState = useSelector((state) => state.auth.user)

  useEffect(() => {
    getUser()
      .then((data) => {
        setCurrencyInfo(data?.businessInfo[0]?.currency)
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    if (currencyInfo) {
      const newState = {
        ...currentState,
        currency: currencyInfo,
      }
      dispatch(setUser(newState))
    }
  }, [currencyInfo])

  return <div>Home</div>
}

export default Home
