import Image from "next/image";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useController, Control } from "react-hook-form";

interface ImageSelectorProps {
  name: string,
  control: Control<any>,
}

export default function ImageSelector({ name, control } : ImageSelectorProps) {
  const { 
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: "An image is required."},
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  return(
    <div>
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full h-32">
            <Image
              src={
                value instanceof File ? URL.createObjectURL(value) : value
              }
              style={{ objectFit: 'cover' }}
              alt="Uploaded image"
              fill
            />
          </div>
        ) : <p className="text-gray-500">Click or drag and drop an image here</p>}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}