#!/bin/bash

echo "🚀 Setting up PhonePe SDK Integration"
echo "====================================="

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your credentials."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your PhonePe credentials"
echo "2. Run 'npm start' to start the server"
echo "3. Run 'npm test' to test the integration"
echo ""
echo "🔧 Available commands:"
echo "  npm start     - Start the server"
echo "  npm run dev   - Start in development mode"
echo "  npm test      - Run tests"
echo ""
echo "📚 Check README.md for detailed usage instructions."

