import { FC, useState } from "react";
import { Button, Col, Input, Modal, Row, Spin, Typography } from "antd";
import { useQuery } from "react-query";
import client from "../axios-client";
import { useAtom } from "jotai";
import { TerminalAtom } from "../App";
import { CodeOutlined } from "@ant-design/icons";
import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import AddCommand from "./AddCommand";
import { Simulate } from "react-dom/test-utils";
import select = Simulate.select;
import { send } from "./Terminal";

interface CommandInfo {
  command: string;
  args: string[];
}

interface CommandState {
  commandTemplate: string;
  commandValue: string;
  args: {
    argument: string;
    argValue: string;
  }[];
}

const Commands: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [terminal] = useAtom(TerminalAtom);

  const initializeCommandsState = (commands: CommandInfo[]): CommandState[] =>
    commands.map((command) => ({
      commandTemplate: command.command,
      commandValue: command.command,
      args: command.args.map((x) => ({
        argument: x,
        argValue: "",
      })),
    }));

  const { data, isLoading } = useQuery(
    ["commands"],
    async () => client.get<CommandInfo[]>("commands"),
    {
      onSuccess(data) {
        setCommands(initializeCommandsState(data.data ?? []));
      },
    }
  );
  const commands = data?.data ?? [];
  const [commandsState, setCommands] = useState<CommandState[]>(
    initializeCommandsState(commands)
  );

  const setCommandState = (
    selectedIndex: number,
    arg: string,
    argValue: string
  ) => {
    setCommands((state) =>
      state.map((commandItem, commandIndex) => {
        if (selectedIndex !== commandIndex) return commandItem;
        return {
          commandTemplate: commandItem.commandTemplate,
          commandValue: commandItem.args.reduce((previousValue, currentArg) => {
            return currentArg.argument === arg
              ? previousValue.replace(currentArg.argument, argValue)
              : previousValue.replace(currentArg.argument, currentArg.argValue);
          }, commandItem.commandTemplate),
          args: commandItem.args.map((argumentState) => ({
            argument: argumentState.argument,
            argValue:
              argumentState.argument === arg
                ? argValue
                : argumentState.argValue,
          })),
        };
      })
    );
  };

  return (
    <>
      <Row justify={"space-between"} align={"top"}>
        <Typography.Title level={4}>Commands</Typography.Title>
        <Button
          type={"primary"}
          icon={<CodeOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Add Command
        </Button>
      </Row>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "4px",
          background: "gray",
          color: "white",
          borderRadius: "8px 8px 0 0",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        <span>execute in </span>
        &nbsp; <b>{terminal}</b>
      </div>
      <Spin spinning={isLoading}>
        {commandsState.map((cmd, index) => (
          <div style={{ border: "1px solid #eee", borderTop: 0 }}>
            <Row justify={"space-between"} style={{ padding: "8px" }}>
              <pre style={{ marginBottom: 0, color: "gray" }}>
                {cmd.commandValue}
              </pre>
              <IconButton
                color={"success"}
                onClick={() => {
                  send(cmd.commandValue);
                }}
              >
                <PlayCircleOutlineOutlined />
              </IconButton>
            </Row>
            {cmd.args.map((arg) => (
              <Row style={{ padding: "0 8px", marginBottom: 8 }}>
                <Col span={6}>{arg.argument}</Col>
                <Col span={6}>
                  <Input
                    placeholder={arg.argument}
                    onChange={(x) =>
                      setCommandState(index, arg.argument, x.target.value)
                    }
                    value={arg.argValue}
                  />
                </Col>
              </Row>
            ))}
          </div>
        ))}
      </Spin>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      >
        <AddCommand />
      </Modal>
    </>
  );
};

export default Commands;
