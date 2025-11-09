"use client";

import { Info, Download, FileText } from "lucide-react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ExcelFormatInfoModal() {
  const downloadTemplate = () => {
    // TODO: Implement actual template download functionality
    // For now, create a simple CSV template
    const template = [
      "Employee Name,Department,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
      "John Doe,Operations,09:00-17:00,09:00-17:00,09:00-17:00,09:00-17:00,09:00-17:00,OFF,OFF",
      "Jane Smith,Support,08:00-16:00,08:00-16:00,08:00-16:00,08:00-16:00,08:00-16:00,09:00-13:00,OFF"
    ];

    const csvContent = template.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">
          Excel Format Information
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Complete guide for Excel file format requirements and structure
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-6 py-6">
        {/* Supported Formats Section */}
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Supported Formats
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center">
              <p className="font-medium text-sm font-mono">.xls</p>
              <p className="text-xs text-muted-foreground">Excel 97-2003</p>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center">
              <p className="font-medium text-sm font-mono">.xlsx</p>
              <p className="text-xs text-muted-foreground">Excel 2007+</p>
            </div>
          </div>
        </div>

        {/* File Requirements Section */}
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">File Requirements</h3>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>Maximum file size: 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>First row must contain column headers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>Time format: HH:MM (example: 09:00-17:00)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>Use "OFF" for days off</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Columns Section */}
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Required Columns</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Employee Name:</span>
                <span className="text-muted-foreground">Employee full name</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Department:</span>
                <span className="text-muted-foreground">Department name</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Monday-Sunday:</span>
                <span className="text-muted-foreground">Daily schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Example Format Section */}
        <div className="w-full max-w-md space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Example Format</h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4 text-xs font-mono overflow-x-auto">
            <pre>{`Employee Name,Department,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday
John Doe,Operations,09:00-17:00,09:00-17:00,09:00-17:00,09:00-17:00,09:00-17:00,OFF,OFF
Jane Smith,Support,08:00-16:00,08:00-16:00,08:00-16:00,08:00-16:00,08:00-16:00,09:00-13:00,OFF`}</pre>
          </div>
        </div>
      </div>

      <DialogFooter className="flex-col-reverse gap-2 sm:flex-row flex justify-center space-x-4 sm:justify-center">
        <Button
          variant="outline"
          onClick={() => {
            // Close dialog will be handled by DialogClose
          }}
          className="w-full sm:w-auto min-w-[140px]"
        >
          Close
        </Button>
        <Button
          onClick={downloadTemplate}
          className="w-full sm:w-auto min-w-[140px]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}