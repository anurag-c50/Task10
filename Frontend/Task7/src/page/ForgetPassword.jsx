import React, { useState} from 'react'
import styled from 'styled-components';
import {SendMail } from '../apiRoute';

export default function ForgetPassword() {
    const [Email,setEmail]=useState("")
    const [InputDefault,setInputDefault]=useState(false)
    const [Loading,setLoading]=useState(false)
    const [Error,setError]=useState({err:"",check:false})
    const [SuccessMessage, setSuccessMessage] = useState("");
    const EmailHandler=(e)=>{
        setError({err:"",check:false})
        setEmail(e.target.value)
    }
    const sendmail=async(e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const response=await fetch(SendMail,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({email:Email})
            })
            if(!response.ok){
                throw new Error('Network response was not ok')
            }
            const result=await response.json()
            if(result.status){
            setLoading(false)
            setEmail("")
            setInputDefault(true)
            setSuccessMessage("Link has been sent to your email!");
            }else{
                setError({err:result.msg,check:true})
            }
        }catch(err){
            console.log(err)
        }
        }
  return (
    <Conatiner>
        <div className='wrapper'>
        <div className="form-box OTP">
          <h2>FORGET PASSWORD</h2>
          <form action="">
          <div className="input-icons">
                     <i className="fa fa-envelope icon"></i>
                     <input className="input-fields"  type="email" disabled={InputDefault} placeholder={"Email"} name="email" value={Email} onChange={(e)=>EmailHandler(e)}/>
          </div>
          <span className='Error'>{Error.check&&Error.err}</span>
          <span className='Success'>{SuccessMessage && SuccessMessage}</span> 
          <button type="submit" className="btn" onClick={(e)=>sendmail(e)}>{Loading?"Sending...":"Send Link"}</button>
          </form>
        </div>
        </div>
     </Conatiner>
  )
}
const Conatiner = styled.div`
    .Error{
       color: red;
    }
          .Success {
        color: green;
        font-size: 1.1em;
    }
.wrapper{
    position: relative;
    width: 409px;
    height: 40vh;
    box-shadow: -3px -3px 7px #ffffffb2, 3px 3px 7px rgba(94, 104, 121, 0.945);
    background-color: aliceblue;
    display: flex;
    border-radius:10px;
    justify-content: center;
    align-items: center;
    transition: .2s ease;
    overflow: hidden;
}
.wrapper .form-box{
    width: 100%;
    padding: 40px;
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
    padding: 11px 0px 0px 3px;
    font-size: 18px;
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
`