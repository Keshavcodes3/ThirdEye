import type { IEngine } from "./engines/engine.interface.js";
import browserEngine from "./engines/browser.engine.js";
import startEngine from "./engines/start.engine.js";
import extractEngine from "./engines/extract.engine.js";
import conditionEngine from "./engines/condition.engine.js";
import emailEngine from "./engines/email.engine.js";
import endEngine from "./engines/end.engine.js";
import webhookEngine from "./engines/webhook.engine.js";
import cronEngine from "./engines/cron.engine.js";

class EngineFactory {
    private engines: Record<string, IEngine> = {
        start: startEngine,
        browser: browserEngine,
        extract: extractEngine,
        condition: conditionEngine,
        email: emailEngine,
        end: endEngine,
        webhook: webhookEngine,
        cron: cronEngine,
    };

    get(type: string): IEngine {
        const engine = this.engines[type];

        if (!engine) {
            throw new Error(`Engine not found for node type: ${type}`);
        }

        return engine;
    }
}

export default new EngineFactory();