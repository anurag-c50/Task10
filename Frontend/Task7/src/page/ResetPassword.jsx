import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { Authorization,Resetpassword } from '../apiRoute'
import { useEffect, useState } from 'react'
import styled from 'styled-components';

export default function ResetPassword() {
    const navigate=useNavigate()
    const {token}=useParams()
    const [resetpassword,setResetpaswword]=useState({
        password:"",
        confirmpassword:""
    })
    const [Error,setError]=useState({
        Error1:{err:"",check:false},
        Error2:{err:"",check:false},
    })
    const [ShowPassowrd,setShowPassword]=useState({
        ShowPassword1:{icon:"fa fa-eye",type:"password"},
        ShowPassword2:{icon:"fa fa-eye",type:"password"},
    })
    const setVal1=(e)=>{
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
        });
        setResetpaswword({...resetpassword,[e.target.name]:e.target.value})
    }
    const Otptoken=localStorage.getItem('OtpToken')
    useEffect(()=>{
       async function verifyOtpToken(){
        const response=await fetch(Authorization,{
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            },
        })

        if(!response.ok){
            throw new Error('Network response was not ok')
        }
        const result=await response.json()
        if(!result.status){

        }
       }
       verifyOtpToken()
    },[])
    const resetValidation=()=>{
        if(resetpassword.password===""&&resetpassword.confirmpassword===""){
            setError({ ...Error, Error1: { err: 'Some field Missing.', check: true }, 
                Error2: { err: 'Some field Missing.', check: true }, });
            return false
        }
        else if(resetpassword.password.length < 8) {
            setError({ ...Error, Error1: { err: 'Password should be at least 8 characters', check: true } });
            return false;
        }
        if (resetpassword.confirmpassword.length < 8) {
            setError({ ...Error, Error2: { err: 'Password should be at least 8 characters', check: true } });
            return false;
        }
       else if(resetpassword.password===""){
            setError({ ...Error, Error1: { err: 'Some field Missing.', check: true }})
            return false
        }else if(resetpassword.confirmpassword===""){
            setError({ ...Error, Error2: { err: 'Some field Missing.', check: true }})
            return false
        }
        else if(resetpassword.password!==resetpassword.confirmpassword){
            setError({ ...Error, 
                Error1: { err: 'Password and ConfirmPassword not same', check: true }, 
                Error2: { err: 'Password and ConfirmPassword not same.', check: true }});
            return false
        }
        setError({
            Error1:{err:"",check:false},
            Error2:{err:"",check:false},
        });
        return true
    }
    const resetpasssword=async(e)=>{
       e.preventDefault()
        try{
        if(resetValidation()){
        const response=await fetch(Resetpassword,{
            method:"PATCH",
            headers:{
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({Password:resetpassword.password})
        })
        if(!response.ok){
            throw new Error('Network response was not ok')
        }
        const result=await response.json()
        if(result.status){
            // navigate("/")
        }else if(!result.status){
            setError({ ...Error, Error2: { err: "Link has been expired", check: true }})
        }else{
            setError({ ...Error, Error2: { err: result.msg, check: true }})
            setResetpaswword({
                password:"",
                confirmpassword:""
            })
        }
    }
       }catch(err){
        console.log(err)
       }
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
        }
    } 
  return (
    <Container>
        <div className="wrapper">
        <div className="form-box passwordReset">
              <h2>RESSET PASSWORD</h2>
              <form action="">
                <div className="input-icons">
                    <i className="fa fa-lock icon"></i>
                    <span className='lock'><i onClick={()=>ChangePasswordicon("password1")} className={`${ShowPassowrd.ShowPassword1.icon} icons`} ></i></span>
                    <input className="input-fields" placeholder='Create Password' maxLength={30}  type={ShowPassowrd.ShowPassword1.type}  name="password" onChange={(e)=>setVal1(e)} value={resetpassword.password}/>                    
                    </div>
                    <span className='Error'>{Error.Error1.check&&Error.Error1.err}</span>

                    <div className="input-icons">
                    <i className="fa fa-lock icon"></i>
                    <span className='lock'><i onClick={()=>ChangePasswordicon("password2")} className={`${ShowPassowrd.ShowPassword2.icon} icons`} ></i></span>
                    <input className="input-fields" maxLength={30} placeholder='Confirm Password' value={resetpassword.confirmpassword} type={ShowPassowrd.ShowPassword2.type}  name="confirmpassword" onChange={(e)=>setVal1(e)}/>                    
                    </div>
                    <span className='Error'>{Error.Error2.check&&Error.Error2.err}</span>
                <button type="submit" onClick={(e)=>resetpasssword(e)} className="btn">Reset Password</button>
              </form>
            </div>
            </div>
    </Container>
  )
}
const Container = styled.div`
  .Error{
        color: red;

    }
.wrapper{
    position: relative;
    width: 409px;
    height: 46vh;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    display: flex;
    border-radius:10px;
    justify-content: center;
    align-items: center;
    transition: .2s ease;
    overflow: hidden;
}.lock{
    position: absolute;
    right: 72px;
    }
.wrapper .form-box{
    width: 100%;
}
.wrapper .form-box.passwordReset{
    padding: 0px 39px;
        height: 32vh;}

.wrapper.active .form-box.passwordReset{
    transition: .18s ease;
    transform: translateX(0);
        width: 27vw;

}
.form-box h2{
    font-size: 2em;
    color: #797272;
        margin-bottom: 18px;
    text-align: center;
    }
.input-fields {
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
      .input-icons {
             width: 100%;
height: 7vh;        }

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

input:focus{
    border-color:#5186a7;
    }


.btn{
   width: 100%;
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
.outerBox{
    width: 45vw;
    height: 28vw;
    display: flex;
    justify-content: center;
}`
