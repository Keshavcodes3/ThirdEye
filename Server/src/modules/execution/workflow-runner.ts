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

            const currentNode = this.workflow.nodes.find(
                (n: any) => n.id === currentNodeId
            );

            if (!currentNode) {
                throw new ApiError(404, "Node not found");
            }

            const output = await this.executeNode(currentNode);

            this.execution.context[currentNode.id] = output;

            if (currentNode.type === "end") {
                this.execution.status = "success";
                await this.execution.save();
                break;
            }

            const nextNodeId = this.getNextNode(currentNode.id);

            if (!nextNodeId) {
                this.execution.status = "success";
                await this.execution.save();
                break;
            }
            try {
                const startedAt = new Date();

                const output = await this.executeNode(currentNode);

                const finishedAt = new Date();

                this.execution.context[currentNode.id] = output;

                this.execution.logs.push({
                    nodeId: currentNode.id,
                    nodeType: currentNode.type,
                    status: "success",
                    startedAt,
                    finishedAt,
                    output
                });

            } catch (err: any) {
                const startedAt = new Date();

                this.execution.logs.push({
                    nodeId: currentNode.id,
                    nodeType: currentNode.type,
                    status: "failed",
                    startedAt,
                    finishedAt: new Date(),
                    error: err.message
                });

                this.execution.status = "failed";

                await this.execution.save();

                throw err;
            }
            this.execution.currentNode = nextNodeId;
            currentNodeId = nextNodeId;

            await this.execution.save();
        }

    }
    private getNextNode(nodeId: string) {
        const edge = this.workflow.edges.find(
            (edge: any) => edge.source === nodeId
        );

        if (!edge) return null;

        return edge.target;
    }

    private async executeNode(node: any) {
        switch (node.type) {
            case "start":
                //start karo node ko
                console.log('start')

                return "start"
                break
            case "browser":
                // open karo browser ko from given url
                console.log('fetching from ' + node.data.url)
                return node.data.url
                break
            case "scrap":
                //scrap karo given url ko
                console.log('scrapping from ' + node.data.url)
                return node.data.url
                break
            case "email":
                console.log('bhej diiyaa mail')
                return "mail sent"
                break
            //email bhejo jisme logged in hein
            case "end":
                console.log('khtanm')
                return "khtm"
                break
            //workflow end , Database mein save karo
            default:
                //rehne de
                console.log('rehne de')

        }

    }
}

export default workflowRunner