import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    TextField,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { parse, unparse } from 'papaparse';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DownloadIcon from '@mui/icons-material/Download';

const UploadPage = () => {
    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [mapping, setMapping] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [databaseSchema, setDatabaseSchema] = useState([]);
    const [databaseColumns, setDatabaseColumns] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const parsedData = parse(reader.result, { header: true }).data;
            setCsvData(parsedData);
            setCsvHeaders(Object.keys(parsedData[0]));
            setMapping(databaseColumns.map((dbColumn) => ({ dbColumn, csvColumns: '', action: 'normal' })));
        };
        reader.readAsText(file);
    };

    const handleDownloadCSV = () => {
        const csvContent = unparse(previewData, { header: true });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'preview_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddMapping = () => {
        setMapping((prevMapping) => [...prevMapping, { dbColumn: '', csvColumns: '', action: 'normal' }]);
    };

    const handleRemoveMapping = (index) => {
        setMapping((prevMapping) => prevMapping.filter((_, i) => i !== index));
    };

    const handleMappingChange = (index, field, value) => {
        setMapping((prevMapping) => {
            const updatedMapping = [...prevMapping];
            updatedMapping[index][field] = value;
            return updatedMapping;
        });
    };

    const handlePreviewClick = () => {
        const mappedData = csvData.flatMap((row) => {
            const separateColumns = mapping
                .filter(({ action }) => action === 'separate')
                .map(({ dbColumn, csvColumns }) => ({
                    dbColumn,
                    values: csvColumns.split(',').map((column) => row[column.trim()]),
                }));

            const combinedColumns = mapping
                .filter(({ action }) => action === 'combine')
                .map(({ dbColumn, csvColumns }) => ({
                    dbColumn,
                    value: csvColumns
                        .split(',')
                        .map((column) => column.trim())
                        .map((column) => row[column])
                        .join(' '),
                }));

            const normalColumns = mapping
                .filter(({ action }) => action === 'normal')
                .map(({ dbColumn, csvColumns }) => ({
                    dbColumn,
                    value: row[csvColumns.split(',').map((column) => column.trim())[0]],
                }));

            if (separateColumns.length === 0) {
                const mappedRow = {};
                combinedColumns.forEach(({ dbColumn, value }) => {
                    mappedRow[dbColumn] = value;
                });
                normalColumns.forEach(({ dbColumn, value }) => {
                    mappedRow[dbColumn] = value;
                });
                return { ...mappedRow, id: Object.values(mappedRow).join('-') };
            } else {
                const separateRows = separateColumns.reduce(
                    (rows, { dbColumn, values }) =>
                        values.flatMap((value) =>
                            rows.map((row) => ({ ...row, [dbColumn]: value }))
                        ),
                    [{}]
                );

                return separateRows.map((separateRow) => {
                    const mappedRow = {};
                    combinedColumns.forEach(({ dbColumn, value }) => {
                        mappedRow[dbColumn] = value;
                    });
                    normalColumns.forEach(({ dbColumn, value }) => {
                        mappedRow[dbColumn] = value;
                    });
                    return {
                        ...separateRow,
                        ...mappedRow,
                        id: Object.values({ ...separateRow, ...mappedRow }).join('-'),
                    };
                });
            }
        });

        setPreviewData(mappedData);
    };

    const columns = databaseColumns.map((column) => ({
        field: column,
        headerName: column,
        width: 200,
    }));

    return (
        <Container maxWidth="lg">
            <Box mt={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    CSV Uploader
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" component="label">
                        Choose File
                        <input type="file" accept=".csv" onChange={handleFileUpload} hidden />
                    </Button>
                </Grid>
                {csvHeaders.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6">CSV Columns</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        {csvHeaders.map((header) => (
                                            <TableCell key={header}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                )}
                {csvHeaders.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6">Database Schema</Typography>
                        <TextField
                            label="Enter database schema (comma-separated)"
                            fullWidth
                            onChange={(event) => {
                                const schema = event.target.value.split(',').map((column) => column.trim());
                                setDatabaseSchema(schema);
                                setDatabaseColumns(schema);
                                setMapping(schema.map((dbColumn) => ({ dbColumn, csvColumns: '', action: 'normal' })));
                            }}
                        />
                    </Grid>
                )}
                {csvHeaders.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6">Mapping</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Database Column</TableCell>
                                        <TableCell>CSV Column(s)</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Remove</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mapping.map((mappingItem, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel id={`dbColumn-label-${index}`}>Select Database Column</InputLabel>
                                                    <Select
                                                        labelId={`dbColumn-label-${index}`}
                                                        value={mappingItem.dbColumn}
                                                        onChange={(event) => handleMappingChange(index, 'dbColumn', event.target.value)}
                                                        label="Select Database Column"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select Database Column</em>
                                                        </MenuItem>
                                                        {databaseColumns.map((column) => (
                                                            <MenuItem key={column} value={column}>
                                                                {column}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={mappingItem.csvColumns}
                                                    onChange={(event) => handleMappingChange(index, 'csvColumns', event.target.value)}
                                                    placeholder="Enter CSV columns (comma-separated)"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel id={`action-label-${index}`}>Action</InputLabel>
                                                    <Select
                                                        labelId={`action-label-${index}`}
                                                        value={mappingItem.action}
                                                        onChange={(event) => handleMappingChange(index, 'action', event.target.value)}
                                                        label="Action"
                                                    >
                                                        <MenuItem value="normal">Normal</MenuItem>
                                                        <MenuItem value="combine">Combine</MenuItem>
                                                        <MenuItem value="separate">Separate</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Remove Mapping">
                                                    <IconButton onClick={() => handleRemoveMapping(index)} disabled={mapping.length === 1}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={2}>
                            <Button variant="contained" onClick={handleAddMapping} startIcon={<AddIcon />}>
                                Add Mapping
                            </Button>
                        </Box>
                    </Grid>
                )}
                {csvHeaders.length > 0 && (
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handlePreviewClick}>
                            Preview
                        </Button>
                    </Grid>
                )}
                {previewData.length > 0 && (
                    <Grid item xs={12}>
                        <Paper>
                            <DataGrid rows={previewData} columns={columns} pageSize={5} autoHeight />
                        </Paper>
                        <Box mt={2} mb={2}>
                            <Button variant="contained" onClick={handleDownloadCSV} startIcon={<DownloadIcon />}>
                                Download CSV
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default UploadPage;