import React, { useState, useRef, useCallback } from 'react';
import Papa from 'papaparse';

const CSVuploader = () => {
    const [csvData, setCsvData] = useState([]);
    const [sqlStatements, setSqlStatements] = useState([]);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showSql, setShowSql] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    
    const [config, setConfig] = useState({
        batchSize: 100
    });

    const fileInputRef = useRef(null);

    const showStatus = useCallback((message, type) => {
        setStatus({ message, type });
    }, []);

    const handleConfigChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
        handleFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showStatus('Please select a CSV file.', 'error');
        return;
    }

    setIsLoading(true);
    showStatus('Parsing CSV file...', 'info');

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => {
        // Clean and normalize headers
        return header.trim().toLowerCase().replace(/\s+/g, '_');
        },
        delimiter: ',', // Explicitly set delimiter
        quoteChar: '"',
        escapeChar: '"',
        comments: false,
        complete: function(results) {
        console.log('Parse results:', results); // Debug log
        
        if (results.errors.length > 0) {
            console.error('Parse errors:', results.errors);
            showStatus('Error parsing CSV: ' + results.errors[0].message, 'error');
            setIsLoading(false);
            return;
        }

        if (!results.data || results.data.length === 0) {
            showStatus('No data found in CSV file.', 'error');
            setIsLoading(false);
            return;
        }

        // Check if we have proper headers
        const firstRow = results.data[0];
        if (!firstRow || Object.keys(firstRow).length === 0) {
            showStatus('Invalid CSV format: No headers detected.', 'error');
            setIsLoading(false);
            return;
        }

        // Clean headers and data
        const cleanedData = results.data.map(row => {
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
            });
            return cleanedRow;
        }).filter(row => {
            // Remove empty rows
            return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
        });

        if (cleanedData.length === 0) {
            showStatus('No valid data rows found in CSV.', 'error');
            setIsLoading(false);
            return;
        }

        setCsvData(cleanedData);
        showStatus(`Successfully parsed ${cleanedData.length} rows.`, 'success');
        setShowPreview(true);
        setShowConfig(true);
        setIsLoading(false);
        },
        error: function(error) {
        console.error('Papa Parse error:', error);
        showStatus('Error parsing CSV: ' + error.message, 'error');
        setIsLoading(false);
        }
    });
    };

    const generateSQL = () => {
        if (csvData.length === 0) {
        showStatus('No data to generate SQL for.', 'error');
        return;
        }

        showStatus('Generating SQL statements...', 'info');
        const statements = [];

        for (let i = 0; i < csvData.length; i += config.batchSize) {
        const batch = csvData.slice(i, i + config.batchSize);
        const batchSQL = generateBatchSQL(batch);
        statements.push(batchSQL);
        }

        setSqlStatements(statements);
        setShowSql(true);
        showStatus(`Generated ${statements.length} SQL batch statements for ${csvData.length} records.`, 'success');
    };

    const generateBatchSQL = (batch) => {
        if (batch.length === 0) return '';

        const headers = Object.keys(batch[0]);
        
        // Map CSV headers to database columns
        const columnMapping = {
            'product_id': 'prodEid',
            'prname': 'prName', 
            'name': 'prName',
            'product_name': 'prName',
            'description': 'description',
            'colors': 'colors',
            'color': 'colors',
            'pics': 'pics',
            'images': 'pics',
            'image_urls': 'pics',
            'pictures': 'pics',
            'prc': 'prc',
            'price': 'prc',
            'sku': 'spc',
            'spc': 'spc'
        };

        const dbColumns = [];
        const csvToDbMap = {};

        headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (columnMapping[lowerHeader]) {
            dbColumns.push(columnMapping[lowerHeader]);
            csvToDbMap[header] = columnMapping[lowerHeader];
        } else if (lowerHeader === 'id') {
            // Skip ID column as it's auto-increment
        } else {
            // Use original header if no mapping found
            dbColumns.push(header);
            csvToDbMap[header] = header;
        }
        });

        if (dbColumns.length === 0) {
        return '-- No valid columns found in CSV';
        }

        let sql = `INSERT INTO products (${dbColumns.join(', ')}) VALUES\n`;
        
        const values = batch.map(row => {
        const rowValues = dbColumns.map(dbCol => {
            const csvCol = Object.keys(csvToDbMap).find(k => csvToDbMap[k] === dbCol);
            let value = row[csvCol];
            
            if (value === null || value === undefined || value === '') {
            return 'NULL';
            }
            
            if (typeof value === 'number') {
            return value;
            }
            
            // Escape single quotes in strings
            return `'${String(value).replace(/'/g, "''")}'`;
        });
        
        return `(${rowValues.join(', ')})`;
        });

        sql += values.join(',\n') + ';';
        return sql;
    };

    const downloadSQL = () => {
        const fullSQL = sqlStatements.join('\n\n');
        const blob = new Blob([fullSQL], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products_insert.sql';
        a.click();
        URL.revokeObjectURL(url);
    };

    const uploadToD1 = async () => {
        if (sqlStatements.length === 0) {
        showStatus('Please generate SQL statements first.', 'error');
        return;
        }

        setIsLoading(true);
        showStatus('Uploading to Cloudflare D1...', 'info');
        setProgress(0);
        
        let completed = 0;

        try {
        for (let i = 0; i < sqlStatements.length; i++) {
            const response = await fetch('/api/csvUploader', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sql: sqlStatements[i]
            })
            });

            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
            }

            completed++;
            const progressValue = (completed / sqlStatements.length) * 100;
            setProgress(progressValue);
        }

        showStatus(`Successfully uploaded ${csvData.length} records to D1 database!`, 'success');
        
        } catch (error) {
        showStatus(`Upload failed: ${error.message}`, 'error');
        } finally {
        setIsLoading(false);
        setTimeout(() => {
            setProgress(0);
        }, 2000);
        }
    };

    const PreviewTable = () => {
        if (csvData.length === 0) return null;

        const headers = Object.keys(csvData[0]);
        const previewData = csvData.slice(0, 5);

        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead>
                    <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    {headers.map((header, index) => (
                        <th key={index} className="px-4 py-3 text-left font-semibold">
                        {header}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                        {headers.map((header, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 border-b border-gray-200">
                            {String(row[header] || '').substring(0, 50)}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        );
    };

    const StatusAlert = () => {
        if (!status.message) return null;

        const statusClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
        };

        return (
        <div className={`p-4 rounded-lg border font-semibold mb-6 ${statusClasses[status.type]}`}>
            {status.message}
        </div>
        );
    };

    return (
        <div className="max-w-6xl mt-8 mx-auto border-t-2 bg-gray-100 rounded-2 overflow-hidden">
            {/* Header */}
            {/*<div className="bg-cetera-gray text-white p-8 text-center">
                <h1 className="text-4xl font-bold mb-3">📊 CSV to D1 Database Uploader</h1>
                <p className="text-lg opacity-90">Upload your CSV files and generate SQL INSERT statements for Cloudflare D1</p>
            </div>*/}

            <div className="p-2">
                {/* Upload Section */}
                <div className="mb-0">
                    <div 
                        className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragOver 
                            ? 'border-cetera-orange bg-indigo-50' 
                            : 'border-gray-300 bg-gray-100 hover:border-cetera-orange hover:bg-gray-100'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {/*<div className="text-6xl mb-4">📁</div>*/}
                        <div className="text-xl text-gray-600 mb-6">Drop your CSV file here or click to browse</div>
                        <button 
                        className="bg-cetera-dark-blue text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        disabled={isLoading}
                        >
                        {isLoading ? 'Processing...' : 'Choose File'}
                        </button>
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        />
                    </div>
                </div>

                {/* Configuration Section */}
                {showConfig && (
                <div className="bg-gray-300 p-8 rounded-2xl mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">⚙️ Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Size</label>
                        <input
                        type="number"
                        value={config.batchSize}
                        onChange={(e) => handleConfigChange('batchSize', parseInt(e.target.value))}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        min="1"
                        max="1000"
                        />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <div className="bg-blue-100 p-4 rounded-lg">
                        <p><strong>Database:</strong> cetera-sandbox-db</p>
                        <p><strong>Connection:</strong> Via API Route</p>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                {/* Status */}
                <StatusAlert />

                {/* Progress Bar */}
                {isLoading && progress > 0 && (
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                        className="bg-cetera-dark-blue h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% complete</p>
                </div>
                )}

                {/* Preview Section */}
                {showPreview && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">📋 Data Preview</h3>
                    <PreviewTable />
                </div>
                )}

                {/* SQL Output */}
                {showSql && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 Generated SQL</h3>
                    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
                    {sqlStatements.join('\n\n')}
                    </div>
                </div>
                )}

                {/* Action Buttons */}
                {showConfig && (
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                    onClick={generateSQL}
                    disabled={isLoading || csvData.length === 0}
                    className="bg-cetera-orange text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    Generate SQL
                    </button>
                    <button
                    onClick={uploadToD1}
                    disabled={isLoading || sqlStatements.length === 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    Upload to D1
                    </button>
                    <button
                    onClick={downloadSQL}
                    disabled={sqlStatements.length === 0}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    Download SQL
                    </button>
                </div>
                )}
            </div>
        </div>
    );
};

export default CSVuploader;