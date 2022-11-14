import { FC, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { useMutation, useQueryClient } from "react-query";
import client from "../axios-client";

const AddCommand: FC = () => {
  const queryClient = useQueryClient();
  const [command, setCommand] = useState("");

  const { mutateAsync, isLoading: isSubmitting } = useMutation(
    ["commands"],
    () => {
      return client.post("commands", {
        command,
      });
    },
    {
      async onSuccess() {
        setCommand("");
        await queryClient.invalidateQueries(["commands"]);
      },
    }
  );

  const submit = async () => {
    await mutateAsync();
    setCommand(command);
  };

  return (
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
  );
};

export default AddCommand;
