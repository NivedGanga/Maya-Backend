FROM node:18-alpine

# Install and nodemon
RUN npm install -g nodemon

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./ 
RUN npm install
RUN npm install bcrypt

# Copy project files
COPY . . 

# Expose the application port
EXPOSE 5001

# Default command for development
CMD ["npx", "nodemon", "src/index.js"]
