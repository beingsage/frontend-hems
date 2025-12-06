FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY scripts/ml/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML service code
COPY scripts/ml/main.py .

# Expose port
EXPOSE 8000

# Run the service
CMD ["python", "main.py"]
