class JSONFormatter {
    constructor(config) {
        this.inputElement = config.inputElement;
        this.outputElement = config.outputElement;
        this.indent = 4
    }

    #result(status, dataOrMessage) {
        const result = {status: true};
        if(status) {
            result.data = dataOrMessage;
        } else {
            result.status = false
            result.message = dataOrMessage;
        }
        return result;
    }

    #validate() {
        const jsonString = this.inputElement.value;
        try {
            const parsed = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
            return this.#result(true, JSON.stringify(parsed, null, this.indent));
        } catch (error) {
            return this.#result(false, `Invalid JSON: ${error.message}`);
        }
    }

    #syntaxHighlight(json) {
        // Escape special characters for HTML safety
        const escaped = json
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Process each line separately for highlighting
        return escaped.split("\n").map(line => {
            return line.replace(/"(.*?)":|"(.*?)"|(\b\d+(\.\d+)?\b)|\b(true|false)\b|\b(null)\b/g, 
                (match, key, string, number, decimal, boolean, jsonNull) => {
                    if (key) return `<span class="json-key">"${key}"</span>:`;
                    if (string) return `<span class="json-string">"${string}"</span>`;
                    if (number) return `<span class="json-number">${number}</span>`;
                    if (boolean) return `<span class="json-boolean">${boolean}</span>`;
                    if (jsonNull) return `<span class="json-null">${jsonNull}</span>`;
                    return match;
                }
            );
        }).join("\n"); // Join lines back into formatted JSON string
    }

    render() {
        const validateResponse = this.#validate();
        if(validateResponse.status) {
            this.outputElement.innerHTML = this.#syntaxHighlight(validateResponse.data);
        } else {
            this.outputElement.innerHTML = `<span class="json-error">${validateResponse.message}</span>`;
        }
    }
}