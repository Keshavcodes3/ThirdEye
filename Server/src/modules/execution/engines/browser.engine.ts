import puppeteer from "puppeteer-core";
import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class BrowserEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ url: string }> {
        const executablePath =
            process.env.CHROME_PATH ||
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

        let browser;
        try {
            browser = await puppeteer.launch({
                executablePath,
                headless: (node.data.headless as boolean | "shell") ?? true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                ],
            });
        } catch (launchError) {
            const message =
                launchError instanceof Error ? launchError.message : String(launchError);
            throw new Error(
                `Failed to launch Chrome at "${executablePath}": ${message}`
            );
        }

        try {
            const page = await browser.newPage();

            await page.setViewport({
                width: 1366,
                height: 768,
            });

            await page.goto(node.data.url as string, {
                waitUntil: "networkidle2",
                timeout: 60000,
            });
            runtimeContext.browser = browser;
            runtimeContext.page = page;

            return {
                url: node.data.url as string,
            };
        } catch (error) {
            await browser.close();
            throw error;
        }
    }
}

const browserEngine = new BrowserEngine();

export default browserEngine;