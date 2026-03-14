# AuraStylist Deployment Guide for RHEL EC2 (Next.js + FastAPI)

This guide covers deploying the AuraStylist frontend (Next.js) and backend (FastAPI) on a single Red Hat Enterprise Linux (RHEL) EC2 instance.

---

### Step 1: Launch and Connect to your RHEL EC2 Instance
1. Go to the AWS Console and launch an EC2 instance.
   - **OS/AMI**: Select the **Red Hat Enterprise Linux (RHEL) 9** (or 8) AMI.
   - **Instance Type**: `t3.micro` or `t3.small` (t3.small is better because Next.js compilation requires some memory).
   - **Network Settings**: Allow SSH (port 22), HTTP (port 80), and HTTPS (port 443) from anywhere.
2. Connect to your instance using SSH (Note the username for RHEL is `ec2-user`, not `ubuntu`):
   ```bash
   ssh -i /path/to/your-key.pem ec2-user@<your-ec2-public-ip>
   ```

---

### Step 2: Install Required Software on RHEL
Update your RHEL system and install the necessary dependencies: Python, Node.js, Git, and Nginx.

```bash
# Update system packages
sudo dnf update -y

# Install Python, pip, and Git
sudo dnf install python3 python3-pip git -y

# Install Node.js (Version 20 is recommended)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs -y

# Verify Node.js installation
node -v

# Install Nginx
sudo dnf install nginx -y
sudo systemctl enable --now nginx

# Install PM2 (Process Manager for Node.js globally)
sudo npm install pm2 -g
```

---

### Step 3: Clone Your Code
Next, clone your AuraStylist repository to the server.

```bash
# Clone your repository (use your actual git URL)
git clone https://github.com/yourusername/AuraStylist.git
cd AuraStylist
```

---

### Step 4: Setup the FastAPI Backend
Set up the Python virtual environment and run the backend using Gunicorn and Uvicorn.

```bash
cd aurastylist-backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements + production server packages
pip install -r requirements.txt
pip install gunicorn uvicorn

# Create your .env file
nano .env
# Paste your environment variables (OpenAI keys, Supabase URLs, etc.) here. Press Ctrl+O, Enter, Ctrl+X to save and exit.
```

**Run the Backend as a Background Service**
Create a systemd service file to keep FastAPI running in the background.

```bash
sudo nano /etc/systemd/system/fastapi.service
```
Paste the following inside it:
```ini
[Unit]
Description=Gunicorn process to serve FastAPI
After=network.target

[Service]
User=ec2-user
Group=nginx
WorkingDirectory=/home/ec2-user/AuraStylist/aurastylist-backend
Environment="PATH=/home/ec2-user/AuraStylist/aurastylist-backend/venv/bin"
ExecStart=/home/ec2-user/AuraStylist/aurastylist-backend/venv/bin/gunicorn -k uvicorn.workers.UvicornWorker -w 2 --bind 127.0.0.1:8000 main:app

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl start fastapi
sudo systemctl enable fastapi
```

---

### Step 5: Setup the Next.js Frontend
Now let's build and run the Next.js app using PM2.

```bash
# Move to frontend directory
cd /home/ec2-user/AuraStylist/aurastylist-frontend

# Install node modules
npm install

# Build the Next.js project
npm run build

# Start the frontend application using PM2
pm2 start npm --name "aurastylist-frontend" -- start

# Make PM2 start on boot
pm2 startup
# (Run the command PM2 spits out at the bottom of the output, something like 'sudo env PATH...')
pm2 save
```

---

### Step 6: Configure Nginx Reverse Proxy
Nginx will route port 80 traffic to Next.js (port 3000) and API requests to FastAPI (port 8000).

1. Edit the default Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```
2. Find the `server { ... }` block inside that file that listens on port `80` with the `server_name _`. 
Replace the inside of that block with this:

```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  _;
    root         /usr/share/nginx/html;

    # Route /api to FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route everything else to Next.js frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /404.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}
```

3. Test the Nginx syntax:
   ```bash
   sudo nginx -t
   ```
4. Restart Nginx to apply changes:
   ```bash
   sudo systemctl restart nginx
   ```

---

### Step 7: Handle RHEL Security (SELinux)
RHEL has **SELinux** enabled by default, which strictly controls how Nginx connects to network ports. By default, Nginx is not allowed to proxy traffic to ports `8000` or `3000`. You must explicitly tell SELinux to allow this:

```bash
# Allow Nginx to connect to network ports (FastAPI/Next.js)
sudo setsebool -P httpd_can_network_connect 1

# If RHEL firewalld is running, open the HTTP port:
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```
