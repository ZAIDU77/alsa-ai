// src/utils/plugins/db_creator.cjs
// Pure Node.js SQLite database creator — no Python required.
// Handles both native JS arrays AND JSON-string columns/data (as the AI sends them).
'use strict';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

/** Safely parse a value that may already be an object/array or a JSON string */
function safeParse(val, fallback) {
  if (val === null || val === undefined) return fallback;
  if (typeof val !== 'string') return val; // already parsed
  try { return JSON.parse(val); } catch { return fallback; }
}

function createDatabase({ file_path, tables = [] }) {
  return new Promise((resolve) => {
    let targetPath = file_path.endsWith('.db') ? file_path : `${file_path}.db`;
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    const db = new sqlite3.Database(targetPath, (err) => {
      if (err) return resolve({ success: false, error: err.message });
    });

    const createdTables = [];

    db.serialize(() => {
      for (const table of tables) {
        // Columns may arrive as a JSON string from the AI tool schema
        const columns = safeParse(table.columns, []);

        if (!Array.isArray(columns) || columns.length === 0) {
          // Fallback: create a minimal id + data table
          db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)`);
          createdTables.push(table.name);
          continue;
        }

        // Build column definitions
        const colDefs = columns.map(c => {
          const colName = c.name || 'col';
          const colType = (c.type || 'TEXT').toUpperCase();
          let def = `${colName} ${colType}`;
          if (c.primary_key) {
            def += ' PRIMARY KEY';
            if (colType === 'INTEGER') def += ' AUTOINCREMENT';
          }
          if (c.not_null && !c.primary_key) def += ' NOT NULL';
          if (c.default !== undefined && c.default !== null) {
            const defVal = typeof c.default === 'string' ? `'${c.default}'` : c.default;
            def += ` DEFAULT ${defVal}`;
          }
          return def;
        }).join(', ');

        db.run(`CREATE TABLE IF NOT EXISTS "${table.name}" (${colDefs})`);

        // Sample data may also be a JSON string
        const sampleData = safeParse(table.sample_data, []);

        if (Array.isArray(sampleData) && sampleData.length > 0) {
          const placeholders = columns.map(() => '?').join(', ');
          const stmt = db.prepare(`INSERT INTO "${table.name}" VALUES (${placeholders})`);
          for (const row of sampleData) {
            const rowArr = Array.isArray(row) ? row : Object.values(row);
            stmt.run(rowArr);
          }
          stmt.finalize();
        }

        createdTables.push(table.name);
      }
    });

    db.close((err) => {
      if (err) resolve({ success: false, error: err.message });
      else resolve({
        success: true,
        message: `SQLite database created: ${targetPath}`,
        file_path: targetPath,
        tables: createdTables,
      });
    });
  });
}

// CLI entry
if (require.main === module) {
  const input = JSON.parse(process.argv[2] || '{}');
  createDatabase(input).then(res => console.log(JSON.stringify(res)));
}

module.exports = { createDatabase };