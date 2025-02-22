class JSONFormatter {
    constructor(config) {
        this.inputElement = config.inputElement;
        this.outputElement = config.outputElement;

        this.INDENT = 4;
        this.LOCAL_STORAGE_KEY = "jsonInputString";
        this.DEBUG = false;

        // Code to run during mounting
        this.#loadFromLocalStorage();
        this.#saveToLocalStorage();
        this.#render()
    }

    #DEBUG_LOG(data, label="") {
        if(this.DEBUG) {
            console.log(`[${new Date().toISOString()}] ${label} : `, JSON.stringify(data, null, this.INDENT));
        }
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
        this.#DEBUG_LOG(jsonString, "INPUT JSON STRING")

        try {
            const parsed = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
            return this.#result(true, JSON.stringify(parsed, null, this.INDENT));
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

    #loadFromLocalStorage() {
        const savedJSON = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (savedJSON) {
            this.inputElement.value = savedJSON;
            this.#DEBUG_LOG(savedJSON, "CONTENT LOADED FROM LOCAL STORAGE")
        }
    }

    #saveToLocalStorage() {
        this.inputElement.addEventListener("input", () => {
            const jsonString = this.inputElement.value;
            localStorage.setItem(this.LOCAL_STORAGE_KEY, jsonString);
        });
    }

    #render() {
        const validateResponse = this.#validate();
        this.#DEBUG_LOG(validateResponse, "VALIDATE RESPONSE")

        if(validateResponse.status) {
            this.outputElement.innerHTML = this.#syntaxHighlight(validateResponse.data);
        } else {
            this.outputElement.innerHTML = `<span class="json-error">${validateResponse.message}</span>`;
        }
    }

    init() {
        this.inputElement.addEventListener("input", () => {
            this.#render();
        });
    }
}