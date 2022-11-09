import {FC, useState} from "react";
import {Badge, Button, Select, Spin} from "antd";
import {useMutation, useQuery, useQueryClient} from "react-query";
import client from "../axios-client";

interface BranchInfo {
    name: string|null;
    behindBy: number|null;
    aheadBy: number|null;
}

interface RepositoryInfo {
    currentBranch: BranchInfo;
    branches: string[];
}

interface ShowBranchesProps {
    repo: string;
}

const ShowBranches: FC<ShowBranchesProps> = ({repo}) => {

    const queryClient = useQueryClient();
    const {data} = useQuery(['branches', repo], () => client.get<RepositoryInfo>(`repositories/${repo}/branches`), {
        onSuccess(data) {
            setSelectedBranch(data?.data.currentBranch.name);
        }
    });
    
    const {mutateAsync, isLoading} = useMutation(['branches'], () => {
        return client.post("repositories/checkout", {
            repo,
            branch: selectedBranch
        })
    }, {
        async onSuccess() {
            await queryClient.invalidateQueries(['branches']);
        }
    })
    
    const onCheckout = async () => {
        await mutateAsync();
    }
    
    const branches = data?.data.branches ?? [];
    const currentBranch = data?.data.currentBranch;
    const [selectedBranch, setSelectedBranch] = useState<string|null|undefined>(currentBranch?.name);
    
    return <Spin spinning={isLoading}>
        <Select 
            onChange={x => setSelectedBranch(x)}
            value={selectedBranch}
            showSearch
            options={branches.map(x => ({label: x, key: x, value: x}))} 
            style={{minWidth: 250}} 
            dropdownMatchSelectWidth 
        />
        <Button disabled={selectedBranch === currentBranch?.name} onClick={onCheckout}>checkout</Button>
        <Button 
            icon={<Badge
                         style={{marginRight: 4, alignSelf: "center", background: currentBranch?.behindBy ?? 0 > 0  ? "red" : "#33cc33"}}
                         count={currentBranch?.behindBy ?? 0} 
                         showZero 
                         title={"behind by"}/>} > 
            pull
        </Button>

    </Spin>
}

export default ShowBranches;