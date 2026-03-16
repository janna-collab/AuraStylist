# Use RHEL Universal Base Image (UBI) 9 for Python 3.11
FROM registry.access.redhat.com/ubi9/python-311:latest

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies using dnf
USER root
RUN dnf update -y && \
    dnf install -y gcc python3-devel libpq-devel && \
    dnf clean all
USER 1001

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose the API port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
