# 🚀 START THE SERVER

## Quick Start Commands

### For Windows (PowerShell or CMD):

```cmd
cd client
npm start
```

### What This Does:
1. Changes to the `client` directory
2. Starts the React development server
3. Opens your browser automatically
4. Server runs on `http://localhost:3000`

---

## 📋 Step-by-Step

### 1. Open Terminal in Project Folder
- Right-click in the `Career` folder
- Select "Open in Terminal" or "Open PowerShell here"

### 2. Navigate to Client Folder
```cmd
cd client
```

### 3. Start the Server
```cmd
npm start
```

### 4. Wait for Server to Start
You'll see:
```
Compiled successfully!

You can now view career-path in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 🎯 Next Steps After Server Starts

### 1. Create Admin User
Navigate to: `http://localhost:3000/create-admin`

### 2. Click "Create Admin User"
Wait for success message

### 3. Login
Go to: `http://localhost:3000/login`

Use credentials:
- Email: `tsepangtsehla31@gmail.com`
- Password: `Admin@123`

---

## 🐛 If Server Won't Start

### Error: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Error: "Missing script: start"
**Solution:** Make sure you're in the `client` folder:
```cmd
cd client
npm start
```

### Error: "Port 3000 already in use"
**Solution:** 
1. Close other apps using port 3000
2. Or use a different port:
```cmd
set PORT=3001 && npm start
```

### Error: "Module not found"
**Solution:** Install dependencies:
```cmd
npm install
npm start
```

---

## ✅ Server is Running When You See:

```
webpack compiled successfully
```

And your browser opens to `http://localhost:3000`

---

**Now you can create your admin user and start using the platform! 🎉**
