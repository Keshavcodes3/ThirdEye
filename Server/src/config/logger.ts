class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    info(message: string, ...meta: unknown[]): void {
        console.log(
            `[${this.getTimestamp()}] [INFO] ${message}`,
            ...meta
        );
    }

    success(message: string, ...meta: unknown[]): void {
        console.log(
            `[${this.getTimestamp()}] [SUCCESS] ${message}`,
            ...meta
        );
    }

    warn(message: string, ...meta: unknown[]): void {
        console.warn(
            `[${this.getTimestamp()}] [WARN] ${message}`,
            ...meta
        );
    }

    error(message: string, ...meta: unknown[]): void {
        console.error(
            `[${this.getTimestamp()}] [ERROR] ${message}`,
            ...meta
        );
    }

    debug(message: string, ...meta: unknown[]): void {
        if (process.env.NODE_ENV !== "production") {
            console.debug(
                `[${this.getTimestamp()}] [DEBUG] ${message}`,
                ...meta
            );
        }
    }
}

export const logger = new Logger();