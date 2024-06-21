# Define the path to the TypeScript file
$filePath = ".\supabase.types.ts"

# Read the content of the file as a single string
$fileContent = Get-Content $filePath -Raw

# Define the current and new type definitions
$oldTypeDefinition = 'export type Json =\s*\| string\s*\| number\s*\| boolean\s*\| null\s*\| \{ \[key: string\]: Json \| undefined \}\s*\| Json\[\]'
$newTypeDefinition = 'export type Json = { [key: string]: any } | any'

# Replace the old type definition with the new one
$updatedContent = $fileContent -replace $oldTypeDefinition, $newTypeDefinition

# Write the updated content back to the file
$updatedContent | Set-Content $filePath