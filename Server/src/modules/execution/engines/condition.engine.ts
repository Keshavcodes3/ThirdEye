import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class ConditionEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<boolean> {
        // Read the previous node's output from context
        const input = context.previous;
        const left =
            typeof input === "object" && input !== null && "value" in input
                ? (input as Record<string, unknown>).value
                : input;

        const right = node.data.value;
        const operator = node.data.operator as string;

        switch (operator) {
            case "<":
                return (left as number) < (right as number);

            case ">":
                return (left as number) > (right as number);

            case "<=":
                return (left as number) <= (right as number);

            case ">=":
                return (left as number) >= (right as number);

            case "==":
                // eslint-disable-next-line eqeqeq
                return left == right;

            case "!=":
                // eslint-disable-next-line eqeqeq
                return left != right;

            case "===":
                return left === right;

            case "!==":
                return left !== right;

            case "contains":
                return String(left).includes(String(right));

            case "startsWith":
                return String(left).startsWith(String(right));

            case "endsWith":
                return String(left).endsWith(String(right));

            default:
                throw new Error(`Unsupported condition operator: "${operator}"`);
        }
    }
}

const conditionEngine = new ConditionEngine();

export default conditionEngine;