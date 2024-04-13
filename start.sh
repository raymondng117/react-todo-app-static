. "$(dirname "$0")/.env"

# Print environment variables to verify they are loaded correctly

# Configure ngrok authentication token
ngrok config add-authtoken $REACT_APP_NGROK_API_APPLICATION_TOKEN

# Run react application in the background
# npm run start &

# sleep 15

# Start ngrok and expose 8080 to ngrok tunnel
ngrok http --domain=$REACT_APP_NGROK_DOMAIN $REACT_APP_NGROK_LOCAL_PORT_EXPOSE

