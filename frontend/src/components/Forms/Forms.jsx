import React from "react"
import './Forms.css'
import CreateRoom from "./CreateRoom/CreateRoom";
import JoinRoom from './JoinRoomForm/JoinRoom';

const Forms = ({uuid,socket, setUser}) =>{
    return (
        <div className="row h-100 pt-5">
            <div className="header w-100  text-center">
                <h2 className="text-secondary">REAL TIME WHITE BOARD SHARING APP</h2>
            </div>

            <div className="col-md-4 form-box p-5 mx-auto mt-5 border border-2 border-primary rounded-2 d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Create Room</h1>
                <CreateRoom uuid={uuid} socket={socket} setUser = {setUser}/>
            </div>
            <div className="col-md-4 form-box p-5 mx-auto mt-5 border border-2 border-primary rounded-2 d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Join Room</h1>
                <JoinRoom uuid={uuid} socket={socket} setUser = {setUser}/>
            </div>
        </div>
    )
}
export default Forms