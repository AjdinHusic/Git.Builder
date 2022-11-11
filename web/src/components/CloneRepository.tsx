import {FC, useState} from "react";
import {Button, Divider, Form, Input, List, Modal, Row, Space, Typography} from "antd";
import {FolderAddOutlined, VerticalLeftOutlined} from "@ant-design/icons";
import {useMutation, useQuery} from "react-query";
import client from "../axios-client";
import ShowBranches from "./ShowBranches";
import {useAtom} from "jotai";
import {TerminalAtom} from "../App";

const CloneRepository: FC = () => {
    const [,setTerminal] = useAtom(TerminalAtom);
    const [isOpen, setIsOpen] = useState(false);
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
        <Row justify={"center"}>
            <Button type={"primary"} icon={<FolderAddOutlined />} onClick={() => setIsOpen(true)}>Add Repo</Button>
        </Row>
        <List 
            bordered 
            dataSource={repos} 
            renderItem={x => (<List.Item key={x}>
                <Space size={"middle"}>
                    <Typography>{x}</Typography>
                    <ShowBranches repo={x} />
                    <Button.Group>
                        <Button icon={<VerticalLeftOutlined />} onClick={() => setTerminal(x)}>Terminal</Button>
                    </Button.Group>
                </Space>
            </List.Item>)} 
        />
        <Modal open={isOpen} onCancel={() => setIsOpen(false)} onOk={() => setIsOpen(false)} closeIcon={null}>
            <Form.Item label={"Clone a Repository"}>
                <Input placeholder={"url"} value={url} onChange={x => setUrl(x.target.value)} />
            </Form.Item>
            <Form.Item label={"name"} >
                <Input placeholder={"repository/folder name"} value={name} onChange={x => setName(x.target.value)} />
            </Form.Item>
            <Button htmlType={"submit"} type={"primary"}>Clone</Button>
        </Modal>
        
    </Form>
}

export default CloneRepository;