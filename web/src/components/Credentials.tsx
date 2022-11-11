import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import client from "../axios-client";
import {
  Button,
  Divider,
  Form,
  Input,
  List,
  Menu,
  Modal,
  Row,
  Typography,
} from "antd";
import { PlusOutlined, CreditCardOutlined } from "@ant-design/icons";

const Credentials = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery(["credentials"], () =>
    client.get<string[]>("auth")
  );
  const credentials = data?.data ?? [];

  const { mutateAsync } = useMutation(
    ["credentials"],
    async () => {
      return await client.post("auth", {
        username,
        password,
      });
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries(["credentials"]);
      },
    }
  );

  const submit = async () => {
    await mutateAsync();
  };

  return (
    <Form layout={"vertical"} onFinish={submit}>
      <Row justify={"space-between"} align={"top"}>
        <Typography.Title level={4}>Saved Credentials</Typography.Title>
        <Button
          type={"primary"}
          icon={<CreditCardOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Add Credentials
        </Button>
      </Row>
      <List
        size={"small"}
        bordered
        dataSource={credentials}
        renderItem={(x) => (
          <List.Item key={x}>
            <Typography.Text>{x}</Typography.Text>
          </List.Item>
        )}
      />
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      >
        <Form.Item label={"Username"}>
          <Input
            placeholder={"git user"}
            value={username}
            onChange={(x) => setUsername(x.target.value)}
          />
        </Form.Item>
        <Form.Item label={"Password"}>
          <Input.Password
            placeholder={"git pass"}
            value={password}
            onChange={(x) => setPassword(x.target.value)}
          />
        </Form.Item>
        <Button htmlType={"submit"} type={"primary"}>
          Save Credentials
        </Button>
      </Modal>
    </Form>
  );
};

export default Credentials;
