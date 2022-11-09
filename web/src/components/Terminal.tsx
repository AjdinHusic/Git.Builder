import {FC, useEffect, useRef, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import client from "../axios-client";
import {Button, Input, Layout, notification, Typography} from "antd";
import "./Terminal.css";


let connection: HubConnection | null = null;

interface History {
    type: "message" | "output" | "command" | "error";
    value: string;
}

const Terminal: FC = () => {
    
    
    useEffect(() => {
        const baseUrl = client.defaults.baseURL;
        connection = new HubConnectionBuilder()
            .withUrl(`${baseUrl}/terminal`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();

        connection.on("ProcessStarted", function (output: string) {
            setHistory(state => [
                ...state,
                {
                    type: "message",
                    value: output
                }
            ])
        });
        
        connection.on("ReceivedOutput", function (output: string) {
            console.log(output);
            setHistory      (state => [
                ...state,
                {
                    type: "output",
                    value: output,
                }
            ])
        });

        connection.on("ReceivedError", function (output: string) {
            console.log(output);
            setHistory      (state => [
                ...state,
                {
                    type: "error",
                    value: output,
                }
            ])
        });
        
        connection.on("Error", function (e) {
           console.error(e);
        });
        
        connection
            .start()
            .then(x => console.log("connection opened"))
            .catch(e => console.log(e));

    }, [])
    
    const send = () => {
        setHistory(state => [
            ...state,
            {
                type: "command",
                value: command,
            }
        ])
        connection?.invoke("SendMessage", 
            command.split(" ")[0],
            command.split(" ").splice(1));
        
        setCommandHistory(x => [
            ...x,
            command
        ]);
        setCommand("");
    }
    
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [command, setCommand] = useState("");
    
    const [history, setHistory] = useState<History[]>([{
        type: "message",
        value: "Welcome to Git Builder terminal! Attempting to connect..."
    }]);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [history])
    const bottomRef = useRef<HTMLInputElement>(null);
    
    return <>
        <Layout.Content className={"terminal"}>
            {
                history.map(x => 
                    x.type === "command" ? 
                    <div className={"command"}>
                        <div className={"prompt"}>
                            $ 
                        </div>
                        <div>
                            {x.value}
                        </div>    
                    </div>
                    : 
                    x.type === "message" ?
                    <div className={"command"}>
                        <div className={"prompt"}>
                            {">"}
                        </div>
                        <div className={"message"}>{x.value}</div>
                    </div>
                    :
                    x.type === "error" ? 
                    <div className={"error"}>{x.value}</div> 
                    :    
                    <div className={"output"}>{x.value}</div>)
            }
            <div className={"command"}>
                <span className={"prompt"}>
                    $
                </span>
                <input 
                    ref={bottomRef}
                    className={"input"} 
                    type={"text"} 
                    value={command} 
                    onChange={x => setCommand(x.target.value)} 
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            send();
                        }
                        if (e.key === "ArrowUp" && commandHistory[commandHistory.length - 1]) {
                            setCommand(commandHistory[commandHistory.length - 1])
                        }
                    }}
                />
            </div>
        </Layout.Content>
        </>
}

export default Terminal;