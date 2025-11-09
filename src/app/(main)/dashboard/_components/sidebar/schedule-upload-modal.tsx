"use client";

import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScheduleUploadModal() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Check if file is Excel
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.name.toLowerCase().endsWith(".xls") ||
      file.name.toLowerCase().endsWith(".xlsx")
    ) {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona un archivo Excel (.xls o .xlsx)");
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleValidateSchedule = () => {
    if (selectedFile) {
      // TODO: Implement file upload and validation logic
      console.log("Validating schedule file:", selectedFile.name);
      // Close modal after successful upload
      // This will be handled by the Dialog component
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl font-bold">
          Add New Schedule
        </DialogTitle>
        <DialogDescription className="text-center text-base">
          Suelta aquí tu archivo Excel (.xls o .xlsx) del horario mensual
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center space-y-6 py-6">
        {/* File Upload Area */}
        <div
          className={cn(
            "w-full max-w-md border-2 border-dashed rounded-lg p-8 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-gray-300 hover:border-gray-400",
            selectedFile && "border-primary bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileInputClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center space-y-4 cursor-pointer">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Haz clic para seleccionar o arrastra el archivo aquí
                </p>
                <p className="text-xs text-gray-500">
                  Archivos compatibles: .xls, .xlsx
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileInputClick();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-green-100 p-4">
                <File className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Eliminar Archivo
              </Button>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="flex-col-reverse gap-2 sm:flex-row flex justify-center space-x-4 sm:justify-center">
        <Button
          variant="outline"
          onClick={handleRemoveFile}
          className="w-full sm:w-auto min-w-[140px]"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleValidateSchedule}
          disabled={!selectedFile}
          className="w-full sm:w-auto min-w-[140px]"
        >
          Validate Schedule
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}