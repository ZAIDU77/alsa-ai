// src/utils/plugins/excel_creator.cjs
// Pure Node.js Excel creator using ExcelJS — NO Python required
'use strict';

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

/**
 * Parse a hex color string to ARGB format expected by ExcelJS.
 * ExcelJS uses "FFRRGGBB" — input may be "#4472C4" or "4472C4"
 */
function toArgb(hex, alpha = 'FF') {
  const clean = (hex || '4472C4').replace('#', '').toUpperCase();
  return `${alpha}${clean.padStart(6, '0')}`;
}

async function createExcel({
  file_path,
  sheet_name = 'Sheet1',
  headers = [],
  data = [],
  formatting = {},
}) {
  let targetPath = file_path.endsWith('.xlsx') ? file_path : `${file_path}.xlsx`;
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  const {
    header_color = '#4472C4',
    alternating_rows = true,
    auto_width = true,
  } = formatting || {};

  const workbook  = new ExcelJS.Workbook();
  workbook.creator = 'Alsa AI — Zentryx Tech Solutions';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheet_name, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // ── HEADERS ──────────────────────────────────────────────────────────────────
  const headerArgb = toArgb(header_color);
  worksheet.columns = headers.map((h, i) => ({
    header: h,
    key: `col${i}`,
    width: 18,
  }));

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerArgb },
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FFFFFFFF' } },
    };
  });
  headerRow.height = 22;

  // ── DATA ROWS ────────────────────────────────────────────────────────────────
  const altArgb = 'FFDCE6F1'; // light blue tint for alternating rows
  data.forEach((rowValues, rowIdx) => {
    const row = worksheet.addRow(rowValues);
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      // Attempt to auto-detect numeric values
      const rawVal = rowValues[colNum - 1];
      if (rawVal !== undefined && rawVal !== null && rawVal !== '' && !isNaN(Number(rawVal))) {
        cell.value = Number(rawVal);
      }

      // Alternating row colour
      if (alternating_rows && rowIdx % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: altArgb },
        };
      }

      cell.alignment = { vertical: 'middle', wrapText: false };
      cell.font = { size: 10, name: 'Calibri' };
    });
    row.height = 18;
  });

  // ── AUTO-WIDTH ────────────────────────────────────────────────────────────────
  if (auto_width) {
    worksheet.columns.forEach((col, i) => {
      let maxLen = (headers[i] || '').toString().length;
      data.forEach(row => {
        const cell = row[i];
        const len = cell !== null && cell !== undefined ? String(cell).length : 0;
        if (len > maxLen) maxLen = len;
      });
      col.width = Math.min(Math.max(maxLen + 4, 10), 60);
    });
  }

  // ── TABLE (structured table for Excel filter/sort) ───────────────────────────
  if (headers.length > 0 && data.length > 0) {
    const lastCol = String.fromCharCode(64 + headers.length); // e.g. 'E' for 5 headers
    worksheet.addTable({
      name: sheet_name.replace(/\s+/g, '_'),
      ref: `A1`,
      headerRow: true,
      totalsRow: false,
      style: { theme: 'TableStyleMedium9', showRowStripes: alternating_rows },
      columns: headers.map(h => ({ name: h, filterButton: true })),
      rows: data,
    });
  }

  // Save
  await workbook.xlsx.writeFile(targetPath);
  return { success: true, message: `Excel file created: ${targetPath}`, file_path: targetPath };
}

// CLI entry
if (require.main === module) {
  const input = JSON.parse(process.argv[2] || '{}');
  createExcel(input)
    .then(res => console.log(JSON.stringify(res)))
    .catch(err => console.log(JSON.stringify({ success: false, error: err.message })));
}

module.exports = { createExcel };