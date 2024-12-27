FROM node:18-alpine

# Install bash and nodemon
RUN apk add --no-cache bash
RUN npm install -g nodemon

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Copy wait-for-it.sh script
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Expose the application port
EXPOSE 5001

# Default command for development
CMD ["./wait-for-it.sh", "db:3306", "--", "npx", "nodemon", "src/index.js"]
