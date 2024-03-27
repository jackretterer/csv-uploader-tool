# CSV Uploader Tool

The CSV Uploader Tool is a user-friendly web application that allows you to map data from a CSV file to a database schema and preview the resulting data. It provides a simple and intuitive interface for specifying the mapping between CSV columns and database columns, with options to combine, separate, or map columns normally.

## Features

- Upload a CSV file and view its columns
- Enter a database schema (comma-separated) to define the target structure
- Map CSV columns to database columns using a user-friendly interface
- Choose the mapping action for each column: Combine, Separate, or Normal
- Preview the mapped data in a table format
- Download the preview data as a CSV file

## Getting Started

To run the CSV Uploader Tool locally, follow these steps:

1. Clone the repository: 

### `git clone https://github.com/jack-retterer/csv-uploader-tool.git`

2. Navigate to the project directory:

### `cd csv-uploader-tool`

3. Install the dependencies:

### `npm install`

4. Start the development server:

### `npm start`
5. Open your browser and visit `http://localhost:3000` to view the application.

## Usage

1. Click the "Choose File" button to select a CSV file from your local machine.

2. Once the file is uploaded, the CSV columns will be displayed in the "CSV Columns" section.

3. In the "Database Schema" section, enter the desired database schema as comma-separated values (e.g., "Name, Class, School, Location").

4. The "Mapping" section will appear, allowing you to map the CSV columns to the corresponding database columns.

5. For each mapping row:
- Select the desired database column from the dropdown menu.
- Enter the CSV column(s) you want to map to the selected database column. If mapping multiple columns, separate them with commas.
- Choose the appropriate mapping action: Combine, Separate, or Normal.
- Selecting "Combine" will combine the specified columns into a single column in the preview.
- Selecting "Separate" will separate the specified columns into multiple rows in the preview.
- Selecting "Normal" will not do anything. The columns will be included normally.
- Click the "Add Mapping" button to add additional mapping rows if needed.

6. Once you have specified all the mappings, click the "Preview" button to generate a preview of the mapped data.

7. The preview will be displayed in a table format, showing the resulting data based on your mapping configuration.

8. If you want to download the preview data as a CSV file, click the "Download CSV" button.

## Technologies Used

- React
- Material-UI
- PapaParse
