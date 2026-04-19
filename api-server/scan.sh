#!/bin/bash
echo "🔍 Scanning project structure..."

# 1. Check Directories
folders=("src/controllers" "src/routes" "src/db" "src/middleware" "src/services" "public/uploads")
for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        echo "✅ Folder exists: $folder"
    else
        echo "❌ Missing folder: $folder"
    fi
done

# 2. Check Essential Files
files=("src/index.ts" "drizzle.config.ts" ".env.development" "dist/index.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ File exists: $file"
    else
        echo "❌ Missing file: $file"
    fi
done

# 3. Check ENV Variables
echo "🔑 Checking Environment Variables..."
vars=("DATABASE_URL" "JWT_SECRET" "PORT")
for var in "${vars[@]}"; do
    if grep -q "$var" .env.development; then
        echo "✅ Env variable found: $var"
    else
        echo "❌ Missing env variable in .env.development: $var"
    fi
done

echo "🚀 Scan Complete!"
