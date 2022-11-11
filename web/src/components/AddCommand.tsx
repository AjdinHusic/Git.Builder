import {FC, useState} from "react";
import {Button, Col, Form, Input, List, Modal, Row, Spin, Typography} from "antd";
import {useMutation, useQuery} from "react-query";
import client from "../axios-client";
import {useAtom} from "jotai";
import {TerminalAtom} from "../App";
import {CodeOutlined, PlayCircleOutlined} from "@ant-design/icons";

interface CommandInfo {
    command: string;
    args: string[];
}

const AddCommand: FC = () => {
    const [command, setCommand] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [terminal] = useAtom(TerminalAtom);

    const {data, isLoading} = useQuery(["commands"], () => client.get<CommandInfo[]>("commands"));
    const commands = data?.data ?? [];
    const {mutateAsync, isLoading: isSubmitting} = useMutation(["commands"], () => {
        return client.post("commands", {
             command
        });
    });
    
    const submit = async () => {
        await mutateAsync();
        setCommand(command);
    }
    
    return <>
        <Typography.Title>Commands {terminal}</Typography.Title>
        <Row justify={"center"}>
            <Button type={"primary"} icon={<CodeOutlined />} onClick={() => setIsOpen(true)}>Add Command</Button>
        </Row>
        <Spin spinning={isLoading}>
            <List bordered dataSource={commands} renderItem={x => <List.Item>
                <Col>
                    <pre>{x.command}</pre>
                    <Input.Group>{x.args.map(i => <Form.Item label={i}><Input placeholder={i} /></Form.Item>)}</Input.Group>
                </Col>
                <Col>
                    <Button type={"ghost"}><PlayCircleOutlined /></Button>
                </Col>
            </List.Item>} />
        </Spin>
        <Modal open={isOpen} onCancel={() => setIsOpen(false)} onOk={() => setIsOpen(false)}>
            <Spin spinning={isSubmitting}>
                <Form layout={"vertical"} onFinish={submit}>
                    <Form.Item label={"Add Command, use {} for argument interpolation, .e.g. 'ping {host}'"}>
                        <Input placeholder={"command"} value={command} onChange={x => setCommand(x.target.value)}/>
                    </Form.Item>
                    <Button type={"primary"} htmlType={"submit"}>Save</Button>
                </Form>
            </Spin>
        </Modal>
    </>
}

export default AddCommand;