import React,{useState, useEffect, useLayoutEffect} from "react";
import rough from 'roughjs'


const roughGenerator = rough.generator();


const WhiteBoard = ({color,canvasRef,ctxRef,elements, setElements,tool,user,socket})=>{
    const [isdrawing, setIsDrawing] = useState(false);
    const [img, setImg] = useState(null)
    useEffect(()=>{
        socket.on("whiteBoardDataResponse",(data)=>{
            setImg(data.imgURL);
        })
    },[])

    if(user && !user.presenter){
        return (
           <>      
            <div
                className="border border-dark border-2 h-100 w-100 overflow-hidden">
            <img src={img} alt="Creator is sharing content" 
                style={{
                    height:window.innerHeight * 2,
                    width:"285%",           
                }}
                />
            </div>
           </>
        )
    }

   

   

    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d")

        ctx.strokeStyle = color;
        ctx.linewidth = 2;
        ctx.lineCap = "round";

        ctxRef.current = ctx; 
    },[])


    useEffect(()=>{
        ctxRef.current.strokeStyle = color;
    },[color])

    const handleMouseDown = (e)=>{
        // console.log('mouse dows',e);
        const {offsetX, offsetY} = e.nativeEvent;
        
        if(tool === "pencil"){
            setElements((prevElem)=>{
             return [
                ...prevElem,
                {
                    type:"pencil",
                    offsetX,
                    offsetY,
                    path:[[offsetX, offsetY]],
                    stroke:color
                },
               ]
            })
        }else if(tool ==="line"){
            setElements((prevElem)=>[
                ...prevElem,
                {
                    type:"line",
                    offsetX,
                    offsetY,
                   width: offsetX,
                   height: offsetY,
                   stroke:color
                }
            ])
        } else if(tool=== "rect"){
            setElements((prevElem)=>[
                ...prevElem,
                {
                    type:"rect",
                    offsetX,
                    offsetY,
                   width: 0,
                   height: 0,
                   stroke:color
                }
            ])
        }


        setIsDrawing(true)
    }


    useLayoutEffect(()=>{
        if(canvasRef){
            const roughCanvas = rough.canvas(canvasRef.current);
    
            if(elements.length > 0){
                ctxRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height)
            }
            elements.forEach((elem)=>{
                if(elem.type === "pencil"){
                    roughCanvas.linearPath(
                                    elem.path,
                                    {
                                        stroke:elem.stroke,
                                        strokeWidth:5,
                                        roughness:0
                                    }
                                )
                }else if(elem.type === "line"){
                    roughCanvas.draw(
                        roughGenerator.line(
                                elem.offsetX,
                                elem.offsetY,
                                elem.width,
                                elem.height,
                                {
                                    stroke:elem.stroke,
                                    strokeWidth:5,
                                    roughness:0
                                }
                            )
                    )
                } else if(elem.type === "rect"){
                    roughCanvas.draw(
                        roughGenerator.rectangle(
                            elem.offsetX,
                            elem.offsetY,
                            elem.width,
                            elem.height,
                            {
                                stroke:elem.stroke,
                                strokeWidth:5,
                                roughness:0
                            }
                        )
                    )
                }
            })

            const canvasImage = canvasRef.current.toDataURL();
            socket.emit("whiteboardData",canvasImage);

        }
    },[elements])

   
   
    const handleMouseMove = (e)=>{
        const {offsetX, offsetY} = e.nativeEvent;

        if(isdrawing){
            
            if(tool === "pencil"){
                const {path} = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElem)=>
                    prevElem.map((elem,index)=>{
                        if(index=== elements.length - 1){
                            return{
                                ...elem,
                                path: newPath,
                            };
                        }else{
                            return elem;
                        }
                    })
                )
            }
            else if(tool === "line"){
                setElements((prevElem)=>
                prevElem.map((elem,index)=>{
                    if(index=== elements.length - 1){
                        return{                       
                           ...elem,
                           width:offsetX,
                           height:offsetY
                        };
                    }else{
                        return elem;
                    }
                })
             )
            } else if (tool === "rect"){
                setElements((prevElem)=>
                prevElem.map((elem,index)=>{
                    if(index=== elements.length - 1){
                        return{                       
                           ...elem,
                           width:offsetX - elem.offsetX,
                           height:offsetY - elem.offsetY
                        };
                    }else{
                        return elem;
                    }
                })
             )
            }
        }

    }
    const handleMouseUp = (e)=>{
        // console.log('mouse up',e);
       setIsDrawing(false);
    }

 
    return(
        <>
         <div
            className="border border-dark border-2 h-100 w-100 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}  
          >
            <canvas ref={canvasRef} />
          </div>
        </>
    )
}
export default WhiteBoard