import { FC, useEffect, useRef, useState } from "react";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import client from "../axios-client";
import { Button, Input, Layout, notification, Typography } from "antd";
import "./Terminal.css";

export let connection: HubConnection | null = null;
export let send: (command?: string) => void;

interface History {
  type: "message" | "output" | "command" | "error";
  value: string;
}

interface TerminalProps {
  repo: string;
}

const Terminal: FC<TerminalProps> = ({ repo }) => {
  useEffect(() => {
    const baseUrl = client.defaults.baseURL;
    connection = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/terminal`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ProcessStarted", function (output: string) {
      setHistory((state) => [
        ...state,
        {
          type: "message",
          value: output,
        },
      ]);
    });

    connection.on("ReceivedOutput", function (output: string) {
      console.log(output);
      setHistory((state) => [
        ...state,
        {
          type: "output",
          value: output,
        },
      ]);
    });

    connection.on("ReceivedError", function (output: string) {
      console.log(output);
      setHistory((state) => [
        ...state,
        {
          type: "error",
          value: output,
        },
      ]);
    });

    connection.on("Error", function (e) {
      console.error(e);
    });

    connection
      .start()
      .then((x) =>
        setHistory((state) => [
          ...state,
          {
            type: "message",
            value: "Connected :)",
          },
        ])
      )
      .catch((e) => console.log(e));
  }, []);

  send = (cmd?: string) => {
    setHistory((state) => [
      ...state,
      {
        type: "command",
        value: cmd ?? command,
      },
    ]);
    connection?.invoke(
      "SendMessage",
      repo,
      (cmd ?? command).split(" ")[0],
      (cmd ?? command).split(" ").splice(1)
    );

    setCommandHistory((x) => [...x, cmd ?? command]);
    setCommand("");
  };

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [command, setCommand] = useState("");

  const [history, setHistory] = useState<History[]>([
    {
      type: "message",
      value: "Welcome to Git Builder terminal! Attempting to connect...",
    },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [history]);
  const bottomRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Layout.Content className={"terminal"}>
        {history.map((x) =>
          x.type === "command" ? (
            <div className={"command"}>
              <div className={"prompt"}>$</div>
              <div>{x.value}</div>
            </div>
          ) : x.type === "message" ? (
            <div className={"command"}>
              <div className={"prompt"}>{">"}</div>
              <div className={"message"}>{x.value}</div>
            </div>
          ) : x.type === "error" ? (
            <div className={"error"}>{x.value}</div>
          ) : (
            <div className={"output"}>{x.value}</div>
          )
        )}
        <div className={"command"}>
          <span className={"prompt"}>$</span>
          <input
            ref={bottomRef}
            className={"input"}
            type={"text"}
            value={command}
            onChange={(x) => setCommand(x.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                send();
              }
              if (
                e.key === "ArrowUp" &&
                commandHistory[commandHistory.length - 1]
              ) {
                setCommand(commandHistory[commandHistory.length - 1]);
              }
            }}
          />
        </div>
      </Layout.Content>
    </>
  );
};

export default Terminal;
