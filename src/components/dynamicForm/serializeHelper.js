export default function serialize(form) {


    // Setup our serialized data
    var serialized = [];

    // Loop through each field in the form
    for (var i = 0; i < form.elements.length; i++) {

        var field = form.elements[i];

        // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
        if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

        // If a multi-select, get all selections
        if (field.type === 'select-multiple') {
            serialized.push({name: field.name, value: [...field.selectedOptions].map(x => x.value) });
        }
        else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            serialized.push({ name: field.name, value: field.value });
        }
    }
    return JSON.stringify(serialized);
};