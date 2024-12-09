import React, { useEffect, useState,useRef } from 'react'
import styled from "styled-components"
import { Authorization, EditFullRoute, EditPartialRoute } from '../apiRoute'

export default function Profile({}) {
  const token = localStorage.getItem('Auth')
  const ImageRef=useRef()
  const [EditField,setEditField]=useState({
    Username:"",
    Useremail:"",
    UploadImage:""
  })
  const [Edit,setEdit]=useState(false)
  const [ImageButtonName,setImageButtonName]=useState("Please Select Profile Pic")
  const [UserData,setUserData] =useState(JSON.parse(localStorage.getItem('UserData')))
  useEffect(()=>{
    async function verifyUser() {
      try{
        const response = await fetch(Authorization,{
          method:"GET",
          headers:{
            'Content-Type': 'application/json',
            "Authorization":`${token}`
        },
        })
        if(!response.ok){            
          throw new Error('Network response was not ok')
      }
      const result =await response.json()
      console.log(result)

      if(!result.status){
        console.log(token)
        localStorage.removeItem("Auth");
      }
      }catch(err){
        console.log(err)
      }
    }
    verifyUser()
  },[])
  const EditValidation=()=>{
  if(EditField.Username===UserData.Username){
    setError({ err: 'Perivious and New Username are same', check: true });
    return false
  }
  else if (SignupData.Email && !emailRegex.test(SignupData.Email)) {
      setError({ err: 'Invalid Email', check: true });
      return false;
  }
  return true
  }
  const EditHandler=(e)=>{
    var username= /^[a-zA-Z]+$/
    if (e.target.name === "UploadImage") {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            const base64String = reader.result;
            setEditField({ ...EditField, UploadImage: base64String });
            setImageButtonName(file.name)
        };
        reader.readAsDataURL(file)
    }
      else if(e.target.name==="Username"){
        if(username.test(e.target.value)){
            setEditField({ ...EditField, [e.target.name]: e.target.value })
        }
      }else{
        setEditField({ ...EditField, [e.target.name]: e.target.value })
      }
  }
  const TakeImage=(e)=>{
    e.preventDefault()
    ImageRef.current.click()
}
  const EditChange=()=>{
    setEdit(true)
  }  
  const ChangeReset=()=>{
    setEdit(false)
    setEditField({
      Username:"",
      Useremail:"",
      UploadImage:""
    })
  }
  const EditSave=async()=>{
    try{
      if(EditValidation()){
      let response;
      if(EditField.UploadImage&&EditField.Useremail&&EditField.Username){
        response = await fetch(EditFullRoute,{
          method:"PUT",
          headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Id:UserData.Id,useremail:EditField.Useremail,username:EditField.Username,UserPic:EditField.UploadImage})
        })
      }else{
      response = await fetch(EditPartialRoute,{
        method:"PATCH",
        headers:{
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({Id:UserData.Id,useremail:EditField.Useremail,username:EditField.Username,UserPic:EditField.UploadImage})
      })
    }
      if(!response.ok){            
        throw new Error('Network response was not ok')
    }   
    const result = await response.json()
    if(result.status){
      UserData.UploadImage=result.data.UserPic
      UserData.Username=result.data.name
      UserData.Email=result.data.email
      localStorage.setItem('UserData', JSON.stringify({Id:result.data._id,Username:result.data.name,Email:result.data.email,UploadImage:result.data.UserPic}));
      localStorage.setItem('Auth',result.data.tokens[0].token)
      
      setEditField({
        Username:"",
        Useremail:"",
        UploadImage:""
      })
      setEdit(false)
    }
  }
  }catch(err){
      console.log(err)
    }
  }
  return (
    <Container>
      <div className="Container">
        <div className="userPic">
        <img src={EditField.UploadImage||UserData.UploadImage} width="250px" alt="" />
        <div className="imgbutton">{Edit&&
        <><input type="file" ref={ImageRef} className='file' onChange={(e)=>{EditHandler(e)}} name="UploadImage" />
        <input type="button" className='ImageUploadbutton'  onClick={(e)=>{TakeImage(e)}} value={ImageButtonName} />
        </>}</div>
        </div>
        <div className="userDetails">
        <div className="inputtext">
          <input type="text" className={Edit?'edit':"showdata"} onChange={(e)=>{EditHandler(e)}} disabled={Edit?false:true} name="Username" placeholder={`Name: ${UserData.Username}`} value={EditField.Username}/>
          </div>
          <div className="inputtext">
          <input type="text" className={Edit?'edit':"showdata"} disabled={Edit?false:true} onChange={(e)=>{EditHandler(e)}} name='Useremail' placeholder={`Email-Id: ${UserData.Email}`} value={EditField.Useremail}/>
          </div>
          <div className={Edit?"button":"button-change"}>
          {Edit?
          <>
          <input type="button" className='Edit' onClick={()=>{EditSave()}} value="Save" />
          <input type="button" className='Edit' value="Cancle" onClick={()=>{ChangeReset()}}/>
          </>
          :<input type="button" onClick={()=>{EditChange()}} className='Edit' value="Edit" />}
          </div>
        </div>
      </div>
    </Container>
  )
}
const Container=styled.div`
.Container{
    height: 76vh;
    width: 34vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    border-radius: 5px;
    position: relative;
}
.userPic img{
   height: 40vh;
    width: 31vw;
    position: absolute;
    top: 30px;
    padding: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
    border-top: 1px solid rgba(255, 255, 255, .3);
    border-left: 1px solid rgba(255, 255, 255, .3);
    right: 22px;
    border-radius: 13px;
    background: #797272;
}
.userDetails{
    height: 24vh;
    width: 31vw;
    position: absolute;
    bottom:20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}
.Edit{
   width: 7vw;
    background-color: #5699ff;
    font-size: 24px;
    font-weight: 50;
    border: 3px solid #b3b7ff;
    cursor: pointer;
    border-radius: 10px;
    color: #e9c2c2;
}
.Edit:hover{
    background-color: #2f6ac3;
    font-size: 28px;
    border: 3px solid #1b22ab;
    color: #e9c2c2;
}
.button{
    height: 7vh;
    width: 19vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.button-change{
    height: 7vh;
    width: 8vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.inputtext{
    // border: 2px solid;
    width: 19vw;
    height: 6vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.showdata{
   height: 4vh;
    width: 18vw;
    border: none;
    border-bottom: 2px solid;
    outline: none;
    background: aliceblue;
    color: #797272;
    font-weight: 700;
    font-size: 15px;
    }
    .imgbutton{
    bottom: 186px;
    right: 77px;
    position: absolute;
    width: 24vw;
    text-align: center;
    height: 6vh;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .file{
    display:none;
    }
    .ImageUploadbutton{
    width: 13vw;
    height: 4vh;
    background-color: #cae0ff;
    font-size: 16px;
    color: #716565;
    font-weight: 50;
    border: none;
    cursor: pointer;
    box-shadow: none;
    border-radius: 6px;
    }
    .ImageUploadbutton:hover{
        font-size: 18px;
    }
    .edit{
    border-radius: 50px;
    background: #e0e0e0;
    box-shadow:  20px 20px 60px #bebebe,
             -20px -20px 60px #ffffff;
    height: 4vh;
    width: 18vw;
    border: none;
    outline: none;
    background: #aac9e5;
    color: #797272;
    font-weight: 700;
    font-size: 15px;
    border-radius: 8px;
    padding-left: 5px;
    }
`
