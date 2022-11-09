import {FC, useEffect, useState} from "react";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import client from "../axios-client";
import {Button, Input, notification} from "antd";
import "./Terminal.css";


let connection: HubConnection | null = null;

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
            setWelcomeMessage(output);
        });
        
        connection.on("ReceivedOutput", function (output: string) {
            console.log(output);
            setHistory      (state => [
                ...state,
                output
            ])
        });

        connection.on("ReceivedError", function (output: string) {
            console.log(output);
            setHistory      (state => [
                ...state,
                output
            ])
        });
        
        connection.on("Error", function (e) {
           notification.error({
               message: e
           }); 
        });
        
        connection
            .start()
            .then(x => console.log("connection opened"))
            .catch(e => console.log(e));

    }, [])
    
    const send = () => {
        connection?.invoke("SendMessage", command);
        setCommand("");
    }
    
    const [command, setCommand] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("Welcome to Git Builder");
    const [history, setHistory] = useState<string[]>([]);
    return <>
            <Input.TextArea 
                className={"terminal"} 
                value={history.join("\n")}  
                rows={12} 
                maxLength={12} 
                disabled />
            <Input prefix={"$"} value={command} onChange={x => setCommand(x.target.value)} />
            <Button prefix={"$"} onClick={send}>Send</Button>
        </>
}

export default Terminal;