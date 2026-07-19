import { ApiError } from "../../../utils/ApiError.js";
import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class ExtractEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<unknown> {
        const selector = node.data.selector as string;
        const attribute = node.data.attribute as string;
        const page = runtimeContext.page;

        if (!page) {
            throw new ApiError(400, "Page not found in runtime context — run a Browser node first");
        }

        await page.waitForSelector(selector);

        if (attribute === "text") {
            return await page.$eval(
                selector,
                (el: Element) => el.textContent?.trim()
            );
        }

        return await page.$eval(
            selector,
            (el: Element, attr: string) => el.getAttribute(attr),
            attribute
        );
    }
}

const extractEngine = new ExtractEngine();

export default extractEngine;