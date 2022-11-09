import './App.css'
import "antd/dist/antd.css";
import {QueryClient, QueryClientProvider} from 'react-query';
import {AddCredentials} from "./components/AddCredentials";
import CloneRepository from "./components/CloneRepository";
import {Col, Divider, Row} from "antd";
import ShowBranches from "./components/ShowBranches";
import Terminal from "./components/Terminal";

const queryClient = new QueryClient();


function App() {
  return (
    <div className="App">
        <QueryClientProvider client={queryClient}>
            <Row justify={"space-evenly"} gutter={24}>
                <Col span={12}>
                    <AddCredentials />
                    <Divider />
                    <CloneRepository />
                    <Divider />
                </Col>
                <Col span={12}>
                    <Terminal />
                </Col>
            </Row>
            
        </QueryClientProvider>
    </div>
  )
}

export default App
