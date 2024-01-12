import React, { useEffect } from "react"
import "./create.css"
import { IoIosAddCircleOutline } from "react-icons/io"
import { useState } from "react"
import { useContext } from "react"
import { Context } from "../../context/Context"
import axios from "axios"
import { useLocation } from "react-router-dom"

export const Create = () => {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(Context)

  const handleSubmit = async (e) => {
    console.log("aafhdsukgfsudkfhkusdf")
    e.preventDefault()

    console.log('Handle Submit was called ...');

    const newPost = {
      username: user.username,
      title,
      desc,
      file,
    }

    console.log("ccccccccccccccccccc");

    if (file) {

      console.log("file : ", file);

      let data = new FormData()
      const filename = file.name

      console.log(filename)

      data.append("name", filename)
      data.append("file", file)

      newPost.photo = filename

      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      console.log("upload data: ", data)

      for (var key of data.entries()) {
        console.log(key[0] + ', ' + key[1]);
      }

      try {
        await axios.post("http://localhost:5000/upload", data)
      } catch (error) {
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        console.log(error)
      }
    }
    try {
      const res = await axios.post("/posts", newPost)
      window.location.replace("/post/" + res.data._id)
    } catch (error) {
      console.log("shitttttttttttttttttttttttt")
      console.log(error)
    }
  }

  return (
    <>
      <section className='newPost'>
        <div className='container boxItems'>
          <div className='img '>{file && <img src={URL.createObjectURL(file)} alt='images' />}</div>
          <form onSubmit={handleSubmit}>
            <div className='inputfile flexCenter'>
              <label htmlFor='inputfile'>
                <IoIosAddCircleOutline />
              </label>
              <input type='file' id='inputfile' name="filename" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <input type='text' placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
            <textarea name='' id='' cols='30' rows='10' onChange={(e) => {setDesc(e.target.value); console.log(e.target.value)}}></textarea>
            <button type="submit" className='button'>Create Post</button>
            {/* <input type="submit" value="Submit" className="button"> Create Post </input> */}
          </form>
        </div>
      </section>
    </>
  )
}
