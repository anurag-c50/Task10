import React, { useEffect, useRef, useState } from 'react'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loginRoute, SingupRoute } from '../apiRoute'

export default function LoginAndSignup() {
    const navigate=useNavigate()
    const ImageRef=useRef()
    const [tempdata,setTempdata]=useState()
    const [isImageSelected,setIsImageSelected]=useState(false)
    const [ImageButtonName,setImageButtonName]=useState("Please Select Profile Pic")
    const [LoginData,setLoginData]=useState({
        Email:"",
        Password:""
    })
    const [SignupData,setSignupData]=useState({
        Username:"",
        Email:"",
        Password:"",
        ConfirmPassword:"",
        UploadImage:""

    })
    
    const [Error,setError]=useState({
        Error1:{err:"",check:false},
        Error2:{err:"",check:false},
        Error3:{err:"",check:false},
        Error4:{err:"",check:false},
        Error5:{err:"",check:false}
    })
    const [ShowPassowrd,setShowPassword]=useState({
        ShowPassword1:{icon:"fa fa-eye",type:"password"},
        ShowPassword2:{icon:"fa fa-eye",type:"password"},
        ShowPassword3:{icon:"fa fa-eye",type:"password"}
    })
    const loginFields = [
        {
          label: 'Email',
          type: 'email',
          name: 'Email',
          value: LoginData.Email,
          error: Error.Error1,
          maxLength:30,
          classI:"fa fa-envelope icon",
        },
        {
          label: 'Password',
          type: ShowPassowrd.ShowPassword1.type,
          name: 'Password',
          value: LoginData.Password,
          error: Error.Error2,
          icon: ShowPassowrd.ShowPassword1.icon,
          classI:"fa fa-lock icon",
          maxLength:20,
          password:true,
          onIconClick: () => ChangePasswordicon("password1")
        }
      ];
    const  signupFields = [
        {
          label: 'Username',
          type: 'text',
          name: 'Username',
          value: SignupData.Username,
          error: Error.Error1,
          classI:"fa fa-user icon",
        },
        {
          label: 'Email',
          type: 'email',
          name: 'Email',
          value: SignupData.Email,
          error: Error.Error2,
          classI:"fa fa-envelope icon",
        },
        {
          label: 'Create Password',
          type: ShowPassowrd.ShowPassword2.type,
          name: 'Password',
          value: SignupData.Password,
          error: Error.Error3,
          classI:"fa fa-lock icon",
          password:true,
          icon: ShowPassowrd.ShowPassword2.icon,
          onIconClick: () => ChangePasswordicon('password2')
        },
        {
          label: 'Confirm Password',
          type: ShowPassowrd.ShowPassword3.type,
          name: 'ConfirmPassword',
          value: SignupData.ConfirmPassword,
          error: Error.Error4,
          classI:"fa fa-lock icon",
          password:true,
          icon: ShowPassowrd.ShowPassword3.icon,
          onIconClick: () => ChangePasswordicon('password3')
        }
      ];
    
    
    useEffect(()=>{
        setTempdata(() => {
            const data = JSON.parse(localStorage.getItem('UserData'));
            return data || undefined;
          })
    },[isImageSelected])
    
    const LoginHandler=(e)=>{
        setLoginData({...LoginData,[e.target.name]:e.target.value})
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
            Error3:{err:"",check:false},
            Error4:{err:"",check:false},
            Error5:{err:"",check:false}
        });
    }
    const SingupHandler=(e)=>{
        var username= /^[a-zA-Z]+$/
        if (e.target.name === "UploadImage") {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = reader.result;
                setSignupData({ ...SignupData, UploadImage: base64String });
                setIsImageSelected(true)
                setImageButtonName(file.name)
            };
            reader.readAsDataURL(file)
        }
          else if(e.target.name==="Username"){
            if(username.test(e.target.value)){
                setSignupData({ ...SignupData, [e.target.name]: e.target.value })
            }
          }else{
            setSignupData({ ...SignupData, [e.target.name]: e.target.value })    
        }
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
            Error3:{err:"",check:false},
            Error4:{err:"",check:false},
            Error5:{err:"",check:false}
        });
    }
    const SignupValidation = () => {
        var emailRegex =/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(SignupData.Username===""){
            setError({ ...Erroyr, Error1: { err: 'Empty Username', check: true } });
            return false;
        }
        if(SignupData.Email===""){
            setError({ ...Error, Error2: { err: 'Empty Email', check: true } });
            return false;
        }
        if(SignupData.Password===""){
            setError({ ...Error, Error3: { err: 'Empty Password', check: true } });
            return false;
        }
        if(SignupData.ConfirmPassword===""){
            setError({ ...Error, Error4: { err: 'Empty ConfirmPassword', check: true } });
            return false;
        }
        if(SignupData.UploadImage===""){
            setError({ ...Error, Error5: { err: 'Empty UploadImage', check: true } });
            return false;
        }
        if (SignupData.Username.length<3) {
            setError({ ...Error, Error1: { err: 'Username should be greater than 3 characters', check: true } });
            return false;
        }
        if (SignupData.Email && !emailRegex.test(SignupData.Email)) {
            setError({ ...Error, Error2: { err: 'Invalid Email', check: true } });
            return false;
        }
        if (SignupData.Password.length < 8) {
            setError({ ...Error, Error3: { err: 'Password should be at least 8 characters', check: true } });
            return false;
        }
        if (SignupData.ConfirmPassword.length < 8) {
            setError({ ...Error, Error3: { err: 'Password should be at least 8 characters', check: true } });
            return false;
        }
        if (SignupData.Password !== SignupData.ConfirmPassword) {
            setError({ ...Error, Error3: { err: 'Passwords do not match', check: true },Error4: { err: 'Passwords do not match', check: true } });
            return false;
        }
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
            Error3:{err:"",check:false},
            Error4:{err:"",check:false},
            Error5:{err:"",check:false}
        });
        return true;
    }
    const LoginValidation = () => {
        if (LoginData.Email==="") {
            setError({ ...Error, Error1: { err: 'Empty Email', check: true } });
            return false;
        }
        if (LoginData.Password==="") {
            setError({ ...Error, Error2: { err: 'Empty Password', check: true } });
            return false;
        }
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
            Error3:{err:"",check:false},
            Error4:{err:"",check:false},
            Error5:{err:"",check:false}
        });
        return true;
    }
