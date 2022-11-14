import "./App.css";
import "antd/dist/antd.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Credentials from "./components/Credentials";
import Repositories from "./components/Repositories";
import { Col, Divider, Row } from "antd";
import Terminal from "./components/Terminal";
import Commands from "./components/Commands";
import { atom, useAtom } from "jotai";

const queryClient = new QueryClient();

export const TerminalAtom = atom<string | null>(null);

function App() {
  const [terminal] = useAtom(TerminalAtom);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Row justify={"space-evenly"} gutter={24}>
          <Col span={12}>
            <Credentials />
            <Divider orientationMargin={0} />
            <Repositories />
            {terminal && (
              <>
                <Divider />
                <Commands />
              </>
            )}
          </Col>
          <Col span={12}>{terminal && <Terminal repo={terminal} />}</Col>
        </Row>
      </QueryClientProvider>
    </div>
  );
}

export default App;
