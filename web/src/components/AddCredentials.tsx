import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import client from "../axios-client";
import {Button, Divider, Form, Input, List, Menu, Typography} from "antd";

export const AddCredentials = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const queryClient = useQueryClient();

    const {data} = useQuery(["credentials"], () => client.get<string[]>("auth"));
    const credentials = data?.data ?? [];

    const {mutateAsync} = useMutation(["credentials"], async () => {
        return await client.post('auth', {
            username,
            password
        });
    }, {
        async onSuccess() {
            await queryClient.invalidateQueries(["credentials"]);
        }
    });

    const submit = async () => {
        await mutateAsync();
    }

    return <Form layout={"vertical"} onFinish={submit}>
        <Typography.Title>Saved Credentials</Typography.Title>
        <List  bordered dataSource={credentials} renderItem={x => <List.Item key={x}><Typography.Text>{x}</Typography.Text></List.Item>} />
        <Divider />
        <Form.Item label={"Username"}>
            <Input placeholder={"git user"} value={username} onChange={x => setUsername(x.target.value)}/>
        </Form.Item>
        <Form.Item label={"Password"}>
            <Input.Password placeholder={"git pass"} value={password} onChange={x => setPassword(x.target.value)}/>
        </Form.Item>
        <Button htmlType={"submit"} type={"primary"}>
            Save Credentials
        </Button>
    </Form>
}