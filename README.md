# ATE JEDI Readiness Assessment

A custom interactive JEDI readiness questionnaire built with HTML, CSS, and vanilla JavaScript.

## Project files

- `index.html` — assessment markup and content
- `styles.css` — visual styling
- `script.js` — questionnaire behavior, scoring, recommendations, and Dubsado submission trigger

## Run locally

Open `index.html` in a browser, or use the VS Code Live Server extension.

## Integration note

The Dubsado submission handler looks for Dubsado's native `.submit-form-button` element. That element is not present in a standalone local page, so the Dubsado submission step can only be tested inside the appropriate Dubsado form environment.

The service and consultation links in the results section still contain placeholder URLs and need to be replaced before deployment.

