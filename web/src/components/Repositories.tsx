import { FC, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { FolderAddOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import client from "../axios-client";
import ShowBranches from "./ShowBranches";
import { useAtom } from "jotai";
import { TerminalAtom } from "../App";
import { TerminalOutlined } from "@mui/icons-material";

const Repositories: FC = () => {
  const [, setTerminal] = useAtom(TerminalAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const { data } = useQuery(["repository"], () =>
    client.get<string[]>("repositories")
  );
  const repos = data?.data ?? [];
  const { mutateAsync } = useMutation(["repository"], () => {
    return client.post("repositories/clone", {
      url,
      path: name,
    });
  });

  const submit = async () => {
    await mutateAsync();
  };

  return (
    <Form layout={"vertical"} onFinish={submit}>
      <Row justify={"space-between"} align={"top"}>
        <Typography.Title level={4}>Repositories</Typography.Title>
        <Button
          type={"primary"}
          icon={<FolderAddOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Add Repo
        </Button>
      </Row>
      <div style={{ border: "1px solid lightgray" }}>
        {repos.map((x) => (
          <Row
            gutter={4}
            style={{
              padding: 8,
              alignItems: "center",
              verticalAlign: "middle",
            }}
          >
            <Col span={4}>
              <Typography>{x}</Typography>
            </Col>
            <Col
              span={16}
              style={{ verticalAlign: "middle", alignItems: "center" }}
            >
              <ShowBranches repo={x} />
            </Col>
            <Col span={4}>
              <Button
                style={{ alignItems: "center", display: "flex" }}
                icon={<TerminalOutlined color={"info"} />}
                onClick={() => setTerminal(x)}
              >
                Terminal
              </Button>
            </Col>
          </Row>
        ))}
      </div>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
        closeIcon={null}
      >
        <Form.Item label={"Clone a Repository"}>
          <Input
            placeholder={"url"}
            value={url}
            onChange={(x) => setUrl(x.target.value)}
          />
        </Form.Item>
        <Form.Item label={"name"}>
          <Input
            placeholder={"repository/folder name"}
            value={name}
            onChange={(x) => setName(x.target.value)}
          />
        </Form.Item>
        <Button htmlType={"submit"} type={"primary"}>
          Clone
        </Button>
      </Modal>
    </Form>
  );
};

export default Repositories;
