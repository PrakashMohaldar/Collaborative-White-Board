import React from "react";
import { useState,useRef,useEffect } from "react";
import './RoomPage.css'
import WhiteBoard from './../../components/WhiteBoard/WhiteBoard';
import ChatBar from './../../components/chatBar/ChatBar';
const RoomPage = ({user,socket,users}) =>{

    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const [tool, setTool] = useState("pencil")
    const [color, setColor] = useState('black')
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([])
    const [openedUserTab, setOpenedUserTab] = useState(false)
    const [openedChatApp, setOpenedChatApp] = useState(false)

  

    const handleClearCanvas = ()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        setElements([]);

    }
    const undo = ()=>{
        // delete last element from elements 
        // and add this to history

        setHistory((prevHistory)=>{
            return [
                ...prevHistory,
                elements[elements.length -1],
            ];
        })
        setElements((prevElements)=>{
            const leftover = prevElements.slice(0, prevElements.length - 1);
            if(leftover.length==0){
                handleClearCanvas();
                return [];
            }else{
                return(leftover);
            }
          
        })
    }
    const redo = ()=>{
        setElements((prevElements)=>{
            return [
                ...prevElements,
                history[history.length-1]
            ]
        })
        setHistory((prevHistory)=> prevHistory.slice(0, prevHistory.length-1 ))
    }
    return(
        <div className="row">
            <button type="button" className="btn btn-dark mt-lg-0 mt-sm-5"
                 style={{
                    display: "block",
                    position:"absolute",
                    top:"2%",
                    left:"3%",
                    height:"40px",
                    width:"100px"
                }}
                onClick = {()=> setOpenedUserTab(true)}
            >             
                Users</button>

            <button type="button" className="btn btn-primary mt-lg-0 mt-sm-5"
                 style={{
                    display: "block",
                    position:"absolute",
                    top:"9%",
                    left:"3%",
                    height:"40px",
                    width:"100px"
                }}
                onClick = {()=> setOpenedChatApp(true)}
            >             
                Chat</button>

            {
                openedUserTab && (
                    <div className="position-fixed top-0 h-100 text-white bg-dark"
                        style={{
                            width:"250px",
                            left:"0%"
                        }}
                        >
                        <button type="button" onClick={()=>setOpenedUserTab(false)} className="btn btn-light btn-block w-100 mt-5">Close</button>
                        <div className="w-100 mt-5 pt-5">

                            {
                                users.map((usr,index)=>(
                                    <p key={index*999} className="my-2 text-center w-100">
                                        {usr.name} {user && user.userId === usr.userId && "(You)"}
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            {
                openedChatApp && (
                    <ChatBar setOpenedChatApp={setOpenedChatApp} socket={socket}/>
                )
            }

            <h1 className="text-center py-4">White board sharing app <span className="text-primary">[Users Online: {users.length}]</span></h1>

            {
               user && user.presenter && (
                    <div className="col-md-10 mx-auto me-2 gap-4 px-5 mb-3 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="d-flex col-md-2 me-5 justify-content-center gap-2">
                        <div  className="btn btn-outline-secondary d-flex gap-1 align-items-center">
                            <label htmlFor="pencil" >Pencil</label>
                        <input 
                            type="radio"
                            id="pencil"
                            checked={tool === "pencil"}
                            name="tool"
                            value="pencil"
                            className="mt-1" 
                            placeholder="pencil"
                            onChange={(event)=>setTool(event.target.value)}
                        />
                        </div>
                        <div className="btn btn-outline-secondary d-flex gap-1 align-items-center">
                            <label htmlFor="line">Line</label>
                        <input 
                            type="radio"
                            id="line"
                            name="tool"
                            value="line" 
                            checked={tool === "line"}
                            className="mt-1"
                            placeholder="pencil"
                            onChange={(event)=>setTool(event.target.value)}
                        />
                        </div>
                        <div className="btn btn-outline-secondary d-flex gap-1 align-items-center">
                            <label htmlFor="rect">Rectangle</label>
                        <input 
                            type="radio"
                            id="rect"
                            name="tool"
                            checked={tool === "rect"}
                            value="rect"
                            className="mt-1" 
                            placeholder="pencil"
                            onChange={(event)=>setTool(event.target.value)}
                        />
                        </div>
                    </div>
    
                    <div className="col-md-2 ms-5">
                        <div className="d-flex align-items-center justify-content-center">
                            <label htmlFor="color">Select Color:</label>
                            <input 
                                type="color" 
                                id="color"
                                value={color}
                                className="mt-1 ms-2"
                                onChange={(event)=> setColor(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-2 mx-auto d-flex gap-2">
                        <button className="btn text-white btn-warning mt-1" disabled={elements.length===0} onClick={undo}>Undo</button>
                        <button className="btn text-white btn-warning mt-1" disabled={history.length ===0} onClick={redo}>Redo</button>
                    </div>
                    <div className="col-md-3">
                        <button className="btn btn-danger" onClick={handleClearCanvas}>Clear Canvas</button>
                    </div>
                </div>
                )
            }

           

            <div className="col-md-10 mx-auto mt-4 canvas-box">
                <WhiteBoard 
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements} 
                    setElements = {setElements}
                    tool={tool}
                    color= {color}
                    user={user}
                    socket={socket}
                />

            </div>
        </div>
    )
}
export default RoomPage