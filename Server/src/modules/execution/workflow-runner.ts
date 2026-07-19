import { ApiError } from "../../utils/ApiError.js";

class workflowRunner {
    private workflow: any;
    private execution: any;
    constructor(workflow: any, execution: any) {
        this.workflow = workflow;
        this.execution = execution;
    }
    async run() {
        let currentNodeId = this.execution.currentNode;
        while (currentNodeId) {
            let currentNode = this.workflow.nodes.find((node: any) => node.id == currentNodeId)
            if (!currentNode) throw new ApiError(400, "current node not found")
            const output=await this.executeNode(currentNode)
            this.execution.context[currentNode.id]=output
            await this.execution.save()
            currentNodeId = this.getNextNode(currentNodeId)
            if(currentNode.type=="end"){
                return "end";
            }
        }

    }
    private async getNextNode(nodeId: string) {
        const edge = this.workflow.edges.find((edge: any) => edge.source == nodeId)
        if (!edge) {
            throw new ApiError(400, "Edge not found")
        }
        return edge.target
    }

    private async executeNode(node: any) {
        switch(node.type){
            case "start" :
                //start karo node ko
                console.log('start')
            case "browser":
                // open karo browser ko from given url
                console.log('fetching from ' + node.data.url)
            case "scrap":
                //scrap karo given url ko
                console.log('scrapping from '+node.data.url)
            case "email":
                console.log('bhej diiyaa mail')
                //email bhejo jisme logged in hein
            case "end":
                console.log('khtanm')
                //workflow end , Database mein save karo
            default:
                //rehne de
                console.log('rehne de')
            
        }

    }
}

export default workflowRunner