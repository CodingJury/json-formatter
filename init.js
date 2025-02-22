
const jsonFormatter = new JSONFormatter({
    inputElement: document.getElementById('jsonInput'),
    outputElement: document.getElementById('jsonOutput')
});

function onTextAreaInputChange() {
    jsonFormatter.render()
}
