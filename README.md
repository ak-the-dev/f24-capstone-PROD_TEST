# **Centsible**

Welcome to **Centsible**! 🎉  
This is the latest production version of our project. Dive into the code and see how everything works by visiting our [GitHub Repository](https://github.com/ak-the-dev/f24-capstone-PROD_TEST).

---

## **Download**

Get started with **Centsible** by downloading the project directly from GitHub. You can choose to clone the repository or download it as a ZIP file.

### **Download Options:**

- **Clone the Repository:**
  ```bash
  git clone https://github.com/ak-the-dev/f24-capstone-PROD_TEST.git
  ```

- **Download as ZIP:**
  Click the button below to download the repository as a ZIP file.

  [![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue)](https://github.com/ak-the-dev/f24-capstone-PROD_TEST/archive/refs/heads/main.zip)

---

## **Getting Started**

Ready to get Centsible up and running on your local machine? Follow these simple steps:

### **1. Clone the Repository**
First, you'll need to copy the repository to your local machine. Open your terminal and run:
```bash
git clone <repository-url>
```

### **2. Navigate to the Project Folder**
Move into the project's root directory:
```bash
cd <repository-directory>
```

### **3. Set Up Your Environment Variables**
Create a `.env` file in the root directory and add your Firebase keys. This is crucial for the app to connect to Firebase services.

### **4. Install Dependencies**
Make sure you have all the necessary packages installed by running:
```bash
npm install
```

---

## **Available Scripts**

We've set up several scripts to help you manage and develop the application efficiently. Here's a quick rundown:

### **Optimized Build**
Need to run the app with an optimized production build? Just execute:
```bash
npm start
```
This command does two things:
- Builds the app using `react-scripts build` for a production-ready version.
- Serves the application concurrently for a smooth experience.

---

### **Development Mode**
Working on new features? Start the app in development mode with live updates and Firebase emulators:
```bash
npm run dev
```
This will:
- Launch the React frontend with `react-scripts start`.
- Start Firebase emulators for authentication and Firestore with `firebase emulators:start --only auth,firestore`.

---

### **Frontend Only (Live Updates)**
If you only need to work on the frontend and want live updates, use:
```bash
npm run react
```
This simply runs:
- `react-scripts start` to kick off the React development server.

---

### **Create a Static Optimized Build**
To generate a static, optimized version of the React app, run:
```bash
npm run build
```
This command executes:
- `react-scripts build` to bundle your app for production.

---

### **Deploy to GitHub Pages**
Ready to share your awesome work? Deploy the optimized build to GitHub Pages with:
```bash
npm run predeploy
npm run deploy
```
Here's what happens:
1. `npm run build` creates the optimized build.
2. `gh-pages -d build` deploys the build to GitHub Pages.

---

## **Project Features**

Here's what we've built so far:

✔️ **Login & Register Page**  
  Easily create an account or log in to access your dashboard.

✔️ **Dashboard Page**  
  Get an overview of your financial status at a glance.

✔️ **Purchase Page**  
  Manage and track your purchases effortlessly.

✔️ **Paycheck Page**  
  Keep track of your income and manage your paychecks.

✔️ **Goals Page**  
  Set and monitor your financial goals to stay on track.

✔️ **Track Spending Page**  
  Monitor your spending habits and make informed decisions.

---

We're excited to have you here! If you have any questions or need assistance, feel free to reach out. Let's make managing finances **Centsible** together! 💰✨