import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Load from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../Utils/api'

const Avatar = () => {
  const navigate = useNavigate()

  const [loader, setLoader] = useState(true)
  const [avatars, setAvatars] = useState([])
  const [selectedAvatars, setSelectedAvatars] = useState(undefined)

  const toastOption = {
    position: 'bottom-right',
    autoClose: 8000,
    theme: "dark"
  }

  // 🔹 Check login
  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login')
    }
  }, [navigate])

  // 🔹 Set avatar
  const setProfilePicture = async () => {
    try {
      if (selectedAvatars === undefined) {
        return toast.error("Select an avatar first", toastOption)
      }

      const local = JSON.parse(localStorage.getItem('chat-app-user'))

      const headers = {
        Authorization: `Bearer ${local.token}`,
      }

      const { data } = await api.put(
        `users/avatar/${local._id}`,
        {
          isAvatarImage: true,
          AvatarImage: avatars[selectedAvatars]
        },
        { headers }
      )

      if (!data.status) {
        toast.error(data.message, toastOption)
      } else {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        navigate('/')
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  // 🔹 Load avatars (FIXED)
  useEffect(() => {
    const get = async () => {
      try {
        let data = []

        for (let i = 0; i < 4; i++) {
          data.push(`https://api.dicebear.com/7.x/bottts/svg?seed=${Math.floor(Math.random() * 1000)}`)
        }

        setAvatars(data)

      } catch (error) {
        console.log(error.message)
      } finally {
        setLoader(false)
      }
    }

    get()
  }, [])

  return (
    <>
      {loader ? (
        <Container>
          <img src={Load} alt="loading" />
        </Container>
      ) : (
        <Container>
          <h1>Choose an Avatar for Profile Picture</h1>

          <div className="avatars">
            {avatars.map((item, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatars === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatars(index)}
              >
                <img src={item} alt="avatar" />
              </div>
            ))}
          </div>

          <button onClick={setProfilePicture}>
            Set Profile Picture
          </button>
        </Container>
      )}

      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:5rem;
  align-items:center;
  background-color:#0e0e1a;
  color:white;

  .avatars{
    display:flex;
    gap:20px;
  }

  .avatar{
    width:6rem;
    border:5px solid transparent;
    border-radius:50%;
    cursor:pointer;

    img{
      width:100%;
    }
  }

  .selected{
    border:5px solid blue;
  }

  button{
    padding:0.7rem 3rem;
    border-radius:0.4rem;
    font-size:1rem;
    background-color:#9d429d;
    color:white;
    cursor:pointer;
  }
`

export default Avatar