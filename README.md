# GGLDrive - Google Drive Replica

A modern, responsive Google Drive replica built with Next.js 14, TypeScript, and AWS Cognito authentication.

## Features

- 🔐 **AWS Cognito Authentication** - Secure user registration and login
- 📁 **File Management** - Upload, download, delete, and organize files
- 📂 **Folder Structure** - Create and navigate through folders
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔍 **File Preview** - Support for various file types
- ⚡ **Real-time Updates** - Instant file operations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: AWS Cognito
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Cognito User Pool (configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ggldrive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure AWS Cognito**
   
   Update the configuration in `lib/amplify-config.ts`:
   ```typescript
   const amplifyConfig = {
     Auth: {
       region: 'your-region',
       userPoolId: 'your-user-pool-id',
       userPoolWebClientId: 'your-client-id',
       authenticationFlowType: 'USER_SRP_AUTH',
     },
   };
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ggldrive/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── LoginForm.tsx      # Login/signup form
│   ├── DriveInterface.tsx # Main drive interface
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── FileGrid.tsx       # File display grid
│   ├── FileCard.tsx       # Individual file card
│   ├── FileList.tsx       # File list view
│   ├── UploadModal.tsx    # File upload modal
│   └── CreateFolderModal.tsx # Folder creation modal
├── lib/                   # Utility libraries
│   ├── amplify-config.ts  # AWS Amplify configuration
│   ├── auth.ts           # Authentication functions
│   └── file-storage.ts   # File storage management
└── public/               # Static assets
```

## Features Overview

### Authentication
- User registration with email verification
- Secure login/logout
- Session management
- Protected routes

### File Management
- Upload multiple files via drag & drop
- Download files
- Delete files and folders
- Rename files and folders
- Create new folders

### User Interface
- Grid and list view modes
- File type icons
- Responsive design
- Modern Google Drive-like interface
- Breadcrumb navigation

### File Storage
- Local storage implementation (for demo)
- File metadata management
- Folder hierarchy support
- File size and date tracking

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js`
- Updating component styles in `app/globals.css`
- Changing color schemes in the config

### File Storage
Currently uses localStorage for demo purposes. To integrate with real cloud storage:
- Replace `lib/file-storage.ts` with AWS S3 integration
- Implement proper file upload/download APIs
- Add file sharing and collaboration features

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables for AWS Cognito
4. Deploy

### Other Platforms
- AWS Amplify
- Netlify
- Railway
- Any Node.js hosting platform

## Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_AWS_REGION=your-region
NEXT_PUBLIC_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=your-client-id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Google Drive for design inspiration
- AWS Cognito for authentication
- Next.js team for the amazing framework
- Tailwind CSS for styling utilities
