import React,{useState, useEffect} from "react";
const ChatBar = ({setOpenedChatApp,socket})=>{

    const [chat, setChat] = useState([]);
    const [message, setMessage] = useState("")

    useEffect(()=>{
        socket.on("messageResponse", (data)=>{
            setChat((prevChats)=> [...prevChats, data]);
        })
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(message.trim() !== ""){
            setChat((prevChats)=> [...prevChats, {message, name:"you"}]);
            socket.emit("message",{message});
            setMessage("");
        }
    }

    return (
        <div className="position-fixed top-0 h-100 text-white bg-dark"
        style={{
            width:"300px",
            left:"0%"
        }}
        >
        <button type="button" onClick={()=>setOpenedChatApp(false)} className="btn btn-light btn-block w-100 mt-5">Close</button>
        <div className="w-100 mt-5 p-2 border  border-white rounded-3"
            style={{
                height:"70%",
            }}
        >
            {chat.map((msg, index)=>(
                <p key={index*999} className="my-2 text-center w-100 py-2 border border-left-0 border-right-0">
                    {msg.name}:{msg.message}
                </p>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="w-100 mt-2 p-1 d-flex border border-1-white rounded-3">
            <input type="text" placeholder="Enter message" className="w-100 h-100 rounde-0 py-2 px-4"
                style={{
                    backgroundColor:"transparent",
                    width:"90%",
                    color:"white",
                    outline:"none",
                    border:"none"
                }}
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-success rounded-2">
                send
            </button>
        </form>
    </div>
    )
}
export default ChatBar