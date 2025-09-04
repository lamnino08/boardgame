class Log {
    // ANSI escape codes for colors
    private static FgRed = "\x1b[31m";
    private static FgGreen = "\x1b[32m";
    private static FgYellow = "\x1b[33m";
    private static FgBlue = "\x1b[34m";
    private static Reset = "\x1b[0m";

    private static log(color: string, filename: string, func: string, message: string): void {
        const filePart = `[${filename}]`;
        const funcPart = `(${func})`;
        console.log(`${color}${filePart} ${funcPart} ${message}${this.Reset}`);
    }

    public static info(filename: string, func: string, message: string): void {
        this.log(this.FgGreen, filename, func, message);
    }

    public static warn(filename: string, func: string, message: string): void {
        this.log(this.FgYellow, filename, func, message);
    }

    public static error(filename: string, func: string, message: string, error?: any): void {
        const errorMessage = error ? `${message} | Details: ${JSON.stringify(error)}` : message;
        this.log(this.FgRed, filename, func, errorMessage);
    }
    
    public static debug(filename: string, func: string, message: string): void {
        this.log(this.FgBlue, filename, func, message);
    }
}

export default Log;
