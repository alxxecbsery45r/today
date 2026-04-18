#!/bin/bash

echo "🚀 AJKMart Full System Auto-Installer Start ho raha hai..."

# 1. NODE.JS CHECK AUR INSTALLATION
if ! command -v node &> /dev/null; then
    echo "🌐 Node.js nahi mila. Install kar raha hun..."
    # NodeSource se latest Node.js install karne ka tarika
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js pehle se maujood hai."
fi

# 2. PNPM CHECK AUR INSTALLATION
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm nahi mila. Global install kar raha hun..."
    sudo npm install -g pnpm
else
    echo "✅ pnpm pehle se maujood hai."
fi

# 3. FILE PERMISSIONS
chmod +x start_ajkmart.sh

# 4. ALIASES SETUP
echo "🔗 Shortcuts (Aliases) set kar raha hun..."
sed -i '/start_ajkmart.sh/d' ~/.bashrc
echo "alias api='$(pwd)/start_ajkmart.sh api'" >> ~/.bashrc
echo "alias admin='$(pwd)/start_ajkmart.sh admin'" >> ~/.bashrc
echo "alias rider='$(pwd)/start_ajkmart.sh rider'" >> ~/.bashrc
echo "alias vendor='$(pwd)/start_ajkmart.sh vendor' " >> ~/.bashrc
echo "alias ajkmart='$(pwd)/start_ajkmart.sh customer'" >> ~/.bashrc

# 5. MODULES INSTALLATION
echo "🏗️ Sab projects ke modules install kar raha hun..."
pnpm install
apps=("api-server" "admin" "rider-app" "vendor-app" "ajkmart")
for app in "${apps[@]}"; do
    if [ -d "artifacts/$app" ]; then
        echo "⏳ Installing modules for $app..."
        cd "artifacts/$app" && pnpm install && cd ../..
    fi
done

echo "🎉 SAB KUCH TAYYAR HAI!"
echo "Ab terminal restart karein ya 'source ~/.bashrc' likhein."
