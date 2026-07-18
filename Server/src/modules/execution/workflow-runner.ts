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
        }

        currentNodeId = this.getNextNode(currentNodeId)


    }
    private async getNextNode(nodeId: string) {
        const edge = this.workflow.edges.find((edge: any) => edge.source == nodeId)
        if (!edge) {
            throw new ApiError(400, "Edge not found")
        }
        return edge.target
    }

    private async executeNode(node: any) {
        const nodeType=node.type
        switch(nodeType){
            case "start" :
                //start karo node ko
            case "browser":
                // open karo browser ko from given url
            case "scrap":
                //scrap karo given url ko
            case "email":
                //email bhejo jisme logged in hein
            case "end":
                //workflow end , Database mein save karo
            default:
                //rehne de
            
        }

    }
}