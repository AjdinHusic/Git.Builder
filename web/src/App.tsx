import './App.css'
import "antd/dist/antd.css";
import {QueryClient, QueryClientProvider} from 'react-query';
import {AddCredentials} from "./components/AddCredentials";
import CloneRepository from "./components/CloneRepository";
import {Divider} from "antd";
import ShowBranches from "./components/ShowBranches";
import Terminal from "./components/Terminal";

const queryClient = new QueryClient();


function App() {
  return (
    <div className="App">
        <QueryClientProvider client={queryClient}>
            <AddCredentials />
            <Divider />
            <CloneRepository />
            <Divider />
            <Terminal />
        </QueryClientProvider>
    </div>
  )
}

export default App
