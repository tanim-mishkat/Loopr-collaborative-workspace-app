# Loopr | A Collaborative Workspace Application  

**Version:** 0.1.0  

## 📚 Project Overview  

Loopr is a feature-rich, collaborative workspace application built using Next.js. This project allows users to:  
1. Sign up, sign in, and sign out.  
2. Create and manage personal or organizational workspaces.  
3. Write and collaborate on documents, utilize generative AI for content creation, and much more.  
4. Add comments and receive notifications.  
5. Upload and set cover images for workspaces and documents.  

### 🚀 Features  

- **User Authentication:** Sign up and sign in with Clerk.js.  
- **Workspace Management:** Create personal or organizational workspaces.  
- **Collaborative Documents:** Create, write, and collaborate in real-time.  
- **Generative AI Support:** Use the Gemini API for AI-assisted writing.  
- **Emoji Picker:** Add emojis to your workspace and documents.  
- **Customizable Covers:** Upload and set cover images for workspaces.  
- **Comments and Notifications:** Add comments and receive notifications.  
- **User-friendly UI:** Minimalistic design using ShadCN, Radix UI, and TailwindCSS.  

---

## 🎥 Demo Video  

Check out the full project demo on YouTube: [Loopr - Collaborative Workspace App Demo](https://youtu.be/xinHzGWfjxc)  

---

## 🛠️ Technologies Used  

- **Framework:** [Next.js](https://nextjs.org/) (v14.2.5)  
- **UI Components:** TailwindCSS, ShadCN, Radix UI  
- **Real-time Collaboration:** Liveblocks  
- **Authentication:** Clerk.js  
- **Generative AI:** Gemini API  
- **Database:** Firebase  
- **Editor:** Editor.js  

---  

## 📋 Prerequisites

Ensure you have the following installed before setting up the project:

1. **Node.js** (v16 or later)
2. **npm** or **yarn**
3. **Firebase Project**
4. **Clerk.js API Keys**
5. **Gemini API Key**
6. **Vercel Account** (for deployment)

---

## ⚙️ Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/tanim-mishkat/Loopr-collaborative-workspace-app.git
   cd loopr
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase:

   - Create a Firebase project.
   - Enable Firestore and Authentication in the Firebase Console.
   - Download the Firebase config and place it in `firebaseConfig.js`.

4. Configure Clerk.js:

   - Sign up for a Clerk.js account.
   - Copy the API keys and paste them into `.env.local`.

5. Add `.env.local` file:

   ```plaintext
   NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
   CLERK_API_KEY=your_clerk_api_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## 🚀 Deployment Guide

### Deploying to Vercel

Loopr is optimized for deployment on Vercel. Follow these steps to deploy your own instance:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Install Vercel CLI** (Optional)
   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**
   - Fork this repository to your GitHub account
   - Log in to your Vercel dashboard
   - Click "New Project"
   - Import your forked repository
   - Configure the project settings:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: next build
     - Output Directory: .next

4. **Configure Environment Variables**
   - Add all the environment variables from your `.env.local` file to the Vercel project settings
   - Required variables:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     NEXT_PUBLIC_CLERK_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_SIGN_UP_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     NEXT_PUBLIC_GEMINI_API_KEY
     NEXT_PUBLIC_MAX_FILE_SIZE
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a production URL

6. **Custom Domain** (Optional)
   - In your Vercel project settings, navigate to "Domains"
   - Add and configure your custom domain

### Performance Optimization Tips

1. **Enable Caching**
   - Utilize Vercel's Edge Cache for improved performance
   - Add caching headers to static assets

2. **Image Optimization**
   - Use Next.js Image component for automatic optimization
   - Consider using a CDN for large media files

3. **Monitoring**
   - Enable Vercel Analytics to monitor performance
   - Set up error tracking with Sentry or similar services

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### JSON Parsing Errors

If you encounter `Unexpected end of JSON input` errors:

1. **Check Firebase Data**: Ensure your document data in Firebase is properly formatted JSON
2. **Clear Browser Cache**: Sometimes cached data can cause parsing issues
3. **Verify Document Structure**: Make sure your document structure follows the Editor.js format

#### Editor.js Rendering Issues

If the editor fails to render content:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Editor Initialization**: Make sure the editor is properly initialized before rendering content
3. **Check Data Format**: Ensure the data structure matches what Editor.js expects

#### Authentication Problems

If you experience issues with Clerk authentication:

1. **Verify Environment Variables**: Double-check all Clerk-related environment variables
2. **Check Clerk Dashboard**: Ensure your application is properly configured in the Clerk dashboard
3. **Clear Browser Cookies**: Sometimes authentication issues can be resolved by clearing cookies

#### Slow Performance

If the application feels sluggish:

1. **Optimize Images**: Ensure all images are properly optimized
2. **Reduce Bundle Size**: Consider code splitting and lazy loading components
3. **Check Network Tab**: Use browser dev tools to identify slow network requests

---

# 🖼️ Project Walkthrough

### 1. **Home Page**

The home page allows users to sign up or log in.

#### Sign Up

![Sign Up Screenshot](./public/signup.png)

#### Sign In

![Sign In Screenshot](./public/signin.png)

---

### 2. **Dashboard**

After login, users can view their personal and organizational workspaces.  
![Dashboard Screenshot](./public/WorkspaceDashboard.png)

---

### 3. **Workspace Creation**

Users can create a workspace by adding a title, cover image, and emoji.  
![Create Workspace Screenshot](./public/createWorkspace.png)

---

### 4. **Document Editor**

Within a workspace, users can create and collaborate on documents in real-time.  
![Document Editor Screenshot](./public/documentEditor.png)

---

### 5. **Comments and Notifications**

Users can leave comments and stay updated on workspace activity via notification.

#### Comments

![Comments Screenshot](./public/comment.png)

#### Notifications

![Notifications Screenshot](./public/notificationimg.png)

---

## 📜 Scripts

- `npm run dev` – Starts the development server.
- `npm run build` – Builds the project for production.
- `npm run start` – Starts the production server.
- `npm run lint` – Runs ESLint checks.

---

## 📂 Folder Structure

```
microsoft-loop-clone/
├── components/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Editor/
│   └── Workspace/
├── pages/
│   ├── api/
│   ├── dashboard.js
│   ├── index.js
│   └── workspace/
├── styles/
│   ├── globals.css
│   └── tailwind.css
├── utils/
│   ├── firebaseConfig.js
│   └── liveblocksConfig.js
├── .env.local
├── package.json
└── README.md
```

---

## 🌟 Contributing

Feel free to fork this project and contribute by submitting pull requests. Make sure to adhere to the project's coding standards.

---

## 🛡️ License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 📧 Contact

If you have any questions or suggestions, feel free to contact the maintainer at [t5mishkat@gmail.com].

---

Let me know if you need additional details or customization!
