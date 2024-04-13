# Use node image as base
FROM node:18

# Install ngrok
RUN curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
    | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
    | tee /etc/apt/sources.list.d/ngrok.list && \
    apt-get update && \
    apt-get install -y ngrok

RUN apt-get install -y dos2unix

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .


RUN chmod 600 .env

RUN dos2unix .env

# Set executable permissions for the start script
RUN chmod +x start.sh

RUN tr -d '\r' < start.sh > start-fixed.sh \
    && chmod +x start-fixed.sh

# Command to run the application with wait-for-it and then start the React app
CMD ["./start-fixed.sh"]
