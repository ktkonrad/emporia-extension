# Emporia Energy Data Exporter Extension

This is a Chrome extension that adds a button to the [Emporia Energy web app](https://web.emporiaenergy.com/) to make it easier to export your energy usage data.

## Features

*   **Export All Device Data:** Adds a button to the Emporia web app that iterates through all of your devices and triggers a data export for each one.
*   **Email-Based Export:** The extension uses the same export functionality as the website, which sends an email with a download link for the CSV file for each device.

## Installation

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked" and select the directory where you saved the extension files.

## Usage

1.  Log in to the [Emporia Energy web app](https://web.emporiaenergy.com/).
2.  A new button with the text "📥 Export All CSVs" will appear in the bottom right corner of the page.
3.  Click this button to start the export process. The extension will request the data for each of your devices.
4.  You will receive a separate email from Emporia for each device, containing a link to download your data as a CSV file.

## Files

*   `manifest.json`: The extension's manifest file.
*   `background.js`: A background script (currently not used for any major functionality).
*   `content.js`: The main script that injects the button and handles the API requests to trigger the exports.
