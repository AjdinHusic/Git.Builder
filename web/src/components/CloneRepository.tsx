import {FC, useState} from "react";
import {Button, Divider, Form, Input, List, Space, Typography} from "antd";
import {useMutation, useQuery} from "react-query";
import client from "../axios-client";
import ShowBranches from "./ShowBranches";

const CloneRepository: FC = () => {
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const {data} = useQuery(["repository"], () => client.get<string[]>("repositories"));
    const repos = data?.data ?? [];
    const {mutateAsync} = useMutation(["repository"], () => {
        return client.post("repositories/clone", {
            url, 
            path: name,
        });
    })
    
    const submit = async () => {
        await mutateAsync();
    }
    
    return <Form layout={"vertical"} onFinish={submit}>
        <Typography.Title>Repositories</Typography.Title>
        <List 
            bordered 
            dataSource={repos} 
            renderItem={x => (<List.Item key={x}>
                <Space size={"middle"}>
                    <Typography>{x}</Typography>
                    <ShowBranches repo={x} />
                </Space>
            </List.Item>)} 
        />
        <Divider />
        <Form.Item label={"Clone a Repository"}>
            <Input placeholder={"url"} value={url} onChange={x => setUrl(x.target.value)} />
        </Form.Item>
        <Form.Item label={"name"} >
            <Input placeholder={"repository/folder name"} value={name} onChange={x => setName(x.target.value)} /> 
        </Form.Item>
        <Button htmlType={"submit"} type={"primary"}>Clone</Button>
    </Form>
}

export default CloneRepository;