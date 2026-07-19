import { Resend } from "resend";
import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class EmailEngine implements IEngine {
    private resend = new Resend(process.env.RESEND_API_KEY);

    /** Replace {{variableName}} placeholders with values from context */
    private replaceVariables(text: string, context: Record<string, unknown>): string {
        return text.replace(/\{\{(.*?)\}\}/g, (_, key: string) => {
            const value = context[key.trim()];
            return value !== undefined ? String(value) : "";
        });
    }

    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ success: boolean; id?: string }> {
        const { to, subject, message } = node.data;

        const body = this.replaceVariables(message as string, context);

        const { data, error } = await this.resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: to as string | string[],
            subject: subject as string,
            text: body,
        });

        if (error) {
            throw new Error(`Email sending failed: ${error.message}`);
        }

        return {
            success: true,
            id: data?.id,
        };
    }
}

export default new EmailEngine();