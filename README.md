# 🌐 Internet Login Portal Suite

![GitHub top language](https://img.shields.io/github/languages/top/divyanshyadav2828/Internet_login_portal?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/divyanshyadav2828/Internet_login_portal?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)

A dual-layered authentication system designed for seamless network access management. This suite features a high-end, cyberpunk-themed **Main System Portal** and a professional, enterprise-ready **Login Portal**.

---

## 🚀 Overview

This repository contains two distinct portal implementations, each tailored for different user experiences and environments. Both are powered by a robust Node.js backend with automated reconnection capabilities.

### 1. ⚡ Main System Portal (Root)
*The "Cyber-Admin" Interface*

The primary control center with a futuristic terminal aesthetic. Designed for users who want a high-tech, responsive dashboard for managing their network uplink.

- **🎨 UI/UX Design**: 
  - Dark mode with neon accents (Matrix Green, Neon Blue).
  - Terminal-style logging for real-time system feedback.
  - Glassmorphism effects and sharp, pixel-perfect layouts.
- **🛠 Key Features**:
  - `WATCHDOG`: Intelligent auto-reconnect system that monitors connection 24/7.
  - `SYS_PORTAL`: Direct integration with system-level commands (Lock, Sign-out).
  - `DYNAMO-NAME`: Fully configurable via `.env` for personalized branding.

### 2. 🛡️ Network Authentication Portal (`/login-portal`)
*The "Enterprise-Pro" Interface*

A clean, modern, and professional authentication page inspired by corporate AD login systems. Perfect for standard user environments.

- **🎨 UI/UX Design**:
  - Clean Inter typography with a focus on readability.
  - Professional white/brand-blue color palette.
  - Smooth floating label inputs and micro-animations.
- **🛠 Key Features**:
  - `AD_LOGIN`: Secure handling of Active Directory credentials.
  - `STATUS_SYNC`: Real-time connection status badges with heartbeat pulses.
  - `AUTO_MAINTAIN`: Background session maintenance toggle.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express |
| **Styling** | CSS3 (Custom Variables, Flexbox, Grids) |
| **Frontend** | Vanilla JS (ES6+), HTML5 |
| **Networking** | Axios, Ping-Wrapper |
| **Config** | Dotenv (Secure Environment Management) |

---

## ⚙️ Configuration

The entire suite is controlled by a single source of truth. Create a `.env` file in either directory based on the `.env.example` provided:

```env
PORT=3030
PORTAL_URL=https://172.16.16.16:8090/httpclient.html
PORTAL_USERNAME=your_id
PORTAL_PASSWORD=your_password
DISPLAY_NAME=Divyansh
```

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/divyanshyadav2828/Internet_login_portal.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or for the sub-portal
   cd login-portal && npm install
   ```

3. **Start the Engine**:
   ```bash
   node server.js
   ```

---

## 📸 Interface Preview

> [!TIP]
> Both portals are fully responsive and optimized for both desktop and mobile viewing.

*Designed with ❤️ by [Divyansh](https://github.com/divyanshyadav2828)*
