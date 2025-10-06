import React,{useEffect,useState} from 'react'
import axios from 'axios';


const Help = () => {
    const [title,setTitle]=useState('');
    const [content,setContent]=useState('');
    const [email,setEmail]=useState('');

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const form = {title:title,content:content,email:email}
        try{
            await axios.post("http://localhost:8000/api/help/",form);
            setContent("");
            setEmail("");
            setTitle("");
            alert(`Message sent to team, the team will review and reply via ${email}!`)
        }catch(err){
            alert("An error occured, please try again!")
            console.log(err)
        }
    }


  return (
    <div className='p-6 max-w-5xl mx-auto dark:text-gray-100'>
        <h3 className='text-2xl text-gray-500 font-bold dark:text-gray-400'>Contact our team for assistance or feedback</h3>
        <form className='my-3 dark:text-gray-100' onSubmit={handleSubmit}>
            <input type="text" className='w-full border border-blue-500 rounded my-3 p-3' placeholder='Title' name='title' value={title} onChange={(e)=>setTitle(e.target.value)} required />
            <textarea name="content" value={content} className='w-full border border-blue-500 rounded p-3' placeholder='Describe your issue here...' onChange={(e)=>setContent(e.target.value)} required></textarea>
            <input type="email" className='w-full border border-blue-500 rounded my-3 p-3' placeholder='Email address' name='email' value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <button className='bg-blue-600 rounded p-3 text-gray-100'>Submit</button>
        </form>
    </div>
  )
}

export default Help