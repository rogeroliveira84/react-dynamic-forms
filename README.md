# ReactDynamicForms.js

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rogeroliveira84/react-dynamic-forms/blob/master/LICENSE) [![Build Status](https://travis-ci.com/rogeroliveira84/react-dynamic-forms.svg?branch=master)](https://travis-ci.com/rogeroliveira84/react-dynamic-forms) [![CircleCI Status](https://circleci.com/gh/rogeroliveira84/react-dynamic-forms.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/rogeroliveira84/react-dynamic-forms) [![npm version](https://badge.fury.io/js/%40rogeroliveira84%2Freact-dynamic-forms.svg)](https://badge.fury.io/js/%40rogeroliveira84%2Freact-dynamic-forms) ![GitHub contributors](https://img.shields.io/github/contributors/rogeroliveira84/react-dynamic-forms.svg?color=orange) ![npm](https://img.shields.io/npm/dt/@rogeroliveira84/react-dynamic-forms.svg?color=blue)

A [react](https://reactjs.org/) component to create dynamic forms based on a config.json

## Demo online [react-dynamic-forms on heroku](https://react-dynamic-forms.herokuapp.com/)

## Install

```bash
npm install --save @rogeroliveira84/react-dynamic-forms
```

## How to use

* Use the react component call below:

![howToUse](https://raw.githubusercontent.com/rogeroliveira84/react-dynamic-forms/master/.github/screenshot2.png)

* The "configData" is a javaScript object that defines the form fields to be dynamically created:

```javascript
const configData = {
    "name": "Client Register",
    "fields": [
        {
            "id": "fullname",
            "label": "Full Name",
            "description": "The full name of the client",
            "type": "text",
            "value": "",
            "required": "true",
            "placeholder": "Type your full name...",
            "definition": {
                "maxlength": "5"
            },
            "defaultValue": ""
        },
        {
            "id": "dateOfBirth",
            "label": "Date Of Birth",
            "description": "",
            "type": "date",
            "value": "",
            "required": "false",
            "placeholder": "",
            "defaultValue": ""
        },
        {
            "id": "favorityFruits",
            "label": "Favorite Fruits",
            "description": "",
            "type": "array",
            "value": "",
            "required": "false",
            "placeholder": "",
            "definition": {
                "options": [
                    {
                        "id": 1,
                        "display": "Apple"
                    },
                    {
                        "id": 2,
                        "display": "Banana"
                    },
                    {
                        "id": 3,
                        "display": "Watermelon"
                    }
                ]
            },
            "defaultValue": ""
        }
    ]
}
```

## Rendered Form
![renderedForm](https://raw.githubusercontent.com/rogeroliveira84/react-dynamic-forms/master/.github/screenshot1.png)


## Output JSON

```json
{
    "timeStamp": 1551747768847,
    "data": [
        {
            "name": "fullname",
            "value": "My name"
        },
        {
            "name": "dateOfBirth",
            "value": "1980-01-01"
        },
        {
            "name": "favorityFruits",
            "value": "1"
        }
    ]
}
```
  

## Roadmap

### Version 0.4.0 

- :white_check_mark: 1.1 - Define the dynamic-form-config: able to mount the forms from it
- :white_check_mark: 1.2 - Add form
- :white_check_mark: 1.3 - Add caption and description to the inputs
- :white_check_mark: 1.4 - Add input component types: text, number
- :white_check_mark: 1.5 - Add onSubmit method prop
- :white_check_mark: 1.6 - Add input component types: date (html5), datetime (html5), time (html5)
- :white_check_mark: 1.7 - Add styles to the component

### Version 0.5.0

- :white_check_mark: 2.1 - Add dropbox component
- :white_check_mark: 2.2 - Add more options to the inputs: required, placeholder

### Version 0.6.0

- 3.1 - Add dynamic table type
- 3.2 - Add CRUD to values of table type

### License

ReactDynamicForms is [MIT licensed](./LICENSE).
