import './App.css'
import "antd/dist/antd.css";
import {QueryClient, QueryClientProvider, useQuery} from 'react-query';
import {AddCredentials} from "./components/AddCredentials";
import CloneRepository from "./components/CloneRepository";
import {Col, Divider, Row} from "antd";
import ShowBranches from "./components/ShowBranches";
import Terminal from "./components/Terminal";
import AddCommand from "./components/AddCommand";
import {useState} from "react";
import {atom, useAtom} from "jotai";

const queryClient = new QueryClient();

export const TerminalAtom = atom<string|null>(null);

function App() {
    const [terminal] = useAtom(TerminalAtom);
    
  return (
    <div className="App">
        <QueryClientProvider client={queryClient}>
            <Row justify={"space-evenly"} gutter={24}>
                <Col span={12}>
                    <AddCredentials />
                    <Divider />
                    <CloneRepository />
                    { terminal && <>                    
                        <Divider />
                        <AddCommand/>
                    </> }
                </Col>
                <Col span={12}>
                    {
                        terminal && <Terminal repo={terminal} />
                    }
                </Col>
            </Row>
            
        </QueryClientProvider>
    </div>
  )
}

export default App
