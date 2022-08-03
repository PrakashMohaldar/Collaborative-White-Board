import React,{useState} from "react";
import {useNavigate} from 'react-router-dom'

const CreateRoom = ({uuid,socket,setUser})=>{
    const [roomId, setRoomID] = useState(uuid());
    const [name, setName] = useState("");


    const navigate = useNavigate();

    const handleCreateRoom = (e)=>{
        e.preventDefault();

        const roomData = {
            name,
            roomId,
            userId:uuid(),
            host:true,
            presenter:true 
        }
        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined",roomData);
    }
    return (
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input 
                type="text"
                required
                className="form-control my-2" 
                placeholder="Enter Your Name"
                onChange = {(e)=> setName(e.target.value)}
                />
            </div>
                <div className="form-group border">

                    <div className="input-group d-flex align-items-center justify-content-center">
                        <input 
                            type="text"
                            value={roomId}
                            className="form-control my-2 me-2 border-0"
                            disabled
                            placeholder="Generate room code"
                            />
                            <div className="input-groupd-append d-flex gap-1">
                                <button className="btn btn-primary btn-sm me-1" onClick={()=>setRoomID(uuid())} type="button">
                                    generate
                                </button>
                                <button onClick={() => navigator.clipboard.writeText(roomId)} className="btn btn-outline-danger btn-sm me-2" type="button">
                                    copy
                                </button>
                            </div>
                    </div>
                </div>
                <button disabled={name.length ===0} type="submit" className="mt-4 btn btn-outline-primary btn-block form-control" onClick={handleCreateRoom}>Generate Room</button> 
            
        </form>
    )
}
export default CreateRoom