const LoginSubmit=async(e)=>{
    e.preventDefault()
    try{
    if(LoginValidation()){
        const response=await fetch(loginRoute,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({useremail:LoginData.Email,password:LoginData.Password})
        })
        if(!response.ok){            
            throw new Error('Network response was not ok')
        }
        const result=await response.json()
        if(result.status){
            console.log(result.token)
            localStorage.setItem('UserData', JSON.stringify({Id:result.userdata._id,Username:result.userdata.name,Email:result.userdata.email,UploadImage:result.userdata.UserPic}));
            localStorage.setItem('Auth',result.token)
            navigate('/profile')
        }else{
          setError({ ...Error,Error1: { err: result.msg, check: true } , Error2: { err: result.msg, check: true } });
        }
    }
    }catch(err){
        console.log(err)
    }
}
    const SignupSubmit=async(e)=>{
        try{
        e.preventDefault()
        if(SignupValidation()){
            const response=await fetch(SingupRoute,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username:SignupData.Username,useremail:SignupData.Email,password:SignupData.Password,userPic:SignupData.UploadImage})
            })
            if(!response.ok){            
                throw new Error('Network response was not ok')
            }
            const result=await response.json()
            if(result.status){
                localStorage.setItem('UserData', JSON.stringify({Id:result.userdata._id,Username:result.userdata.name,Email:result.userdata.email,UploadImage:result.userdata.UserPic}));
                localStorage.setItem('Auth',result.token)
                navigate('/profile')
                  }else{
              setError({ ...Error,Error5: { err: result.msg, check: true }});
            }
        }
    }catch(err){
        console.log(err)
    }
    }
    const [ChangeLoginToSignup,setChangeLoginToSignup]=useState(false)
    const ChangeLoginSignup=()=>{
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
            Error3:{err:"",check:false},
            Error4:{err:"",check:false},
            Error5:{err:"",check:false}
        })
        setChangeLoginToSignup(!ChangeLoginToSignup)
    }

    const ChangePasswordicon=(password)=>{
        if(password==='password1'){
            if(ShowPassowrd.ShowPassword1.type==="password"){
            setShowPassword({...ShowPassowrd,ShowPassword1:{icon:'fa fa-eye-slash',type:'text'}});
            }else{
                setShowPassword({...ShowPassowrd,ShowPassword1:{icon:"fa fa-eye",type:"password"}});
            }
        }else if(password==='password2'){
            if(ShowPassowrd.ShowPassword2.type==="password"){
            setShowPassword({...ShowPassowrd,ShowPassword2:{icon:'fa fa-eye-slash',type:'text'}});
            }else{
                setShowPassword({...ShowPassowrd,ShowPassword2:{icon:"fa fa-eye",type:"password"}});
            }
        }else{
            if(ShowPassowrd.ShowPassword3.type==='password'){
            setShowPassword({...ShowPassowrd,ShowPassword3:{icon:'fa fa-eye-slash',type:'text'}});
            }else{
                setShowPassword({...ShowPassowrd,ShowPassword3:{icon:"fa fa-eye",type:"password"}});
            }
        }
    } 
    const TakeImage=(e)=>{
        e.preventDefault()
        ImageRef.current.click()
    }
  return (
    <Container><div className={`${ChangeLoginToSignup?"Container Change":"Container"}`}>
        <form className={`form ${ChangeLoginToSignup&&"login"}`}>
            <div className="title"><h1>Login</h1></div>
            {loginFields.map((item,index)=>{
                return(
                    <>
                     <div key={index} className="input-icons">
                     <i className={item.classI}></i>
                     {item.password&&<span className='lock'><i className={`${item.icon} icons`}  onClick={item.onIconClick}></i></span>}
                     <input className="input-fields" maxLength={item.maxLength}  type={item.type} placeholder={item.label} name={item.name} value={item.value} onChange={(e)=>{LoginHandler(e)}}/>
                     <span>{item.error.check&&item.error.err}</span>
                     </div>
                    </>
                )
            })}
            <div className="pass-link">
            <a href >Forgot password?</a>
            </div>
            <div className="field">
              <input type="submit" onClick={(e)=>{LoginSubmit(e)}} className="button" id="input" value="Login"></input>
            </div>
            <div className="signup-link" >Not a member?
              <a onClick={()=>{ChangeLoginSignup()}}>Sign Up</a>
            </div>
        </form>
         <form className={`form ${!ChangeLoginToSignup?"signup":"signupon"}`}>
         {isImageSelected&&<div className="avatar">
            <img src={SignupData.UploadImage} width="250px" alt="" /></div>}
            <div className="title"><h1>Signup</h1></div>
            {signupFields.map((item,index)=>{
                return(
                    <>
                    <div key={index} className="input-icons">
                    <i className={item.classI}></i>
                    {item.password&&<span className='lock'><i className={`${item.icon} icons`} onClick={item.onIconClick}></i></span>}
                    <input className="input-fields" maxLength={item.maxLength}  type={item.type} placeholder={item.label} name={item.name} value={item.value} onChange={(e)=>{SingupHandler(e)}}/>
                    <span>{item.error.check&&item.error.err}</span>
                    </div>
                   </>
                )
            })}
            <div className="imagebutton">
                <input type="file" name="UploadImage" className="fileinput" ref={ImageRef} onChange={((e)=>{SingupHandler(e)})}/>
                <input className='TakeImage' type="button" name='UploadImage' onClick={(e)=>{TakeImage(e)}} value={ImageButtonName} />
            </div>
            <span>{Error.Error5.check&&Error.Error5.err}</span>
            <div className="field">
              <input type="submit" onClick={(e)=>{SignupSubmit(e)}}  className="button"  value="Signup"></input>
            </div> 
            <div className="signup-link">Already have an account?
              <a onClick={()=>{ChangeLoginSignup()}}>Login</a>
            </div>
        </form> 
      </div></Container>
  )
}
const Container = styled.div`
.Container{
    height: 60vh;
    width: 29vw;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    border-radius: 5px;
    position: relative;
}
    .Change{
    height: 73vh;
    width: 29vw;
    }
.TakeImage{
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
    .TakeImage:hover{
    font-size: 18px;
    }
.form{
    height: 58vh;
    width: 26vw;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
.title{
    position: relative;
    bottom: 28px;
    color: #797272;
}
        .input-icons {
             width: 100%;
height: 9vh;        }

        .input-icons i {
            position: absolute;
                color: #909090;
        }

        .icon {
        min-width: 33px;
    padding: 14px 0px 0px 7px;
        }
    .icons{
     min-width: 33px;
    padding: 14px 0px 0px 7px;
    }
        .input-field {
           width: 100%;
    height: 6vh;
    padding-left: 22px;
    border: 2px solid #7d8d97;
    border-radius: 7px;
     color: #797272;
         outline: none;
    font-size: 20px;
    font-weight: 549;
        border-bottom-width: 5px;
        } 
.pass-link{
color: #124fab;
}
input:focus{
    border-color:#5186a7;
    }
.pass-link:hover{
cursor: pointer;
    text-decoration: underline;
}
.field{
    height: 8vh;
    width: 19vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
.field input{
    width: 16vw;
    height: 6vh;
    background-color: #2477f3;
    font-size: 24px;
    font-weight: 50;
    border: none;
    cursor: pointer;
    box-shadow: none;
    border-radius: 6px;
    color: #e4d4d4;
  } 
 .field input:hover{
  font-size: 30px;
    font-weight: 70;
    background-color:#124fab;
 }
      .signup-link {
color: #797272;
}  
    .signup-link a{
color: #124fab;
}
.signup-link a:hover{
cursor: pointer;
    text-decoration: underline;
}
.input-fields {
    width: 100%;
    height: 6vh;
    padding-left: 28px;
    font-size: 20px;
    font-weight: 549;
    border: 2px solid #7d8d97;
    border-radius: 7px;
    color: #797272;
    outline: none;
    border-bottom-width: 5px;
}
.signup{
position: absolute;
    right: 100px;
    visibility: hidden;
}
.signupon{
   height: 66vh;
    width: 26vw;
}
.login{
    position: absolute;
    left: 100px;
    visibility: hidden;
}
.lock{
    position: absolute;
    right: 53px;
    }
span{
color:red;
}
.avatar img{
    height: 11vh;
    position: relative;
    bottom: 24px;
    width: 6vw;
    border-radius: 50%;
      padding: 0.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0,0,0,.3);
    border-top: 1px solid rgba(255,255,255,.3);
    border-left: 1px solid rgba(255,255,255,.3);
}
.fileinput{
display:none;
}
.imagebutton{
    width: 17vw;
    height: 6vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
 `