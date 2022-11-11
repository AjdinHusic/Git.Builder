import { FC, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Spin,
  Typography,
} from "antd";
import { useMutation, useQuery } from "react-query";
import client from "../axios-client";
import { useAtom } from "jotai";
import { TerminalAtom } from "../App";
import { CodeOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { PlayCircle, PlayCircleOutlineOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface CommandInfo {
  command: string;
  args: string[];
}

const Commands: FC = () => {
  const [command, setCommand] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [terminal] = useAtom(TerminalAtom);

  const { data, isLoading } = useQuery(["commands"], () =>
    client.get<CommandInfo[]>("commands")
  );
  const commands = data?.data ?? [];
  const { mutateAsync, isLoading: isSubmitting } = useMutation(
    ["commands"],
    () => {
      return client.post("commands", {
        command,
      });
    }
  );

  const submit = async () => {
    await mutateAsync();
    setCommand(command);
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
        {commands.map((cmd) => (
          <div style={{ border: "1px solid #eee", borderTop: 0 }}>
            <Row justify={"space-between"} style={{ padding: "8px" }}>
              <pre style={{ marginBottom: 0, color: "gray" }}>
                {cmd.command}
              </pre>
              <IconButton color={"success"}>
                <PlayCircleOutlineOutlined />
              </IconButton>
            </Row>
            {cmd.args.map((i) => (
              <Row style={{ padding: "0 8px", marginBottom: 8 }}>
                <Col span={6}>{i}</Col>
                <Col span={6}>
                  <Input placeholder={i} />
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
        <Spin spinning={isSubmitting}>
          <Form layout={"vertical"} onFinish={submit}>
            <Form.Item
              label={
                "Add Command, use {} for argument interpolation, .e.g. 'ping {host}'"
              }
            >
              <Input
                placeholder={"command"}
                value={command}
                onChange={(x) => setCommand(x.target.value)}
              />
            </Form.Item>
            <Button type={"primary"} htmlType={"submit"}>
              Save
            </Button>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default Commands;
