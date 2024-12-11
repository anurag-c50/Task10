import React, { useEffect, useState,useRef } from 'react'
import styled from "styled-components"
import { Authorization, EditFullRoute, EditPartialRoute, LogOut } from '../apiRoute'
import {useNavigate } from 'react-router-dom'

export default function Profile({}) {
  const navigate = useNavigate()
  const token = localStorage.getItem('Auth')
  const ImageRef=useRef()
  const [EditField,setEditField]=useState({
    Username:"",
    Useremail:"",
    UploadImage:""
  })
  const [Slider,setSlider]=useState(false)
  const [Error,setError]=useState({
    Error1:{err:"",check:false},
    Error2:{err:"",check:false},
    Error3:{err:"",check:false},
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
            "Authorization":`Bearer ${token}`
        },
        })
        if(!response.ok){            
          throw new Error('Network response was not ok')
      }
      const result =await response.json()
      console.log(result)
      if(!result.status){
        localStorage.removeItem("Auth");
      }
      }catch(err){
        console.log(err)
      }
    }
    verifyUser()
  },[])
  const EditValidation=()=>{
    var emailRegex =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   if(EditField.Useremail===""&&EditField.UploadImage===""&&EditField.Username===""){
    setError({ ...Error, Error1: { err: 'Please fill in at least one field.', check: true }, 
      Error2: { err: 'Please fill in at least one field.', check: true }, 
      Error3: { err: 'Please fill in at least one field.', check: true }});
    return false
   } 
  else if(EditField.Username===UserData.Username){
    setError({ ...Error, Error2: { err: 'Perivious and New Username are same', check: true }});
    return false
  }
  else if (EditField.Useremail===UserData.Email) {
    setError({...Error,Error3:{ err: 'Perivious and New Email are same', check: true }});
    return false;
  }
  else if (EditField.UploadImage===UserData.UploadImage) {
    setError({...Error,Error1:{ err: 'Perivious and New Profile Pic are same', check: true }});
    return false;
  }
  else if (EditField.Useremail && !emailRegex.test(EditField.Useremail)) {
      setError({...Error,Error3:{ err: 'Invalid Email', check: true }});
      return false;
  }
  setError({
    Error1:{err:"",check:false},
    Error2:{err:"",check:false},
    Error3:{err:"",check:false},
});
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
      setError({
        Error1:{err:"",check:false},
        Error2:{err:"",check:false},
        Error3:{err:"",check:false},
    });
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
            "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({Id:UserData.Id,useremail:EditField.Useremail,username:EditField.Username,UserPic:EditField.UploadImage})
        })
      }else{
      response = await fetch(EditPartialRoute,{
        method:"PATCH",
        headers:{
          'Content-Type': 'application/json',
          "Authorization":`Bearer ${token}`
      },
      body: JSON.stringify({Id:UserData.Id,useremail:EditField.Useremail,username:EditField.Username,UserPic:EditField.UploadImage})
      })
    }
      if(!response.ok){            
        throw new Error('Network response was not ok')
    }   
    const result = await response.json()
    if(!result.status){
      localStorage.removeItem("Auth");
      navigate("/")
    }
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
  const LogoutButton=()=>{
    setSlider(!Slider)
  }
  const Logout=async()=>{
    try{
      const response = await fetch(LogOut,{
          method:"POST",
          headers:{
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        },
      })
      if(!response.ok){
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      if(result.status){
        localStorage.removeItem("Auth");
        localStorage.removeItem("UserData");
        navigate('/')
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <Container>
      <div className="Container">
      <div className="SubContainer">
        <div className="userPic">
        <img src={EditField.UploadImage||UserData.UploadImage} width="250px" alt="" />
        <div className="imgbutton">{Edit&&
        <><input type="file" ref={ImageRef} className='file' onChange={(e)=>{EditHandler(e)}} name="UploadImage" />
        <input type="button" className='ImageUploadbutton'  onClick={(e)=>{TakeImage(e)}} value={ImageButtonName} />
        </>}</div>
        </div>
        <span className='Error' id='Error1'>{Error.Error1.check&&Error.Error1.err}</span>
        <div className="userDetails">
        <div className="inputtext">
          <input type="text" className={Edit?'edit':"showdata"} onChange={(e)=>{EditHandler(e)}} disabled={Edit?false:true} name="Username" placeholder={`Name: ${UserData.Username}`} value={EditField.Username}/>
          </div>
          <span className='Error'>{Error.Error2.check&&Error.Error2.err}</span>
          <div className="inputtext">
          <input type="text" className={Edit?'edit':"showdata"} disabled={Edit?false:true} onChange={(e)=>{EditHandler(e)}} name='Useremail' placeholder={`Email-Id: ${UserData.Email}`} value={EditField.Useremail}/>
          </div>
          <span className='Error'>{Error.Error3.check&&Error.Error3.err}</span>
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
      {Slider?<div className="SubContainer2">
        <i  onClick={()=>{Logout()}} class="fa fa-sign-out icons"></i>
      </div>:<div className="SubContainer2reduce">
        <i onClick={()=>{LogoutButton()}} class="fa-solid fa fa-arrow-right icon"></i>
        </div>}
      </div>
    </Container>
  )
}
const Container=styled.div`
.Container{
    display: flex;
    height: 76vh;
    width: 45vw;
    justify-content: center;
    position: relative;
}
    .icon{
    font-size: 32px;
    color: #797272;
          cursor: pointer;

    }
        .icons{
    font-size: 52px;
    color: #797272;
          cursor: pointer;

    }
.SubContainer{
height: 76vh;
    width: 34vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    border-radius: 5px 0px 5px 5px;
    position: relative;
}
    .SubContainer2{
height: 10vh;
    height: 8vh;
    width: 4.5vw;
    display: flex;
    transition: 1.2s ease-in-out;
    justify-content: center;
    align-items: center;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    border-radius: 0px 10px 10px 0px;
    position: absolute;
    right: 16px;
    }
  .SubContainer2reduce{
height: 5vh;
    transition: 1.2s ease-in-out;
    width: 2vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    border-radius: 0px 10px 10px 0px;
    position: absolute;
    right: 54px;
  }
.userPic img{
   height: 40vh;
    width: 31vw;
    position: absolute;
    top: 8px;
    padding: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .3);
    border-top: 1px solid rgba(255, 255, 255, .3);
    border-left: 1px solid rgba(255, 255, 255, .3);
    left: 25px;
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
    .Error{
        color: red;

    }
    #Error1{
position: relative;
    top: 39px;    }
`
