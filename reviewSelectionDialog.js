// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ChoicePrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');

const REVIEW_SELECTION_DIALOG = 'REVIEW_SELECTION_DIALOG';

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class ReviewSelectionDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_SELECTION_DIALOG);

        // Define a "done" response for the company selection prompt.
        this.doneOption = 'salir';

        // Define value names for values tracked inside the dialogs.
        this.companiesSelected = 'value-companiesSelected';

        // Define the company choices for the company selection prompt.
        this.companyOptions = ['¿Que es un credito de consumo?', '¿Que es un micro credito?', '¿Que es un credito PYME?', '¿Que es un credito empresarial?','¿Que es el credito de vivienda?'];

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.selectionStep.bind(this),
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async selectionStep(stepContext) {
        // Continue using the same selection list, if any, from the previous iteration of this dialog.
        const list = Array.isArray(stepContext.options) ? stepContext.options : [];
        stepContext.values[this.companiesSelected] = list;

        // Create a prompt message.
        let message = '';
        if (list.length === 0) {
            message = `por favor seleccione una nueva opcion, o \`${ this.doneOption }\` para filnalizar.`;
        } else {
            message = `usted ha seleccionado **${ list[0] }**. y adicionalmente ha seleccionado el sercivio \`${ this.doneOption }\` este programa se acabo.`;
        }

        // Create the list of options to choose from.
        const options = list.length > 0
            ? this.companyOptions.filter(function(item) { return item !== list[0]; })
            : this.companyOptions.slice();
        options.push(this.doneOption);

        // Prompt the user for a choice.
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: message,
            retryPrompt: 'Por favor sellecione una opcion de la lista.',
            choices: options
        });
    }

    async loopStep(stepContext) {
        // Retrieve their selection list, the choice they made, and whether they chose to finish.
        const list = stepContext.values[this.companiesSelected];
        const choice = stepContext.result;
        const done = choice.value === this.doneOption;

        if (!done) {
            // If they chose a company, add it to the list.
            list.push(choice.value);
        }

        if (done || list.length > 1) {
            // If they're done, exit and return their list.
            return await stepContext.endDialog(list);
        } else {
            // Otherwise, repeat this dialog, passing in the list from this iteration.
            return await stepContext.replaceDialog(REVIEW_SELECTION_DIALOG, list);
        }
    }
}

module.exports.ReviewSelectionDialog = ReviewSelectionDialog;
module.exports.REVIEW_SELECTION_DIALOG = REVIEW_SELECTION_DIALOG;
